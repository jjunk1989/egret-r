"use strict";

/**
 * Fix egret.X / eui.X / egret_native.X → X for imported symbols.
 * After namespace unwrapping, all symbols are top-level in each module,
 * but old code still references them as namespace-qualified.
 */

var fs = require('fs');
var path = require('path');

var ROOT = path.join(__dirname, '..');

var PREFIXES = ['egret', 'eui', 'egret_native', 'game'];

function walkTs(dir) {
  var results = [];
  var entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return results; }
  for (var i = 0; i < entries.length; i++) {
    var fp = path.join(dir, entries[i].name).replace(/\\/g, '/');
    if (entries[i].isDirectory() && entries[i].name !== 'node_modules') {
      results = results.concat(walkTs(fp));
    } else if (entries[i].name.endsWith('.ts') && !entries[i].name.endsWith('.d.ts')) {
      results.push(fp);
    }
  }
  return results;
}

function fixQualifiedRefs(content) {
  // Extract all imported symbols
  var importedByPrefix = {};
  
  var importRegex = /import\s+\{([^}]+)\}\s+from\s+'[^']+'/g;
  var m;
  while ((m = importRegex.exec(content)) !== null) {
    var symbolsStr = m[1];
    var symbols = symbolsStr.split(',');
    for (var i = 0; i < symbols.length; i++) {
      var sym = symbols[i].trim();
      // Handle "Foo as Bar"
      var asIdx = sym.indexOf(' as ');
      if (asIdx !== -1) sym = sym.substring(asIdx + 4).trim();
      
      // Try to match namespace prefix patterns
      for (var p = 0; p < PREFIXES.length; p++) {
        var prefix = PREFIXES[p];
        // Check if imported from a file within the same prefix namespace
        // We just register all imports under all prefixes for replacement
        if (!importedByPrefix[prefix]) importedByPrefix[prefix] = {};
        importedByPrefix[prefix][sym] = true;
      }
    }
  }
  
  // Also collect symbols exported in this file (self-declared)
  var exportRegex = /export\s+(class|interface|function|const|let|enum|abstract\s+class|type)\s+(\w+)/g;
  var selfDeclared = {};
  while ((m = exportRegex.exec(content)) !== null) {
    selfDeclared[m[2]] = true;
  }
  
  var modified = false;
  var newContent = content;
  
  // For each prefix, replace qualified references
  for (var p = 0; p < PREFIXES.length; p++) {
    var prefix = PREFIXES[p];
    var syms = importedByPrefix[prefix];
    if (!syms) continue;
    
    for (var sym in syms) {
      if (sym.length < 2) continue;
      if (selfDeclared[sym]) continue; // Don't replace self-references
      
      var pattern = prefix + '.' + sym;
      var escaped = pattern.replace(/\./g, '\\.');
      var regex = new RegExp('\\b' + escaped + '\\b', 'g');
      
      if (regex.test(newContent)) {
        newContent = newContent.replace(regex, sym);
        modified = true;
      }
    }
  }
  
  return modified ? newContent : null;
}

// Main
var pkgDirs = ['core', 'eui', 'game', 'tween', 'socket'];
var totalFixed = 0;

console.log('Fixing egret.X / eui.X qualified references...\n');

for (var p = 0; p < pkgDirs.length; p++) {
  var srcDir = path.join(ROOT, 'packages', pkgDirs[p], 'src');
  if (!fs.existsSync(srcDir)) continue;

  var files = walkTs(srcDir);
  var fixed = 0;

  for (var f = 0; f < files.length; f++) {
    var rel = path.relative(srcDir, files[f]);
    if (rel === 'Defines.ts' || rel === 'ClassRegistry.ts' || rel === 'index.ts') continue;
    if (rel === 'text/TextField.ts') continue;

    var content = fs.readFileSync(files[f], 'utf8');
    
    // Quick check: does file have qualified refs?
    if (!/egret\.\w+|eui\.\w+|egret_native\.\w+/.test(content)) continue;

    var fixedContent = fixQualifiedRefs(content);
    if (fixedContent) {
      fs.writeFileSync(files[f], fixedContent, 'utf8');
      fixed++;
    }
  }

  if (fixed > 0) {
    console.log('  @egret-r/' + pkgDirs[p] + ': ' + fixed + ' files fixed');
    totalFixed += fixed;
  }
}

console.log('\nTotal: ' + totalFixed + ' files fixed.\n');

// Verify
console.log('--- Verification ---');
var sample = path.join(ROOT, 'packages', 'core', 'src', 'web', 'WebPlayer.ts');
if (fs.existsSync(sample)) {
  var remaining = (fs.readFileSync(sample, 'utf8').match(/egret\.\w+/g) || []);
  console.log('WebPlayer.ts egret. refs remaining: ' + remaining.length);
  if (remaining.length > 0) console.log('  Sample: ' + remaining.slice(0, 5).join(', '));
}
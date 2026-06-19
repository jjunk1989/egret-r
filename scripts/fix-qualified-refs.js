"use strict";

/**
 * Fix qualified references left from sub-namespace unwrapping.
 * 
 * After unwrapping namespace egret.sys { export class NormalBitmapNode {} },
 * the code still has:
 *   new sys.NormalBitmapNode()
 *   <sys.NormalBitmapNode>
 *   sys.RenderNodeType.Render
 * 
 * This script:
 * 1. Finds all imported symbols
 * 2. Replaces qualified sys.X / eui_sys.X / egret_native.X with direct X
 */

var fs = require('fs');
var path = require('path');

var ROOT = path.join(__dirname, '..');

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
  var importedSymbols = {};
  var importRegex = /import\s+\{([^}]+)\}\s+from\s+'[^']+'/g;
  var m;
  while ((m = importRegex.exec(content)) !== null) {
    var symbolsStr = m[1];
    var symbols = symbolsStr.split(',');
    for (var i = 0; i < symbols.length; i++) {
      var sym = symbols[i].trim();
      // Handle "Foo as Bar" aliases
      var asIdx = sym.indexOf(' as ');
      if (asIdx !== -1) {
        sym = sym.substring(asIdx + 4).trim();
      }
      importedSymbols[sym] = true;
    }
  }

  var replacements = [];

  // Replace qualified references for each imported symbol
  for (var sym in importedSymbols) {
    if (sym.length < 2) continue;
    if (sym === 'DEBUG' || sym === 'RELEASE') continue;
    if (sym === 'sys' || sym === 'egret_native' || sym === 'egret') continue;

    // Replace sys.SymbolName
    replacements.push({
      from: 'sys.' + sym,
      to: sym
    });
    // Replace egret_native.SymbolName
    replacements.push({
      from: 'egret_native.' + sym,
      to: sym
    });
    // Replace eui.sys.SymbolName
    replacements.push({
      from: 'eui.sys.' + sym,
      to: sym
    });
    // Replace egret.sys.SymbolName
    replacements.push({
      from: 'egret.sys.' + sym,
      to: sym
    });
  }

  if (replacements.length === 0) return content;

  var newContent = content;
  for (var r = 0; r < replacements.length; r++) {
    var from = replacements[r].from;
    var to = replacements[r].to;

    // Escape for regex
    var escapedFrom = from.replace(/\./g, '\\.').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    var regex = new RegExp('\\b' + escapedFrom + '\\b', 'g');

    // Use word boundary aware replacement
    newContent = newContent.replace(regex, to);
  }

  return newContent;
}

// ===== Main =====

var pkgDirs = ['core', 'eui', 'game', 'tween', 'socket'];
var totalFixed = 0;

console.log('Fixing qualified sub-namespace references...\n');

for (var p = 0; p < pkgDirs.length; p++) {
  var pkgName = pkgDirs[p];
  var srcDir = path.join(ROOT, 'packages', pkgName, 'src');
  if (!fs.existsSync(srcDir)) continue;

  var files = walkTs(srcDir);
  var fixed = 0;

  for (var f = 0; f < files.length; f++) {
    var content = fs.readFileSync(files[f], 'utf8');

    // Skip infrastructure files
    var rel = path.relative(srcDir, files[f]);
    if (rel === 'Defines.ts' || rel === 'ClassRegistry.ts' || rel === 'index.ts') continue;

    // Check if file has qualified sys. or egret_native. references
    if (!/sys\.\w+|egret_native\.\w+/.test(content)) continue;

    var newContent = fixQualifiedRefs(content);
    if (newContent !== content) {
      fs.writeFileSync(files[f], newContent, 'utf8');
      fixed++;
    }
  }

  if (fixed > 0) {
    console.log('  @egret-r/' + pkgName + ': ' + fixed + ' files fixed');
    totalFixed += fixed;
  }
}

console.log('\nTotal: ' + totalFixed + ' files fixed.\n');

// Verification
console.log('--- Verification ---');
var sample = path.join(ROOT, 'packages', 'core', 'src', 'display', 'Bitmap.ts');
if (fs.existsSync(sample)) {
  var content = fs.readFileSync(sample, 'utf8');
  var remaining = content.match(/sys\.\w+/g);
  console.log('Bitmap.ts sys. references remaining: ' + (remaining ? remaining.length : 0));
  if (remaining) console.log('  ' + remaining.slice(0, 5).join(', ') + '...');
}

var sample2 = path.join(ROOT, 'packages', 'core', 'src', 'player', 'nodes', 'NormalBitmapNode.ts');
if (fs.existsSync(sample2)) {
  var content = fs.readFileSync(sample2, 'utf8');
  // Check first few lines after header
  var lines = content.split('\n');
  console.log('\nNormalBitmapNode.ts (lines 28-42):');
  for (var i = 28; i < Math.min(43, lines.length); i++) {
    console.log('  ' + (i + 1) + '| ' + lines[i]);
  }
}
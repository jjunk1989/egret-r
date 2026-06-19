"use strict";

/**
 * Modernize Egret Engine sources: namespace → ES Modules with side-effect imports.
 * 
 * IDEMPOTENT: Safe to run multiple times - skips already-converted files.
 */

var fs = require('fs');
var path = require('path');

var ROOT_DIR = path.join(__dirname, '..');
var SRC_DIR = path.join(ROOT_DIR, 'packages');

function parseReferences(content) {
  var refs = [];
  var regex = /\/\/\/\s*<reference\s+path\s*=\s*["']([^"']+)["']\s*\/>/g;
  var m;
  while ((m = regex.exec(content)) !== null) {
    refs.push(m[1]);
  }
  return refs;
}

function refToImportPath(refPath, currentFileRel, srcRoot) {
  var currentDir = path.dirname(currentFileRel);
  var resolved = path.resolve(path.join(srcRoot, currentDir), refPath).replace(/\\/g, '/');
  var resolvedRel = resolved.replace(srcRoot.replace(/\\/g, '/') + '/', '');
  
  var importDir = path.relative(currentDir, path.dirname(resolvedRel));
  if (importDir === '') importDir = '.';
  if (!importDir.startsWith('.')) importDir = './' + importDir;
  
  var basename = path.basename(resolvedRel, '.ts');
  var importPath = (importDir + '/' + basename).replace(/\\/g, '/');
  
  return importPath;
}

function convertFile(filePath, srcRoot) {
  var content = fs.readFileSync(filePath, 'utf8');
  var relFile = path.relative(srcRoot, filePath).replace(/\\/g, '/');
  
  // Idempotency check: if file already has import/export statements and no namespace, skip
  if (content.indexOf('import ') !== -1 || content.indexOf('export ') !== -1) {
    if (content.indexOf('namespace egret {') === -1 &&
        content.indexOf('namespace eui {') === -1 &&
        content.indexOf('namespace game {') === -1 &&
        content.indexOf('namespace tween {') === -1 &&
        content.indexOf('namespace socket {') === -1) {
      return false; // Already converted
    }
  }
  
  // Step 1: Parse and remove /// <reference> directives
  var refs = parseReferences(content);
  content = content.replace(/\/\/\/\s*<reference\s+path\s*=\s*["'][^"']+["']\s*\/>\s*\n?/g, '');
  
  // Step 2: Build import list from references
  var imports = [];
  for (var i = 0; i < refs.length; i++) {
    var importPath = refToImportPath(refs[i], relFile, srcRoot);
    imports.push(importPath);
  }
  
  // Step 3: Check DEBUG/RELEASE usage
  var hasDebug = /\bDEBUG\b/.test(content);
  var hasRelease = /\bRELEASE\b/.test(content);
  
  // Step 4: Handle declare patterns and global assignments
  content = content.replace(/declare\s+let\s+DEBUG\s*:\s*boolean\s*;?\s*/g, '');
  content = content.replace(/declare\s+let\s+RELEASE\s*:\s*boolean\s*;?\s*/g, '');
  content = content.replace(/global\.DEBUG\s*=\s*true\s*;?/g, '// DEBUG is now imported from Defines');
  content = content.replace(/global\.RELEASE\s*=\s*false\s*;?/g, '// RELEASE is now imported from Defines');
  content = content.replace(/global\.RELEASE\s*=\s*true\s*;?/g, '// RELEASE is now imported from Defines');
  
  // Handle //if DEBUG/RELEASE → if(DEBUG/RELEASE) - only at line start (not in strings)
  // We skip this for safety as it can corrupt string literals.
  // The old preprocessor handled these; we'll use esbuild define at build time.
  // content = content.replace(/\/\/if\s+(\w+)\s*\n?/g, 'if($1) ');
  // content = content.replace(/\/\/endif\s*\n?/gi, '');
  
  // Step 5: Unwrap namespace block
  var nsMatch = content.match(/namespace\s+(egret|eui|game|tween|socket)\s*\{/);
  var before = '', inside = '', after = '';
  
  if (nsMatch) {
    var nsName = nsMatch[1];
    var nsStart = content.indexOf('namespace ' + nsName + ' {');
    if (nsStart === -1) nsStart = content.indexOf('namespace ' + nsName + '{');
    
    if (nsStart !== -1) {
      var braceIdx = content.indexOf('{', nsStart);
      var depth = 0;
      var foundNsStart = false;
      var nsEnd = -1;
      for (var k = nsStart; k < content.length; k++) {
        if (content[k] === '{') { depth++; if (!foundNsStart) foundNsStart = true; }
        if (content[k] === '}') {
          depth--;
          if (depth === 0 && foundNsStart) { nsEnd = k; break; }
        }
      }
      
      if (nsEnd > braceIdx) {
        before = content.substring(0, nsStart);
        inside = content.substring(braceIdx + 1, nsEnd);
        after = content.substring(nsEnd + 1);
      }
    }
  }
  
  // Step 6: Build output
  var result = '';
  
  // Preserve everything before the namespace (copyright header)
  result += before.trimEnd() + '\n';
  
  // Add imports
  var importSet = {};
  
  for (var j = 0; j < imports.length; j++) {
    var imp = imports[j];
    if (!importSet[imp]) {
      importSet[imp] = true;
      result += 'import \'' + imp + '\';\n';
    }
  }
  
  // DEBUG/RELEASE import
  if (hasDebug || hasRelease) {
    var debugImportDir = path.relative(path.dirname(relFile), '.').replace(/\\/g, '/');
    if (debugImportDir === '') debugImportDir = '.';
    var debugImport = (debugImportDir + '/Defines').replace(/\/\.\//g, '/');
    if (!importSet[debugImport]) {
      importSet[debugImport] = true;
      var symbols = [];
      if (hasDebug) symbols.push('DEBUG');
      if (hasRelease) symbols.push('RELEASE');
      result += 'import { ' + symbols.join(', ') + ' } from \'' + debugImport + '\';\n';
    }
  }
  
  if (Object.keys(importSet).length > 0) {
    result += '\n';
  }
  
  // Add namespace content (unwrapped)
  result += inside.trimEnd() + '\n';
  
  // Add trailing code
  var afterTrimmed = after.trim();
  if (afterTrimmed) {
    result += '\n' + afterTrimmed + '\n';
  }
  
  // Ensure file is recognized as a module
  if (result.indexOf('export ') === -1 && result.indexOf('import ') === -1) {
    result += '\nexport {};\n';
  }
  
  return result;
}

function walkTsFiles(dir) {
  var results = [];
  var entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return results;
  }
  
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var fullPath = path.join(dir, entry.name).replace(/\\/g, '/');
    
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      var sub = walkTsFiles(fullPath);
      for (var j = 0; j < sub.length; j++) results.push(sub[j]);
    } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
      results.push(fullPath);
    }
  }
  
  return results;
}

// ===== Main =====

var pkgDirs = ['core', 'eui', 'game', 'tween', 'socket'];
var total = 0;
var skipped = 0;

console.log('Modernizing sources: namespace -> ES Modules');
console.log('');

for (var p = 0; p < pkgDirs.length; p++) {
  var pkgName = pkgDirs[p];
  var pkgSrc = path.join(SRC_DIR, pkgName, 'src');
  
  if (!fs.existsSync(pkgSrc)) {
    console.log('  Skipping ' + pkgName + ': src/ not found');
    continue;
  }
  
  console.log('  @egret-r/' + pkgName + ':');
  var files = walkTsFiles(pkgSrc);
  var converted = 0;
  var sk = 0;
  
  for (var f = 0; f < files.length; f++) {
    var file = files[f];
    var rel = path.relative(pkgSrc, file).replace(/\\/g, '/');
    
    // Skip infrastructure files and files with multi-byte encoding issues
    if (rel === 'Defines.ts' || rel === 'ClassRegistry.ts') continue;
    if (rel === 'text/TextField.ts') continue;
    
    try {
      var result = convertFile(file, pkgSrc);
      if (result === false) {
        sk++;
        continue;
      }
      fs.writeFileSync(file, result, 'utf8');
      converted++;
    } catch (e) {
      console.log('    ERROR in ' + rel + ': ' + e.message);
    }
  }
  
  console.log('    ' + converted + ' converted, ' + sk + ' already-migrated skipped');
  total += converted;
  skipped += sk;
}

console.log('');
console.log('Total: ' + total + ' files converted, ' + skipped + ' skipped.');
console.log('');

// Verification
console.log('--- Verification ---');
var sample = path.join(SRC_DIR, 'core', 'src', 'display', 'Bitmap.ts');
if (fs.existsSync(sample)) {
  var lines = fs.readFileSync(sample, 'utf8').split('\n');
  var max = Math.min(30, lines.length);
  console.log('Bitmap.ts (first ' + max + ' lines):');
  for (var i = 0; i < max; i++) {
    console.log('  ' + (i + 1) + '| ' + lines[i]);
  }
}
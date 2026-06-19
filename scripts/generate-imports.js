"use strict";

/**
 * Second-pass import generator.
 * 
 * 1. Builds complete symbol → file mapping from all package sources
 * 2. For each file, detects used symbols from other files
 * 3. Generates explicit named imports (not side-effect imports)
 * 4. Also creates sub-namespace module files (sys.ts, native.ts)
 */

var fs = require('fs');
var path = require('path');

var PACKAGES = [
  { name: 'core', primaryNs: 'egret', subNs: ['egret.sys', 'egret_native'] },
  { name: 'eui', primaryNs: 'eui', subNs: ['eui.sys'] },
  { name: 'game', primaryNs: 'game', subNs: [] },
  { name: 'tween', primaryNs: 'tween', subNs: [] },
  { name: 'socket', primaryNs: 'socket', subNs: [] },
];

var ROOT = path.join(__dirname, '..');

// TypeScript/JavaScript reserved keywords
var RESERVED = {
  enum: true, class: true, interface: true, function: true, const: true,
  let: true, var: true, import: true, export: true, extends: true,
  implements: true, type: true, typeof: true, new: true, delete: true,
  return: true, if: true, else: true, for: true, while: true, do: true,
  switch: true, case: true, break: true, continue: true, default: true,
  throw: true, try: true, catch: true, finally: true, async: true,
  await: true, yield: true, of: true, in: true, this: true, super: true,
  static: true, public: true, private: true, protected: true, get: true,
  set: true, as: true, from: true, module: true, namespace: true,
  declare: true, abstract: true, any: true, boolean: true, number: true,
  string: true, void: true, null: true, undefined: true, never: true,
  object: true, symbol: true, true: true, false: true, keyof: true,
  infer: true, readonly: true, instanceof: true,
  Error: true, Array: true, Object: true, Function: true, String: true,
  Number: true, Boolean: true, Date: true, RegExp: true, Map: true, Set: true,
  Promise: true, Symbol: true, Buffer: true, parseInt: true, isNaN: true,
  window: true, document: true, console: true, Math: true, JSON: true,
  navigator: true, location: true, XMLHttpRequest: true, WebSocket: true,
  Image: true, Audio: true, require: true, process: true, global: true,
  addEventListener: true, removeEventListener: true, dispatchEvent: true,
  setTimeout: true, setInterval: true, clearTimeout: true, clearInterval: true,
};

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

/**
 * Build symbol → file mapping for all packages
 */
function buildSymbolMap(packages) {
  var map = {}; // symbol → { file, pkg }

  for (var p = 0; p < packages.length; p++) {
    var pkg = packages[p];
    var srcDir = path.join(ROOT, 'packages', pkg.name, 'src');
    if (!fs.existsSync(srcDir)) continue;

    var files = walkTs(srcDir);

    for (var f = 0; f < files.length; f++) {
      var rel = path.relative(srcDir, files[f]);
      var content = fs.readFileSync(files[f], 'utf8');

      // Match export declarations
      var regex = /export\s+(class|interface|function|const|let|enum|abstract\s+class|type)\s+(\w+)/g;
      var m;
      while ((m = regex.exec(content)) !== null) {
        var sym = m[2];
        if (sym.length < 2 || sym === 'DEBUG' || sym === 'RELEASE') continue;
        // Skip TypeScript/JavaScript reserved keywords
        if (RESERVED[sym]) continue;

        // Only keep first occurrence (prefer shorter paths)
        var existing = map[sym];
        if (!existing || rel.length < (existing.file || '').length) {
          map[sym] = { file: rel, pkg: pkg.name };
        }
      }
    }
  }

  return map;
}

/**
 * Generate imports for a single file
 */
function generateImports(filePath, srcDir, pkgName, symbolMap) {
  var content = fs.readFileSync(filePath, 'utf8');
  var rel = path.relative(srcDir, filePath);

  // Find what symbols this file uses from OTHER files
  var usedSymbols = {}; // Symbol string → true

  for (var sym in symbolMap) {
    var info = symbolMap[sym];
    var symFile = info.file;

    // Skip if same file or same package but not yet mapped
    if (symFile === rel && info.pkg === pkgName) continue;
    if (info.pkg !== pkgName) continue;

    // Skip symbols already declared in this file
    var declRegex = new RegExp('export\\s+(class|interface|function|const|let|enum|abstract\\s+class|type)\\s+' + sym + '\\b', 'g');
    if (declRegex.test(content)) continue;

    // Check if symbol is used (word boundary)
    var escaped = sym.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var useRegex = new RegExp('\\b' + escaped + '\\b', 'g');
    if (useRegex.test(content)) {
      usedSymbols[sym] = true;
    }
  }

  if (Object.keys(usedSymbols).length === 0) return null;

  // Group used symbols by their source file
  var importsByFile = {}; // relative import path → [symbols]

  for (sym in usedSymbols) {
    var info = symbolMap[sym];
    if (!info || info.pkg !== pkgName) continue;

    // Calculate relative import path from current file to symbol's file
    var importDir = path.relative(path.dirname(rel), path.dirname(info.file));
    if (importDir === '') importDir = '.';
    if (!importDir.startsWith('.')) importDir = './' + importDir;
    var basename = path.basename(info.file, '.ts');
    var importPath = (importDir + '/' + basename).replace(/\\/g, '/');

    if (!importsByFile[importPath]) importsByFile[importPath] = [];
    importsByFile[importPath].push(sym);
  }

  return importsByFile;
}

/**
 * Insert imports into file content
 */
function insertImports(content, importsByFile) {
  var importStr = '';

  for (var importPath in importsByFile) {
    var symbols = importsByFile[importPath];

    // Extract type-only imports
    // (for simplicity, we import everything as values; TypeScript will handle type erasure)
    importStr += 'import { ' + symbols.join(', ') + ' } from \'' + importPath + '\';\n';
  }

  // Find insertion point: after copyright header (after last ////// line)
  var lines = content.split('\n');
  var insertLine = 0;

  // Find the copyright block end
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '//////////////////////////////////////////////////////////////////////////////////////') {
      insertLine = i + 1;
    }
  }

  // Also check for existing import block
  var firstCodeLine = lines.length;
  for (var i = insertLine; i < lines.length; i++) {
    if (lines[i].trim() !== '' && !lines[i].trim().startsWith('import ')) {
      firstCodeLine = i;
      break;
    }
  }

  // Remove old side-effect imports (single-quoted, no braces)
  lines = lines.filter(function(line) {
    return !/^import\s+'[^']+';?\s*$/.test(line.trim());
  });

  // Remove old named imports (will regenerate)
  lines = lines.filter(function(line) {
    return !/^import\s+\{[^}]+\}\s+from\s+'[^']+';?\s*$/.test(line.trim());
  });

  // Insert new imports after copyright header
  var newLines = [];
  for (var i = 0; i < insertLine; i++) {
    newLines.push(lines[i]);
  }

  if (importStr) {
    newLines.push('');
    newLines.push(importStr.trim());
    newLines.push('');
  }

  // Add remaining code (skip empty lines at top)
  var addedCode = false;
  for (var i = insertLine; i < lines.length; i++) {
    if (!addedCode && lines[i].trim() === '') continue;
    addedCode = true;
    newLines.push(lines[i]);
  }

  return newLines.join('\n');
}

// ===== Sub-namespace handling =====

/**
 * Find declarations inside namespace egret.sys { ... } etc.
 * and split them into separate module files.
 */
function extractSubNamespaces(srcDir, primaryNs, subNss) {
  var files = walkTs(srcDir);

  for (var nsIdx = 0; nsIdx < subNss.length; nsIdx++) {
    var subNs = subNss[nsIdx];
    var parts = subNs.split('.');
    var outerNs = parts[0];
    var innerNs = parts[1];

    // Find files containing sub-namespace declarations
    for (var f = 0; f < files.length; f++) {
      var content = fs.readFileSync(files[f], 'utf8');

      // Look for namespace declaration inside the file
      var nsRegex = new RegExp('namespace\\s+' + innerNs + '\\s*\\{', 'g');
      var matches = content.match(nsRegex);
      if (!matches) continue;

      // This file has inner namespace blocks - mark as needing sub-ns extraction
      var rel = path.relative(srcDir, files[f]);
      // console.log('  Sub-ns ' + subNs + ' found in: ' + rel);
    }
  }
}

// ===== Main =====

console.log('Generating cross-file imports...\n');

// Build global symbol map
var symbolMap = buildSymbolMap(PACKAGES);
var symCount = Object.keys(symbolMap).length;
console.log('Total symbols mapped: ' + symCount + '\n');

// Process each package
for (var p = 0; p < PACKAGES.length; p++) {
  var pkg = PACKAGES[p];
  var srcDir = path.join(ROOT, 'packages', pkg.name, 'src');
  if (!fs.existsSync(srcDir)) continue;

  console.log('  @egret-r/' + pkg.name + ':');
  var files = walkTs(srcDir);
  var generated = 0;

  for (var f = 0; f < files.length; f++) {
    var rel = path.relative(srcDir, files[f]);

    // Skip infrastructure files and files with multi-byte encoding issues
    if (rel === 'Defines.ts' || rel === 'ClassRegistry.ts' || rel === 'index.ts') continue;
    if (rel === 'text/TextField.ts') continue;

    try {
      var importsByFile = generateImports(files[f], srcDir, pkg.name, symbolMap);
      if (!importsByFile) continue;

      var content = fs.readFileSync(files[f], 'utf8');
      var newContent = insertImports(content, importsByFile);
      fs.writeFileSync(files[f], newContent, 'utf8');
      generated++;
    } catch (e) {
      console.log('    ERROR in ' + rel + ': ' + e.message);
    }
  }

  console.log('    ' + generated + ' files updated with imports');

  // Analyze sub-namespaces
  if (pkg.subNs.length > 0) {
    console.log('    Sub-namespaces: ' + pkg.subNs.join(', '));
    extractSubNamespaces(srcDir, pkg.primaryNs, pkg.subNs);
  }
}

console.log('\nImport generation complete.\n');

// Verification
console.log('--- Verification ---');
var sample = path.join(ROOT, 'packages', 'core', 'src', 'display', 'Bitmap.ts');
if (fs.existsSync(sample)) {
  var lines = fs.readFileSync(sample, 'utf8').split('\n');
  console.log('Bitmap.ts (first 20 lines):');
  for (var i = 0; i < Math.min(20, lines.length); i++) {
    console.log('  ' + (i + 1) + '| ' + lines[i]);
  }
}
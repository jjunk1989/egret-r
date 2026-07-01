'use strict';
/**
 * One-shot namespace-to-ESM converter:
 * 1. Removes namespace wrappers from all files
 * 2. Converts egret.X / eui.X references to direct imports
 * 3. Adds export keywords to declarations
 */
var fs = require('fs');
var path = require('path');

var ROOT = path.join(__dirname, '..');
var SRC = path.join(ROOT, 'src');

// ---- file walking ----
function walkTsFiles(dir) {
  var results = [];
  try {
    var entries = fs.readdirSync(dir, { withFileTypes: true });
    for (var i = 0; i < entries.length; i++) {
      var p = path.join(dir, entries[i].name);
      if (entries[i].isDirectory() && entries[i].name !== 'node_modules') {
        results = results.concat(walkTsFiles(p));
      } else if (entries[i].isFile() && entries[i].name.endsWith('.ts') && !entries[i].name.endsWith('.d.ts')) {
        results.push(p);
      }
    }
  } catch (e) {}
  return results;
}

// ---- symbol extraction ----
function extractSymbols(content) {
  var symbols = {};
  // class/interface/enum/type declarations
  var re = /(?:export\s+)?(?:abstract\s+)?(?:class|interface|enum|type)\s+(\w+)/g;
  var m;
  while ((m = re.exec(content)) !== null) symbols[m[1]] = 'class';
  // function declarations
  re = /(?:export\s+)?function\s+(\w+)/g;
  while ((m = re.exec(content)) !== null) symbols[m[1]] = 'function';
  // let/var/const declarations
  re = /(?:export\s+)?(?:let|var|const)\s+(\w+)/g;
  while ((m = re.exec(content)) !== null) symbols[m[1]] = 'var';
  return Object.keys(symbols);
}

// ---- namespace reference extraction ----
function extractNsRefs(content) {
  var refs = new Set();
  var re = /\begret\.(\w+)\b/g;
  var m;
  while ((m = re.exec(content)) !== null) refs.add(m[1]);
  re = /\beui\.(\w+)\b/g;
  while ((m = re.exec(content)) !== null) refs.add(m[1]);
  re = /\begret\.sys\.(\w+)\b/g;
  while ((m = re.exec(content)) !== null) refs.add(m[1]);
  re = /\beui\.sys\.(\w+)\b/g;
  while ((m = re.exec(content)) !== null) refs.add(m[1]);
  // Also detect bare sys.X after namespace unwrapping
  re = /\bsys\.(\w+)\b/g;
  while ((m = re.exec(content)) !== null) refs.add(m[1]);
  return Array.from(refs);
}

// Find bare type references that were resolved through namespace merging
function extractBareRefs(content, filePath, symbolMap) {
  var refs = new Set();
  // Patterns: extends Foo, implements Foo, : Foo, new Foo(, <Foo>, Foo.
  var patterns = [
    /\bextends\s+(\w+)\b/g,
    /\bimplements\s+(\w+)\b/g,
    /:\s*(\w+)\b/g,
    /\bnew\s+(\w+)\s*[\(<]/g,
    /<\s*(\w+)\s*>/g,
  ];
  patterns.forEach(function(re) {
    var m;
    while ((m = re.exec(content)) !== null) {
      var sym = m[1];
      // Skip common types, keywords, and single-letter names (often function params)
      if (/^(string|number|boolean|void|any|never|unknown|object|Function|Array|Promise|Error|Map|Set|Date|RegExp|this|true|false|null|undefined|new|return|egret|eui|code)$/.test(sym)) continue;
      if (sym.length <= 1) continue;
      if (sym.startsWith('_')) continue;
      if (symbolMap[sym] && symbolMap[sym] !== filePath) refs.add(sym);
    }
  });
  return Array.from(refs);
}

// ---- relative path computation ----
function relativePath(from, to) {
  var rel = path.relative(path.dirname(from), to).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel;
}

// ---- namespace removal ----
function removeNamespace(content) {
  var lines = content.split(/\r?\n/);

  // Find and remove all namespace blocks (innermost first)
  var changed = true;
  while (changed) {
    changed = false;
    var starts = [];
    for (var i = 0; i < lines.length; i++) {
      var m = lines[i].match(/^(\s*)(?:namespace|module)\s+([\w.]+)\s*\{/);
      if (m) starts.push({ lineIdx: i, indent: m[1] });
    }
    // Remove innermost first
    for (var s = starts.length - 1; s >= 0; s--) {
      var start = starts[s];
      // Find matching }
      var depth = 0;
      var endIdx = -1;
      for (var i = start.lineIdx; i < lines.length; i++) {
        for (var c = 0; c < lines[i].length; c++) {
          if (lines[i][c] === '{') depth++;
          else if (lines[i][c] === '}') {
            depth--;
            if (depth === 0) { endIdx = i; break; }
          }
        }
        if (endIdx >= 0) break;
      }
      if (endIdx < 0) continue;

      // Remove opening line
      lines.splice(start.lineIdx, 1);
      endIdx--;
      // Remove closing line (or just the } character)
      if (lines[endIdx].trim() === '}') {
        lines.splice(endIdx, 1);
      } else {
        lines[endIdx] = lines[endIdx].replace('}', '');
      }
      changed = true;
      break;
    }
  }
  return lines.join('\n');
}

// ---- main conversion ----
function convertFile(filePath, symbolMap) {
  var content = fs.readFileSync(filePath, 'utf8');
  var original = content;

  // Step 1: Remove /// reference
  content = content.replace(/\/\/\/\s*<reference\s+path\s*=\s*["'][^"']+["']\s*\/>\s*\r?\n?/g, '');

  // Step 2: Remove namespace wrappers
  content = removeNamespace(content);

  // Step 3: Find namespace references that need imports
  var refs = extractNsRefs(content);
  // Also detect bare references that need imports (were resolved via namespace)
  var bareRefs = extractBareRefs(content, filePath, symbolMap);
  refs = refs.concat(bareRefs.filter(function(r) { return refs.indexOf(r) < 0; }));
  var imports = '';
  var usedNames = {};

  for (var r = 0; r < refs.length; r++) {
    var sym = refs[r];
    if (symbolMap[sym] && symbolMap[sym] !== filePath) {
      var importPath = relativePath(filePath, symbolMap[sym]).replace(/\.ts$/, '');
      var importVar = sym;
      // Check for naming conflicts
      var fileSymbols = extractSymbols(fs.readFileSync(filePath, 'utf8'));
      if (fileSymbols.indexOf(sym) >= 0) {
        importVar = '_' + sym;
      }
      // Replace egret.X / eui.X / egret.sys.X / eui.sys.X with local name
      content = content.replace(new RegExp('\\begret\\.' + sym + '\\b', 'g'), importVar);
      content = content.replace(new RegExp('\\beui\\.' + sym + '\\b', 'g'), importVar);
      content = content.replace(new RegExp('\\begret\\.sys\\.' + sym + '\\b', 'g'), importVar);
      content = content.replace(new RegExp('\\beui\\.sys\\.' + sym + '\\b', 'g'), importVar);
      content = content.replace(new RegExp('\\bsys\\.' + sym + '\\b', 'g'), importVar);

      if (!usedNames[importPath]) usedNames[importPath] = [];
      if (usedNames[importPath].indexOf(importVar) < 0) usedNames[importPath].push(importVar);
    } else if (symbolMap[sym]) {
      // Same-file reference: strip sys. / egret. / eui. prefix
      content = content.replace(new RegExp('\\begret\\.sys\\.' + sym + '\\b', 'g'), sym);
      content = content.replace(new RegExp('\\beui\\.sys\\.' + sym + '\\b', 'g'), sym);
      content = content.replace(new RegExp('\\bsys\\.' + sym + '\\b', 'g'), sym);
      content = content.replace(new RegExp('\\begret\\.' + sym + '\\b', 'g'), sym);
      content = content.replace(new RegExp('\\beui\\.' + sym + '\\b', 'g'), sym);
    }
  }

  // Step 4: Generate import statements
  var importPaths = Object.keys(usedNames);
  for (var ip = 0; ip < importPaths.length; ip++) {
    var importPath = importPaths[ip];
    var vars = usedNames[importPath];
    if (vars.length > 0) {
      imports += 'import { ' + vars.join(', ') + ' } from "' + importPath + '";\n';
    }
  }

  // Step 5: Add imports at top, after copyright
  if (imports) {
    // Find end of copyright header reliably
    var lines = content.split(/\r?\n/);
    var insertAt = 0;
    for (var li = 0; li < lines.length; li++) {
      if (lines[li].startsWith('// SPDX') || lines[li].startsWith('// Copyright')) {
        insertAt = li + 1;
      } else if (lines[li].trim() === '' && insertAt > 0) {
        insertAt = li + 1;
        break;
      }
    }
    var beforeImport = lines.slice(0, insertAt).join('\n');
    var afterImport = lines.slice(insertAt).join('\n');
    content = beforeImport + '\n' + imports + '\n' + afterImport;
  }

  // Step 6: Fix this -> globalThis
  content = content.replace('this && this.__define', 'globalThis && (globalThis).__define');

  // Step 7: Clean blank lines
  content = content.replace(/\n{4,}/g, '\n\n\n');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

// ---- main ----
var allFiles = walkTsFiles(SRC);
console.log('Total files:', allFiles.length);

// Build symbol map
var symbolMap = {};
for (var i = 0; i < allFiles.length; i++) {
  var symbols = extractSymbols(fs.readFileSync(allFiles[i], 'utf8'));
  for (var s = 0; s < symbols.length; s++) {
    var sym = symbols[s];
    if (!symbolMap[sym]) symbolMap[sym] = allFiles[i];
  }
}
console.log('Symbol map size:', Object.keys(symbolMap).length);

// Convert
var converted = 0;
for (var i = 0; i < allFiles.length; i++) {
  try {
    if (convertFile(allFiles[i], symbolMap)) converted++;
  } catch (e) {
    console.error('Error converting', path.relative(SRC, allFiles[i]), ':', e.message);
  }
}
console.log('Converted:', converted, '/', allFiles.length);

"use strict";
var fs = require('fs');
var path = require('path');

var pkgSrc = path.join(__dirname, '..', 'packages', 'core', 'src');

function walk(dir) {
  var results = [];
  var entries = fs.readdirSync(dir, { withFileTypes: true });
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i];
    var fp = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== 'node_modules') {
      results = results.concat(walk(fp));
    } else if (e.name.endsWith('.ts') && !e.name.endsWith('.d.ts')) {
      results.push(fp);
    }
  }
  return results;
}

var files = walk(pkgSrc);

// Gather all exported symbols
var symbolToFile = {};
var symbolCounts = {};

for (var i = 0; i < files.length; i++) {
  var content = fs.readFileSync(files[i], 'utf8');
  var rel = path.relative(pkgSrc, files[i]);

  // Find export class/interface/function declarations
  var regex = /export\s+(class|interface|function|const|let|enum|abstract class)\s+(\w+)/g;
  var m;
  while ((m = regex.exec(content)) !== null) {
    var sym = m[2];
    if (!symbolToFile[sym]) {
      symbolToFile[sym] = rel;
      symbolCounts[sym] = 0;
    }
    symbolCounts[sym]++;
  }
}

// Count references to these symbols across all files
for (var i = 0; i < files.length; i++) {
  var content = fs.readFileSync(files[i], 'utf8');
  var rel = path.relative(pkgSrc, files[i]);

  var used = {};
  for (var sym in symbolToFile) {
    if (sym.length < 2) continue;
    // Match word boundary + symbol + word boundary
    var escaped = sym.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var regex = new RegExp('\\b' + escaped + '\\b', 'g');
    var count = (content.match(regex) || []).length;
    if (count > 0 && symbolToFile[sym] !== rel) {
      if (!used[symbolToFile[sym]]) used[symbolToFile[sym]] = [];
      used[symbolToFile[sym]].push(sym + '(' + count + ')');
    }
  }
}

// Count special patterns
var hasNamespace = 0;
var hasImport = 0;
var hasSys = 0;
var hasNative = 0;

for (var i = 0; i < files.length; i++) {
  var content = fs.readFileSync(files[i], 'utf8');
  if (content.indexOf('namespace egret') !== -1) hasNamespace++;
  if (content.indexOf('import ') !== -1) hasImport++;
  if (/egret\.sys\b/.test(content)) hasSys++;
  if (/egret_native\b/.test(content)) hasNative++;
}

console.log('=== Symbol Analysis: packages/core/src/ ===\n');
console.log('Total .ts files:', files.length);
console.log('Files with namespace egret:', hasNamespace);
console.log('Files with import:', hasImport);
console.log('Files referencing egret.sys:', hasSys);
console.log('Files referencing egret_native:', hasNative);
console.log('');
console.log('All exported symbols:', Object.keys(symbolToFile).length);
console.log('');

// Show top symbols used across files
var topSymbols = [];
for (var sym in symbolToFile) {
  topSymbols.push({ sym: sym, file: symbolToFile[sym] });
}
topSymbols.sort(function(a, b) { return symbolCounts[b.sym] - symbolCounts[a.sym]; });

console.log('Top 30 symbols by external usage:');
for (var i = 0; i < Math.min(30, topSymbols.length); i++) {
  var s = topSymbols[i];
  console.log('  ' + s.sym + ' -> ' + s.file);
}
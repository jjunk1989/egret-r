'use strict';
var fs = require('fs');
var path = require('path');
var ROOT = path.join(__dirname, '..');
var SRC = path.join(ROOT, 'src');

function walkTsFiles(dir) {
  var r = [];
  try {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(function(e) {
      var p = path.join(dir, e.name);
      if (e.isDirectory() && e.name !== 'node_modules') r = r.concat(walkTsFiles(p));
      else if (e.isFile() && e.name.endsWith('.ts') && !e.name.endsWith('.d.ts')) r.push(p);
    });
  } catch (ex) {}
  return r;
}

function buildReverseMap(content) {
  var map = {};
  var re = /^import\s+\{([^}]+)\}\s+from\s+["'](.+)["'];?\s*$/gm;
  var m;
  while ((m = re.exec(content)) !== null) {
    var names = m[1].split(',').map(function(s) { return s.trim(); });
    var importPath = m[2];
    var isEgret = importPath.indexOf('/egret/') >= 0;
    var isEui = importPath.indexOf('/eui/') >= 0;
    if (isEgret || (!isEui && (importPath.startsWith('../') || importPath.startsWith('./')))) {
      for (var i = 0; i < names.length; i++) {
        map[names[i]] = 'egret.' + names[i];
      }
    }
  }
  return map;
}

function cleanFile(filePath) {
  var content = fs.readFileSync(filePath, 'utf8');
  var original = content;

  // Build reverse map
  var reverseMap = buildReverseMap(content);

  // Step 1: Dedent
  var lines = content.split(/\r?\n/);
  var minIndent = Infinity;
  for (var i = 3; i < lines.length; i++) {
    var trimmed = lines[i].trimStart();
    // Skip: empty, imports, JSDoc lines, pure comment lines
    if (!trimmed || trimmed.startsWith('import ') || trimmed.startsWith('*') || trimmed.startsWith('//')) continue;
    var indent = lines[i].length - trimmed.length;
    if (indent > 0 && indent < minIndent) minIndent = indent;
  }
  if (minIndent > 0 && minIndent < Infinity) {
    for (var i = 0; i < lines.length; i++) {
      var trimmed = lines[i].trimStart();
      if (!trimmed || trimmed.startsWith('import ') || trimmed.startsWith('// SPDX') || trimmed.startsWith('// Copyright') || trimmed.startsWith('*') || trimmed.startsWith('/**') || trimmed.startsWith('*/') || trimmed.startsWith('//')) {
        continue;
      }
      if (lines[i].length >= minIndent) lines[i] = lines[i].substring(minIndent);
    }
    content = lines.join('\n');
  }

  // Step 2: Restore egret.X in JSDoc
  var keys = Object.keys(reverseMap);
  if (keys.length > 0) {
    lines = content.split(/\r?\n/);
    var inDoc = false;
    for (var i = 0; i < lines.length; i++) {
      if (/^\s*\/\*\*/.test(lines[i])) inDoc = true;
      if (inDoc) {
        for (var k = 0; k < keys.length; k++) {
          var local = keys[k];
          var full = reverseMap[local];
          var re = new RegExp('\\b(?<!\\.)' + local.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g');
          lines[i] = lines[i].replace(re, full);
        }
        if (/\*\/\s*$/.test(lines[i])) inDoc = false;
      }
    }
    content = lines.join('\n');
  }

  // Step 3: Clean blanks
  content = content.replace(/\n{4,}/g, '\n\n\n');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

var files = walkTsFiles(SRC);
var cleaned = 0;
files.forEach(function(f) {
  try { if (cleanFile(f)) cleaned++; }
  catch (e) { console.error(path.relative(SRC, f), e.message); }
});
console.log('Cleaned:', cleaned, '/', files.length);

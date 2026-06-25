'use strict';
/**
 * One-shot conversion: remove namespace wrappers from all .ts files,
 * keeping export keywords. Module-level code (before namespace) stays.
 * /// reference directives are removed.
 */
var fs = require('fs');
var path = require('path');

var ROOT = path.join(__dirname, '..');
var SRC = path.join(ROOT, 'src');

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

function findMatchingBrace(lines, startIdx) {
  // startIdx is the line with "namespace xxx {" — find matching closing }
  var depth = 0;
  for (var i = startIdx; i < lines.length; i++) {
    var line = lines[i];
    for (var c = 0; c < line.length; c++) {
      if (line[c] === '{') depth++;
      else if (line[c] === '}') {
        depth--;
        if (depth === 0) {
          return { lineIdx: i, charIdx: c };
        }
      }
    }
  }
  return null;
}

function convertFile(filePath) {
  var content = fs.readFileSync(filePath, 'utf8');
  var original = content;

  // Remove /// reference directives
  content = content.replace(/\/\/\/\s*<reference\s+path\s*=\s*["'][^"']+["']\s*\/>\s*\r?\n?/g, '');

  var lines = content.split(/\r?\n/);

  // Find ALL namespace blocks and process them from innermost to outermost
  // Collect all namespace opening lines
  var namespaceStarts = [];
  for (var i = 0; i < lines.length; i++) {
    var m = lines[i].match(/^(\s*)namespace\s+([\w.]+)\s*\{/);
    if (m) {
      namespaceStarts.push({ lineIdx: i, indent: m[1], name: m[2] });
    }
  }

  // Process from last to first (innermost first)
  for (var ns = namespaceStarts.length - 1; ns >= 0; ns--) {
    var start = namespaceStarts[ns];
    var end = findMatchingBrace(lines, start.lineIdx);
    if (!end) continue;

    // Remove the namespace header line
    lines.splice(start.lineIdx, 1);
    // Adjust end index since we removed a line
    end.lineIdx--;

    // Remove the closing brace line (or character if on same line)
    var endLine = lines[end.lineIdx];
    if (endLine.trim() === '}') {
      lines.splice(end.lineIdx, 1);
    } else {
      // Brace is in middle of line — replace with empty
      lines[end.lineIdx] = endLine.substring(0, end.charIdx) + endLine.substring(end.charIdx + 1);
    }
  }

  content = lines.join('\n');

  // Clean up: remove very long empty sections (3+ blank lines → 2)
  content = content.replace(/\n{4,}/g, '\n\n\n');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

// Main
var files = walkTsFiles(SRC);
var converted = 0;
var errors = [];
for (var i = 0; i < files.length; i++) {
  try {
    if (convertFile(files[i])) converted++;
  } catch (e) {
    errors.push(path.relative(SRC, files[i]) + ': ' + e.message);
  }
}
console.log('Converted: ' + converted + ' / ' + files.length);
if (errors.length > 0) {
  console.log('Errors (' + errors.length + '):');
  errors.forEach(function(e) { console.log('  ' + e); });
}

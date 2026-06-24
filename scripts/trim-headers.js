'use strict';

/**
 * Trim verbose BSD copyright headers to SPDX identifiers
 * AND replace @platform Web,Native with @platform Web.
 * Uses Node.js APIs to preserve UTF-8 encoding.
 */
var fs = require('fs');
var path = require('path');

var ROOT = path.join(__dirname, '..');
var SRC = path.join(ROOT, 'src');

var HEADER_LINES = 28;
var SPDX_HEADER = '// SPDX-License-Identifier: BSD-2-Clause\n// Copyright (c) 2014-present, Egret Technology.\n\n';

var totalFiles = 0;
var trimmedFiles = 0;
var platformFixed = 0;

function walkTsFiles(dir) {
  var results = [];
  try {
    var entries = fs.readdirSync(dir, { withFileTypes: true });
    for (var i = 0; i < entries.length; i++) {
      var p = path.join(dir, entries[i].name);
      if (entries[i].isDirectory() && entries[i].name !== 'node_modules') {
        results = results.concat(walkTsFiles(p));
      } else if (entries[i].isFile() && entries[i].name.endsWith('.ts')) {
        results.push(p);
      }
    }
  } catch (e) {}
  return results;
}

function processFile(filePath) {
  var content = fs.readFileSync(filePath, 'utf8');
  var modified = false;

  // --- Step 1: Trim copyright header ---
  var lines = content.split(/\r?\n/);
  if (lines.length >= HEADER_LINES) {
    var firstLine = lines[0];
    var lastHeaderLine = lines[HEADER_LINES - 1];
    if (/^\/{20,}/.test(firstLine) && /^\/{20,}/.test(lastHeaderLine)) {
      var headerText = lines.slice(0, HEADER_LINES).join('\n');
      if (headerText.includes('Copyright')) {
        var restLines = lines.slice(HEADER_LINES);
        if (restLines.length > 0 && restLines[0].trim() === '') {
          restLines = restLines.slice(1);
        }
        content = SPDX_HEADER + restLines.join('\n');
        modified = true;
        trimmedFiles++;
      }
    }
  }

  // --- Step 2: Replace @platform Web,Native → @platform Web ---
  if (content.includes('@platform Web,Native')) {
    content = content.replace(/@platform Web,Native/g, '@platform Web');
    modified = true;
    platformFixed++;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

// Main
var files = walkTsFiles(SRC);
totalFiles = files.length;

for (var i = 0; i < files.length; i++) {
  processFile(files[i]);
}

console.log('Headers trimmed: ' + trimmedFiles + ' / ' + totalFiles);
console.log('@platform fixed: ' + platformFixed + ' / ' + totalFiles);

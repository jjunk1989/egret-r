"use strict";
var fs = require('fs');
var path = require('path');

function walk(dir) {
  var results = [];
  try {
    var entries = fs.readdirSync(dir, { withFileTypes: true });
    for (var i = 0; i < entries.length; i++) {
      var fp = path.join(dir, entries[i].name).replace(/\\/g, '/');
      if (entries[i].isDirectory() && entries[i].name !== 'node_modules') {
        results = results.concat(walk(fp));
      } else if (entries[i].name.endsWith('.ts') && !entries[i].name.endsWith('.d.ts')) {
        results.push(fp);
      }
    }
  } catch (e) {}
  return results;
}

var srcDirs = ['src/egret', 'src/extension/eui', 'src/extension/game'];
srcDirs.forEach(function(dir) {
  var files = walk(dir);
  var native = files.filter(function(f) {
    return /[\\\/]native[\\\/]/i.test(f) || /NativeContext/.test(f);
  });
  console.log(dir + ': ' + native.length + ' native files');
  native.forEach(function(f) { console.log('  ' + f); });
});
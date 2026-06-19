"use strict";
var fs = require('fs');
var path = require('path');

var pkgs = ['core', 'eui', 'game', 'tween', 'socket'];
var root = path.join(__dirname, '..', 'packages');

console.log('=== Package Build Verification ===\n');

pkgs.forEach(function(pkg) {
  var dist = path.join(root, pkg, 'dist');
  console.log('@egret-r/' + pkg + ':');

  ['index.js', 'index.min.js', 'index.d.ts'].forEach(function(file) {
    var fp = path.join(dist, file);
    if (!fs.existsSync(fp)) {
      console.log('  ' + file + ': MISSING');
      return;
    }
    var stat = fs.statSync(fp);
  console.log('  @egret-r/' + pkg + ': ' + sizeKB + ' KB (has namespace: ' + hasNamespace + ')');
});

console.log('\nDone.');
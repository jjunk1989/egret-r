"use strict";
var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');

var pkgs = ['core', 'eui', 'game', 'tween', 'socket'];
var root = path.join(__dirname, '..', 'packages');

console.log('=== Package Build Verification ===\n');

var hasError = false;

pkgs.forEach(function (pkg) {
  var dist = path.join(root, pkg, 'dist');
  console.log('@egret-r/' + pkg + ':');

  ['index.js', 'index.min.js', 'index.d.ts'].forEach(function (file) {
    var fp = path.join(dist, file);
    if (!fs.existsSync(fp)) {
      console.log('  ' + file + ': MISSING');
      hasError = true;
      return;
    }

    var stat = fs.statSync(fp);
    var sizeKB = (stat.size / 1024).toFixed(1);
    console.log('  ' + file + ': ' + sizeKB + ' KB');
  });
});

console.log('\n=== Bare Symbol Gate ===\n');
var bareCheck = childProcess.spawnSync(
  process.execPath,
  [path.join(__dirname, 'check-bare-symbols.js')],
  { stdio: 'inherit' }
);
if (bareCheck.status !== 0) {
  hasError = true;
}

if (hasError) {
  console.error('\nVerification failed.');
  process.exit(1);
}

console.log('\nVerification passed.');
"use strict";
var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..', 'packages');

function checkPkg(name) {
  var dts = path.join(root, name, 'dist', 'index.d.ts');
  if (!fs.existsSync(dts)) { console.log(name + ': NO index.d.ts'); return; }
  var c = fs.readFileSync(dts, 'utf8');
  console.log(name + ':');
  console.log('  $error:', /declare\s+function\s+\$error/.test(c));
  console.log('  $warn:', /declare\s+function\s+\$warn/.test(c));
  console.log('  $markCannotUse:', /declare\s+function\s+\$markCannotUse/.test(c));
  console.log('  egret.sys:', /namespace egret\.sys/.test(c));
  console.log('  egret_native:', /namespace egret_native/.test(c));
  console.log('  eui.sys:', /namespace eui\.sys/.test(c));
  console.log('  EXML:', /EXMLParser|EXMLConfig|CodeFactory/.test(c));
  console.log('  export as namespace:', /export as namespace/.test(c));
}

console.log('=== .d.ts Verification ===\n');
['core', 'eui', 'game', 'tween', 'socket'].forEach(checkPkg);
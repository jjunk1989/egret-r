"use strict";
var fs = require('fs');
var path = require('path');

var pkgs = ['core', 'eui', 'game', 'tween', 'socket'];
var root = path.join(__dirname, '..', 'packages');

pkgs.forEach(function(pkg) {
  var d = path.join(root, pkg, 'dist');
  if (fs.existsSync(d)) {
    fs.rmSync(d, { recursive: true, force: true });
    console.log('  Cleared packages/' + pkg + '/dist/');
  }
});
console.log('Done.');
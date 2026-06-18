"use strict";

var fs = require('fs');
var path = require('path');

var rootDir = path.join(__dirname, '..');
var buildDir = path.join(rootDir, 'build');
var packagesDir = path.join(rootDir, 'packages');

var PACKAGE_MAP = [
  {
    pkg: 'core',
    buildSubdir: 'egret',
    files: [
      { src: 'egret.js', dest: 'index.js' },
      { src: 'egret.web.js', dest: 'index.web.js' },
      { src: 'egret.min.js', dest: 'index.min.js' },
      { src: 'egret.web.min.js', dest: 'index.web.min.js' },
      { src: 'egret.d.ts', dest: 'index.d.ts' },
    ]
  },
  {
    pkg: 'eui',
    buildSubdir: 'eui',
    files: [
      { src: 'eui.js', dest: 'index.js' },
      { src: 'eui.min.js', dest: 'index.min.js' },
      { src: 'eui.d.ts', dest: 'index.d.ts' },
    ]
  },
  {
    pkg: 'game',
    buildSubdir: 'game',
    files: [
      { src: 'game.js', dest: 'index.js' },
      { src: 'game.min.js', dest: 'index.min.js' },
      { src: 'game.d.ts', dest: 'index.d.ts' },
    ]
  },
  {
    pkg: 'tween',
    buildSubdir: 'tween',
    files: [
      { src: 'tween.js', dest: 'index.js' },
      { src: 'tween.min.js', dest: 'index.min.js' },
      { src: 'tween.d.ts', dest: 'index.d.ts' },
    ]
  },
  {
    pkg: 'socket',
    buildSubdir: 'socket',
    files: [
      { src: 'socket.js', dest: 'index.js' },
      { src: 'socket.min.js', dest: 'index.min.js' },
      { src: 'socket.d.ts', dest: 'index.d.ts' },
    ]
  },
];

console.log('Copying pre-compiled build artifacts to packages...');
console.log('');

for (var i = 0; i < PACKAGE_MAP.length; i++) {
  var entry = PACKAGE_MAP[i];
  var pkg = entry.pkg;
  var buildSubdir = entry.buildSubdir;
  var files = entry.files;

  var pkgDist = path.join(packagesDir, pkg, 'dist');
  var buildSrc = path.join(buildDir, buildSubdir);

  if (!fs.existsSync(buildSrc)) {
    console.log('  Skipping ' + pkg + ': build/' + buildSubdir + ' not found');
    continue;
  }

  if (!fs.existsSync(pkgDist)) {
    fs.mkdirSync(pkgDist, { recursive: true });
  }

  console.log('  @egret-r/' + pkg + ':');

  for (var j = 0; j < files.length; j++) {
    var fileEntry = files[j];
    var srcPath = path.join(buildSrc, fileEntry.src);
    var destPath = path.join(pkgDist, fileEntry.dest);

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      var stat = fs.statSync(srcPath);
      console.log('    ' + fileEntry.src + ' -> ' + fileEntry.dest + ' (' + (stat.size / 1024).toFixed(1) + ' KB)');
    } else {
      console.log('    ' + fileEntry.src + ' -> NOT FOUND (skipped)');
    }
  }
}

console.log('');
console.log('Done.');
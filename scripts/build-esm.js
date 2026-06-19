"use strict";

/**
 * Build ESM packages using esbuild from original namespace source files.
 * 
 * Strategy:
 * - Use original src/egret/*.ts sources (namespace-based)
 * - Create per-package entry points that import all namespace files
 * - esbuild bundles them into ESM output with namespace preserved
 */

var fs = require('fs');
var path = require('path');
var esbuild = require('esbuild');

var ROOT = path.join(__dirname, '..');

var PACKAGES = [
  {
    name: 'core',
    srcDir: 'src/egret',
    entrySymbols: ['DisplayObject', 'Bitmap', 'Stage', 'Event', 'Texture'],
  },
  {
    name: 'eui',
    srcDir: 'src/extension/eui',
    entrySymbols: ['UIComponent', 'Button', 'List', 'Theme'],
  },
  {
    name: 'game', 
    srcDir: 'src/extension/game',
    entrySymbols: ['MovieClip', 'URLLoader', 'URLRequest'],
  },
  {
    name: 'tween',
    srcDir: 'src/extension/tween',
    entrySymbols: ['Tween', 'Ease'],
  },
  {
    name: 'socket',
    srcDir: 'src/extension/socket',
    entrySymbols: ['ISocket', 'WebSocket'],
  },
];

function walkTsFiles(dir) {
  var results = [];
  try {
    var entries = fs.readdirSync(dir, { withFileTypes: true });
    for (var i = 0; i < entries.length; i++) {
      var fullPath = path.join(dir, entries[i].name).replace(/\\/g, '/');
      if (entries[i].isDirectory() && entries[i].name !== 'node_modules') {
        results = results.concat(walkTsFiles(fullPath));
      } else if (entries[i].isFile() && entries[i].name.endsWith('.ts') && !entries[i].name.endsWith('.d.ts')) {
        results.push(fullPath);
      }
    }
  } catch (e) {
    console.error('Error walking ' + dir + ': ' + e.message);
  }
  return results;
}

function createEntryFile(srcDir, pkgName, rootRel) {
  var files = walkTsFiles(srcDir);
  var entryContent = '';

  // Add DEBUG/RELEASE declaration first
  entryContent += '/// <reference path="../Defines.debug.ts" />\n';

  // Add a reference to every source file in order
  for (var i = 0; i < files.length; i++) {
    var rel = path.relative(path.join(ROOT, 'src'), files[i]).replace(/\\/g, '/');
    entryContent += '/// <reference path="../' + rel + '" />\n';
  }

  // Add a dummy export to make it a module
  entryContent += '\nexport {};\n';

  var entryPath = path.join(ROOT, 'packages', pkgName, 'src', '_entry.ts');
  fs.writeFileSync(entryPath, entryContent, 'utf8');
  console.log('  Created entry: ' + entryPath + ' (' + files.length + ' refs)');
  return entryPath;
}

async function buildPackage(pkg) {
  var srcDir = path.join(ROOT, pkg.srcDir);
  var distDir = path.join(ROOT, 'packages', pkg.name, 'dist');

  if (!fs.existsSync(srcDir)) {
    console.log('  Skipping ' + pkg.name + ': source not found at ' + srcDir);
    return;
  }

  // Ensure dist exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Create entry file
  var entryPath = createEntryFile(srcDir, pkg.name, path.relative(ROOT, srcDir));
  var outFile = path.join(distDir, 'index.js');

  console.log('  Building with esbuild...');

  try {
    var result = await esbuild.build({
      entryPoints: [entryPath],
      bundle: true,
      format: 'esm',
      target: 'es2020',
      outfile: outFile,
      platform: 'browser',
      minify: false,
      // Keep namespaces
      keepNames: true,
      // Handle /// <reference> via tsconfig
      tsconfig: path.join(ROOT, 'packages', pkg.name, 'tsconfig.json'),
      // Logging
      logLevel: 'info',
    });

    var stat = fs.statSync(outFile);
    console.log('  Output: ' + outFile + ' (' + (stat.size / 1024).toFixed(1) + ' KB)');

    // Clean up entry file
    fs.unlinkSync(entryPath);
  } catch (e) {
    console.error('  Build error for ' + pkg.name + ': ' + e.message);
    // Clean up entry file
    if (fs.existsSync(entryPath)) fs.unlinkSync(entryPath);
  }
}

async function main() {
  console.log('Building ESM packages with esbuild...\n');

  for (var i = 0; i < PACKAGES.length; i++) {
    var pkg = PACKAGES[i];
    console.log('@egret-r/' + pkg.name + ':');
    await buildPackage(pkg);
    console.log('');
  }

  console.log('Done.');
}

main().catch(function(e) {
  console.error('Fatal error:', e.message);
  process.exit(1);
});
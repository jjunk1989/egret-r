#!/usr/bin/env node
/**
 * Build all example demos under examples/
 * Usage: node scripts/build-examples.js
 */
var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var EXAMPLES_DIR = path.join(__dirname, '..', 'examples');
var SKIP = []; // add folder names to skip

var dirs = fs.readdirSync(EXAMPLES_DIR, { withFileTypes: true })
  .filter(function(d) { return d.isDirectory() && SKIP.indexOf(d.name) < 0; })
  .filter(function(d) { return fs.existsSync(path.join(EXAMPLES_DIR, d.name, 'package.json')); })
  .map(function(d) { return d.name; });

console.log('Building ' + dirs.length + ' example(s): ' + dirs.join(', ') + '\n');

var failed = [];
dirs.forEach(function(name) {
  var dir = path.join(EXAMPLES_DIR, name);
  console.log('[' + name + '] installing...');
  try {
    cp.execSync('npm install', { cwd: dir, stdio: 'pipe' });
  } catch (e) { /* ignore install warnings */ }

  console.log('[' + name + '] building...');
  try {
    cp.execSync('npx vite build', { cwd: dir, stdio: 'pipe' });
    console.log('[' + name + '] ✅ done\n');
  } catch (e) {
    failed.push(name);
    console.error('[' + name + '] ❌ FAILED\n');
    if (e.stderr) console.error(e.stderr.toString());
  }
});

if (failed.length > 0) {
  console.error('\nFAILED: ' + failed.join(', '));
  process.exit(1);
}
console.log('\nAll ' + dirs.length + ' examples built successfully.');

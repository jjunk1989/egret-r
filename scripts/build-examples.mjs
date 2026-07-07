#!/usr/bin/env node
/**
 * Build all example demos under examples/
 * Usage: node scripts/build-examples.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import cp from 'node:child_process';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const EXAMPLES_DIR = path.join(__dirname, '..', 'examples');
const SKIP = ['wx-game']; // mini-game projects (not web-based)

const dirs = fs.readdirSync(EXAMPLES_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory() && !SKIP.includes(d.name))
  .filter(d => fs.existsSync(path.join(EXAMPLES_DIR, d.name, 'package.json')))
  .map(d => d.name);

console.log('Building ' + dirs.length + ' example(s): ' + dirs.join(', ') + '\n');

const failed = [];
for (const name of dirs) {
  const dir = path.join(EXAMPLES_DIR, name);
  console.log('[' + name + '] installing...');
  try {
    cp.execSync('npm install', { cwd: dir, stdio: 'pipe' });
  } catch (_) { /* ignore install warnings */ }

  console.log('[' + name + '] building...');
  try {
    cp.execSync('npx vite build', { cwd: dir, stdio: 'pipe' });
    console.log('[' + name + '] ✅ done\n');
  } catch (e) {
    failed.push(name);
    console.error('[' + name + '] ❌ FAILED\n');
    if (e.stderr) console.error(e.stderr.toString());
  }
}

if (failed.length > 0) {
  console.error('\nFAILED: ' + failed.join(', '));
  process.exit(1);
}
console.log('\nAll ' + dirs.length + ' examples built successfully.');

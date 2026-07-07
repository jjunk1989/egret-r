import fs from 'node:fs';
import path from 'node:path';
import childProcess from 'node:child_process';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pkgs = ['core', 'eui', 'game', 'tween', 'socket'];
const root = path.join(__dirname, '..', 'packages');

console.log('=== Package Build Verification ===\n');

let hasError = false;

for (const pkg of pkgs) {
  const dist = path.join(root, pkg, 'dist');
  console.log('@egret-r/' + pkg + ':');

  for (const file of ['index.js', 'index.min.js', 'index.d.ts']) {
    const fp = path.join(dist, file);
    if (!fs.existsSync(fp)) {
      console.log('  ' + file + ': MISSING');
      hasError = true;
      continue;
    }

    const stat = fs.statSync(fp);
    const sizeKB = (stat.size / 1024).toFixed(1);
    console.log('  ' + file + ': ' + sizeKB + ' KB');
  }
}

console.log('\n=== Bare Symbol Gate ===\n');
const bareCheck = childProcess.spawnSync(
  process.execPath,
  [path.join(__dirname, 'check-bare-symbols.mjs')],
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

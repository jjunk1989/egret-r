import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pkgs = ['core', 'eui', 'game', 'tween', 'socket'];
const root = path.join(__dirname, '..', 'packages');

for (const pkg of pkgs) {
  const d = path.join(root, pkg, 'dist');
  if (fs.existsSync(d)) {
    fs.rmSync(d, { recursive: true, force: true });
    console.log('  Cleared packages/' + pkg + '/dist/');
  }
}
console.log('Done.');

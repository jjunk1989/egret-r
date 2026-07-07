import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function walk(dir) {
  const results = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const fp = path.join(dir, e.name).replace(/\\/g, '/');
      if (e.isDirectory() && e.name !== 'node_modules') {
        results.push(...walk(fp));
      } else if (e.name.endsWith('.ts') && !e.name.endsWith('.d.ts')) {
        results.push(fp);
      }
    }
  } catch (_) {}
  return results;
}

const srcDirs = ['src/egret', 'src/extension/eui', 'src/extension/game'];
for (const dir of srcDirs) {
  const files = walk(dir);
  const native = files.filter(f => /[\\/]native[/\\]/i.test(f) || /NativeContext/.test(f));
  console.log(dir + ': ' + native.length + ' native files');
  native.forEach(f => console.log('  ' + f));
}

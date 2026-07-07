import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');

function walkTsFiles(dir) {
  const r = [];
  try {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
      const p = path.join(dir, e.name);
      if (e.isDirectory() && e.name !== 'node_modules') r.push(...walkTsFiles(p));
      else if (e.isFile() && e.name.endsWith('.ts') && !e.name.endsWith('.d.ts')) r.push(p);
    });
  } catch (_) {}
  return r;
}

function buildReverseMap(content) {
  const map = {};
  const re = /^import\s+\{([^}]+)\}\s+from\s+["'](.+)["'];?\s*$/gm;
  let m;
  while ((m = re.exec(content)) !== null) {
    const names = m[1].split(',').map(s => s.trim());
    const importPath = m[2];
    const isEgret = importPath.includes('/egret/');
    const isEui = importPath.includes('/eui/');
    if (isEgret || (!isEui && (importPath.startsWith('../') || importPath.startsWith('./')))) {
      for (const name of names) {
        map[name] = 'egret.' + name;
      }
    }
  }
  // Also handle default imports
  const re2 = /^import\s+(\w+)\s+from\s+["'](.+)["'];?\s*$/gm;
  while ((m = re2.exec(content)) !== null) {
    const importPath = m[2];
    if (importPath.includes('/egret/') || importPath.includes('/eui/')) {
      map[m[1]] = importPath.includes('/eui/') ? 'eui.' + m[1] : 'egret.' + m[1];
    }
  }
  return map;
}

function scan() {
  const files = walkTsFiles(SRC);
  const results = [];
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const reverseMap = buildReverseMap(content);
    // Find egret.XXX / eui.XXX usages that could be bare
    const re = /(?<!import\s)(?<!\.)(?<!["'`])(egret|eui)\.(\w+)/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      const full = m[1] + '.' + m[2];
      const sym = m[2];
      if (!reverseMap[sym]) {
        const rel = path.relative(ROOT, file).replace(/\\/g, '/');
        results.push({ file: rel, symbol: full });
      }
    }
  }
  return results;
}

console.log('Cleaning up ESM source files...');
// This is a one-shot cleanup script - the actual implementation
// would modify files to add missing imports.
const results = scan();
if (results.length === 0) {
  console.log('No bare references found.');
} else {
  console.log(`Found ${results.length} possible bare references.`);
  for (const r of results.slice(0, 10)) {
    console.log(`  ${r.file}: ${r.symbol}`);
  }
  if (results.length > 10) console.log(`  ... and ${results.length - 10} more`);
}

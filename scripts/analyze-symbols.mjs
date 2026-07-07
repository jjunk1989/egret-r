import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pkgSrc = path.join(__dirname, '..', 'packages', 'core', 'src');

function walk(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== 'node_modules') {
      results.push(...walk(fp));
    } else if (e.name.endsWith('.ts') && !e.name.endsWith('.d.ts')) {
      results.push(fp);
    }
  }
  return results;
}

const files = walk(pkgSrc);

// Gather all exported symbols
const symbolToFile = {};
const symbolCounts = {};

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative(pkgSrc, file);
  // extract all exported symbols
  const re = /export\s+(?:const|let|var|function|class|abstract\s+class|enum)\s+(\w+)/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const sym = m[1];
    symbolCounts[sym] = (symbolCounts[sym] || 0) + 1;
    if (!symbolToFile[sym]) symbolToFile[sym] = [];
    symbolToFile[sym].push(rel);
  }
}

// Show duplicate exports
console.log('Duplicate exported symbols:\n');
let count = 0;
for (const sym of Object.keys(symbolCounts).sort()) {
  if (symbolCounts[sym] > 1) {
    count++;
    console.log(`  ${sym} (${symbolCounts[sym]} times):`);
    for (const f of symbolToFile[sym]) {
      console.log(`    - ${f}`);
    }
  }
}
if (count === 0) console.log('  (none)');

// nativeRender 全局化：从所有文件移除 `import { nativeRender } from "...Player"`（裸用改解析全局）
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', 'src');

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith('.ts') && !e.name.endsWith('.d.ts')) out.push(p);
  }
  return out;
}

let changed = 0;
for (const f of walk(ROOT)) {
  let text = fs.readFileSync(f, 'utf8');
  const orig = text;
  // 匹配 import { ... nativeRender ... } from "...Player";  或包含其他符号
  text = text.replace(
    /import\s*\{([^}]*\bnativeRender\b[^}]*)\}\s*from\s*['"][^'"]*Player['"]\s*;/g,
    (m, inner) => {
      const syms = inner.split(',').map((s) => s.trim()).filter((s) => s && s !== 'nativeRender');
      if (syms.length === 0) return '';
      return `import { ${syms.join(', ')} } from ${m.match(/from\s*(['"][^'"]*Player['"])/)[1]};`;
    }
  );
  if (text !== orig) {
    fs.writeFileSync(f, text);
    changed++;
    const rel = path.relative(path.join(__dirname, '..'), f).replace(/\\/g, '/');
    console.log('✓ ' + rel);
  }
}
console.log('处理文件数:', changed);

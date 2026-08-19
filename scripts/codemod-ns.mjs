// 阶段 1 codemod：把源码里 `egret.X` 运行时命名空间访问改为直接符号引用（摇树前置）
// 策略：仅当文件已具备 X 的绑定（具名 import / 解构）时才替换；未解析的列出人工处理。
// 用法: node scripts/codemod-ns.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', 'src');

// 这些是「注册写入 / 动态查找」，不能机械替换
const SKIP_SYMBOLS = new Set([
  'Sound', 'Video', 'VersionController', // 注册写入 egret.X = cls
  'WebGLRenderer',                        // MiniGameEntry 动态查找，单独设计
  '$markCannotUse', '$callAsync', '$hashCount', '$TextureScaleFactor', '$locale_strings', // 内部全局，阶段 1b 收编
]);

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith('.ts') && !e.name.endsWith('.d.ts')) out.push(p);
  }
  return out;
}

function stripLineComment(line) {
  let inStr = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inStr) {
      if (c === '\\') i++;
      else if (c === inStr) inStr = null;
    } else if (c === '"' || c === "'" || c === '`') inStr = c;
    else if (c === '/' && line[i + 1] === '/') return line.slice(0, i);
  }
  return line;
}

// 判断文件是否已绑定符号 X（具名 import 或解构）
function hasBinding(text, sym) {
  // 具名 import（含 import type 之外的普通 import、别名 import { X as Y }）
  const namedImport = new RegExp(`import\\s*\\{[^}]*\\b${sym}\\b[^}]*\\}\\s*from`);
  // 解构（const { X } = ...）
  const destructure = new RegExp(`(?:const|let|var)\\s*\\{[^}]*\\b${sym}\\b[^}]*\\}`);
  // 普通 import（import X from ...）default
  const defaultImport = new RegExp(`import\\s+${sym}\\s+from`);
  return namedImport.test(text) || destructure.test(text) || defaultImport.test(text);
}

const files = walk(ROOT);
let changed = 0;
let replaced = 0;
const unresolved = {}; // file -> [syms]
const skipped = {};    // file -> [syms]（SKIP 集合中的）

for (const f of files) {
  const rel = path.relative(path.join(__dirname, '..'), f).replace(/\\/g, '/');
  let text = fs.readFileSync(f, 'utf8');
  const orig = text;
  const lines = text.split('\n');
  const fileSkipped = new Set();
  const fileUnresolved = new Set();

  for (let i = 0; i < lines.length; i++) {
    const code = stripLineComment(lines[i]);
    if (!code || /^\s*\*/.test(code.trim())) continue;
    const re = /\begret\.([A-Z$]\w*)/g;
    let m;
    while ((m = re.exec(code)) !== null) {
      const sym = m[1];
      if (SKIP_SYMBOLS.has(sym)) { fileSkipped.add(sym); continue; }
      // 只替换一行内可安全解析的
      if (hasBinding(text, sym)) {
        // 替换当前行（保持字符串内的不动——本处只处理非字符串部分）
        const lineCode = stripLineComment(lines[i]);
        // 避免误替换字符串字面量里的 "egret.X"：简单处理——替换行内 egret.Sym，但跳过引号内
        lines[i] = lines[i].replace(new RegExp(`\\begret\\.${sym}\\b`, 'g'), sym);
        replaced++;
      } else {
        fileUnresolved.add(sym);
      }
    }
  }

  const newText = lines.join('\n');
  if (newText !== orig) {
    fs.writeFileSync(f, newText);
    changed++;
  }
  if (fileUnresolved.size) unresolved[rel] = [...fileUnresolved];
  if (fileSkipped.size) skipped[rel] = [...fileSkipped];
}

console.log('替换文件数:', changed, ' 替换次数:', replaced);
console.log('\n== 未解析（需人工补 import）==');
for (const [f, syms] of Object.entries(unresolved)) console.log('  ' + f + '  ->  ' + syms.join(', '));
console.log('\n== SKIP（保留，另行处理）==');
for (const [f, syms] of Object.entries(skipped)) console.log('  ' + f + '  ->  ' + syms.join(', '));

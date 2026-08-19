// 最小摇树实验：只 import match 实际用到的 core 符号，验证 esm 产物可摇树
import fs from 'node:fs';
import path from 'node:path';
import esbuild from 'esbuild';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const entry = path.join(__dirname, '.esm-tmp-entry.mjs');
const out = path.join(__dirname, '.esm-tmp-out.js');
const entryCode = `
import { Bitmap, BitmapFillMode, DisplayObject, DisplayObjectContainer, Event, HorizontalAlign,
         IOErrorEvent, ImageLoader, Rectangle, Shape, Stage, TextField, Texture, TouchEvent, VerticalAlign,
         startMiniGame, WebGLRenderer } from '@egret-r/core/esm';
globalThis.__used = { Bitmap, BitmapFillMode, DisplayObject, DisplayObjectContainer, Event, HorizontalAlign,
  IOErrorEvent, ImageLoader, Rectangle, Shape, Stage, TextField, Texture, TouchEvent, VerticalAlign,
  startMiniGame, WebGLRenderer };
`;
fs.writeFileSync(entry, entryCode);

let size = NaN;
try {
  const r = await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    outfile: out,
    format: 'iife',
    platform: 'neutral',
    target: 'es2020',
    minify: true,
    logLevel: 'warning',
  });
  size = fs.statSync(out).size;
} catch (e) {
  console.log('BUILD FAILED');
  if (e.errors) for (const er of e.errors) console.log('  ' + er.location?.file + ':' + er.location?.line + ' ' + er.text);
  else console.log(e.message);
  fs.rmSync(entry); fs.rmSync(out, { force: true });
  process.exit(1);
}
console.log('ESM 摇树产物:', (size / 1024).toFixed(1), 'KB');
const b = fs.readFileSync(out, 'utf8');
const checks = ['WebPlayer', 'WebTouchHandler', 'HtmlSound', 'WebVideo', 'CanvasRenderer', 'WxAdapter', 'AlipayAdapter', 'TextAtlasRender', 'KTXContainer'];
for (const c of checks) {
  // minify 后类名被压缩，用弱检测（出现 0 次即摇掉；>0 需人工判断）
  console.log(String(b.split(c).length - 1).padStart(4) + '  ' + c);
}
console.log('startMiniGame:', b.split('startMiniGame').length - 1);
fs.rmSync(entry); fs.rmSync(out);

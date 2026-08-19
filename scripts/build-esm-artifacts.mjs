// 为 shakeable ESM 产物生成 init.mjs（全局 egret 引导）与 index.mjs（re-export 入口）
// 用法: node scripts/build-esm-artifacts.mjs [pkgName...]  （默认 core game）
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// ---- init.mjs 模板（提取自 build-esm-direct.mjs 的 IIFE header 核心） ----
const INIT_TEMPLATE = `// Auto-generated runtime bootstrap for the shakeable ESM build.
// Creates the global \`egret\` namespace object and environment polyfills
// (window/navigator/devicePixelRatio/DOMParser/localStorage). Must be the
// first import in index.mjs so downstream bundles initialize the globals
// before any engine module runs.
const g = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : global;
if (!g.egret) { try { g.egret = { sys: {}, pro: {} }; } catch (e) { g.egret = {}; } }
if (!g.egret.sys) { try { g.egret.sys = {}; } catch (e) {} }
if (typeof g.window === "undefined") { try { g.window = g; } catch (e) {} }
if (typeof g.navigator === "undefined") {
  try {
    const __api = g.wx || g.tt || g.ks || g.qq || g.my;
    const __info = __api && __api.getSystemInfoSync ? __api.getSystemInfoSync() : null;
    const __plat = (__info && __info.platform) || "web";
    const __sys = (__info && __info.system) || "";
    const __lang = (__info && __info.language) || "zh_CN";
    g.navigator = { userAgent: (__plat + (__sys ? " " + __sys : "") + " mobile").toLowerCase(), platform: __plat, language: __lang, browserLanguage: __lang, maxTouchPoints: 1 };
  } catch (e) {
    g.navigator = { userAgent: "mobile", platform: "web", language: "zh_CN", browserLanguage: "zh_CN", maxTouchPoints: 1 };
  }
}
if (g.devicePixelRatio === undefined) { try { g.devicePixelRatio = (g.wx && g.wx.getSystemInfoSync && g.wx.getSystemInfoSync().pixelRatio) || 1; } catch (e) { g.devicePixelRatio = 1; } }
if (typeof g.DOMParser === "undefined") { g.DOMParser = function () { this.parseFromString = function () { return { childNodes: [], documentElement: null, getElementsByTagName: function () { return []; } }; }; }; }
if (typeof g.localStorage === "undefined") { g.localStorage = { _d: {}, getItem(k) { return this._d[k] || null; }, setItem(k, v) { this._d[k] = v; }, removeItem(k) { delete this._d[k]; }, clear() { this._d = {}; } }; }
`;

function walkJs(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkJs(p));
    else if (e.name.endsWith('.js') && !e.name.endsWith('.d.ts')) out.push(p);
  }
  return out;
}

// web/ DOM 专属模块：不进入默认入口（index.mjs 不 re-export）。
// 小游戏场景不需要 DOM 实现（HtmlSound/WebVideo/WebImageLoader/WebHideHandler 等），
// 且 Html5Capatibility -> WebHideHandler -> HtmlSound 副作用链会阻止 esbuild 摇树。
// 保留 WebGL 渲染管线（web/rendering/**）、WebSysImpl.ts（WebGL 类型支持）。
function isWebDomModule(relPath) {
  if (/\/rendering\//.test(relPath)) return false;
  if (/WebSysImpl\.js$/.test(relPath)) return false;
  if (/\/web\//.test(relPath) || /\/media\/web\//.test(relPath) || /\/net\/web\//.test(relPath)) return true;
  return false;
}

// 从编译产物中提取每个文件的导出符号
function extractExports(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const syms = [];
  // ESM: export const/let/var/function/enum X  /  export class X
  const re1 = /export\s+(?:const|let|var|function|enum|class)\s+([A-Za-z_$][\w$]*)/g;
  // export { X, Y as Z }
  const re2 = /export\s*\{([^}]+)\}/g;
  let m;
  while ((m = re1.exec(text)) !== null) syms.push(m[1]);
  while ((m = re2.exec(text)) !== null) {
    for (const part of m[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/)[0].trim();
      if (name) syms.push(name);
    }
  }
  // 跳过含副作用不导出的（只有 export default 的情况忽略）
  return [...new Set(syms)];
}

function buildPkg(pkgName) {
  const esmDir = path.join(ROOT, 'packages', pkgName, 'dist', 'esm');
  if (!fs.existsSync(esmDir)) {
    console.log('skip ' + pkgName + ': ' + esmDir + ' 不存在（先跑 tsc -p tsconfig.esm.json / 各包配置）');
    return;
  }
  fs.writeFileSync(path.join(esmDir, 'init.mjs'), INIT_TEMPLATE);

  // 收集全部导出（按相对路径），跳过 web DOM 专属模块
  const exports = []; // { sym, rel }
  const seen = new Set();
  for (const f of walkJs(esmDir)) {
    if (f.endsWith('init.mjs') || f.endsWith('index.mjs')) continue;
    let rel = path.relative(esmDir, f).replace(/\\/g, '/').replace(/\.js$/, '');
    if (!rel.startsWith('.')) rel = './' + rel;
    if (isWebDomModule(rel)) continue;
    for (const sym of extractExports(f)) {
      if (seen.has(sym)) continue;
      seen.add(sym);
      exports.push({ sym, rel });
    }
  }

  // index.mjs：先副作用引导，再按需 re-export
  let index = "// Auto-generated shakeable ESM entry.\n";
  index += "import './init.mjs';\n";
  // Defines.debug 副作用：挂载 $error/$warn/$markCannotUse 等到全局 egret
  if (fs.existsSync(path.join(esmDir, 'Defines.debug.js'))) {
    index += "import './Defines.debug.js';\n";
  }
  for (const e of exports) {
    index += `export { ${e.sym} } from "${e.rel}";\n`;
  }
  fs.writeFileSync(path.join(esmDir, 'index.mjs'), index);

  // 非 core 包：跨包 import 指向 shakeable 子路径，保证下游可摇树
  if (pkgName !== 'core') {
    for (const f of walkJs(esmDir)) {
      if (f.endsWith('init.mjs') || f.endsWith('index.mjs')) continue;
      let text = fs.readFileSync(f, 'utf8');
      const next = text.replace(/(['"])@egret-r\/core\1/g, "'@egret-r/core/esm'");
      if (next !== text) {
        fs.writeFileSync(f, next);
      }
    }
    console.log(pkgName + ': 跨包 @egret-r/core -> @egret-r/core/esm');
  }
  console.log(pkgName + ': init.mjs + index.mjs 生成 (' + exports.length + ' 个导出符号)');
}

const pkgs = process.argv.slice(2).length ? process.argv.slice(2) : ['core', 'game'];
for (const p of pkgs) buildPkg(p);

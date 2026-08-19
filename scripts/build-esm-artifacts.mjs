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
// Node-style \`global\` alias (IIFE build used \`var global = __global\`);
// SystemTicker/getDefinitionByName/HashObject reference bare \`global\`.
if (typeof g.global === "undefined") { try { g.global = g; } catch (e) {} }
// Node-style \`__global\` alias (IIFE build used \`var __global = ...\`);
// Player.ts references bare \`__global\`.
if (typeof g.__global === "undefined") { try { g.__global = g; } catch (e) {} }
// Node-style \`sys\` alias (IIFE build used \`var sys = egret.sys\`);
// MiniGameEntry etc. reference bare \`sys\`.
if (g.egret.sys) { try { g.sys = g.egret.sys; } catch (e) {} }
// DEBUG / RELEASE / warn globals (IIFE build used \`var DEBUG = true, RELEASE = false, warn = console.warn...\`);
// Defines.debug.ts references bare \`warn\` and some modules use bare \`DEBUG\`.
try { if (typeof g.DEBUG === "undefined") g.DEBUG = true; } catch (e) {}
try { if (typeof g.RELEASE === "undefined") g.RELEASE = false; } catch (e) {}
try { if (typeof g.warn === "undefined") g.warn = (typeof console !== "undefined" ? console.warn.bind(console) : function () {}); } catch (e) {}
try { if (typeof g.nativeRender === "undefined") g.nativeRender = false; } catch (e) {}
try { g.egret.nativeRender = false; } catch (e) {}
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
    if (f.endsWith('init.mjs') || f.endsWith('index.mjs') || f.endsWith('shakeable.mjs')) continue;
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
  // WebImageLoader 副作用：注册 ImageLoader 具体实现（setImageLoader(WebImageLoader)）。
  // 它位于 net/web/ 被 isWebDomModule 过滤（不进 re-export），但小游戏依赖它经
  // Image polyfill 加载位图，必须保留下副作用 import 以执行注册。
  if (fs.existsSync(path.join(esmDir, 'egret/net/web/WebImageLoader.js'))) {
    index += "import './egret/net/web/WebImageLoader';\n";
  }
  // WebTextMeasurer 副作用：注册 sys.measureText（TextField 文本测量必需，
  // 小游戏用 canvas 测量，非 DOM 专属）。位于 text/web/ 被 isWebDomModule 过滤。
  if (fs.existsSync(path.join(esmDir, 'egret/text/web/WebTextMeasurer.js'))) {
    index += "import './egret/text/web/WebTextMeasurer';\n";
  }
  // 引擎内部有少量裸 `egret.X` 读取（如 DisplayList 的 `(egret as any).Stage`），
  // esm 没有 _ns 挂载，需显式挂到全局 egret 对象（白名单，避免全量挂载破坏摇树）。
  // WebGLRenderBuffer/CanvasRenderBuffer：MiniGameEntry 从 egret.X 选主渲染缓冲类。
  // log/warn/error/assert：Console.ts 的全局日志方法（WebGLRenderContext 等裸 egret.log）。
  // utils 命名空间函数：DisplayObject/事件等裸 egret.getQualifiedClassName/getDefinitionByName/...
  const GLOBAL_MOUNT = [
    'Stage', 'Sprite', 'WebGLRenderBuffer', 'CanvasRenderBuffer', 'EgretShaderLib',
    'log', 'warn', 'error', 'assert',
    'getQualifiedClassName', 'getQualifiedSuperclassName', 'getDefinitionByName',
    'hasDefinition', 'registerClass', 'superGetter', 'superSetter',
  ];
  for (const sym of GLOBAL_MOUNT) {
    const e = exports.find((x) => x.sym === sym);
    if (e) {
      index += `import { ${sym} } from "${e.rel}";\nglobalThis.egret.${sym} = ${sym};\n`;
    }
  }
  // re-export 拆到独立 shakeable.mjs（sideEffects:false，可被下游按需摇树）。
  // index.mjs 自身在 sideEffects 白名单 → esbuild 会保守保留它的全部依赖，
  // 若把 re-export 直接放 index.mjs，所有导出模块都会被打进下游 bundle。
  index += "export * from './shakeable.mjs';\n";
  fs.writeFileSync(path.join(esmDir, 'index.mjs'), index);

  let shakeable = "// Auto-generated re-exports (sideEffects: false — fully shakeable downstream).\n";
  for (const e of exports) {
    shakeable += `export { ${e.sym} } from "${e.rel}";\n`;
  }
  fs.writeFileSync(path.join(esmDir, 'shakeable.mjs'), shakeable);

  // 非 core 包：跨包 import 指向 shakeable 子路径，保证下游可摇树
  if (pkgName !== 'core') {
    for (const f of walkJs(esmDir)) {
      if (f.endsWith('init.mjs') || f.endsWith('index.mjs') || f.endsWith('shakeable.mjs')) continue;
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

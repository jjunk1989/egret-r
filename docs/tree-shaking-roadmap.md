# egret-r 引擎 Tree-Shaking 支持路线图

> **状态**：Planning（下一版本的主要更新，暂不实施）
> **记录日期**：2026-08-13
> **目标版本**：下一个发布版本（当前 6.1.7 之后）
> **关联问题**：微信小游戏后台警告「代码注入耗时过长」「代码包下载耗时较长」
> **前置优化 A5/A6 已完成**（2026-08-14，详见下文「已完成的前置优化」）

---

## 一、背景与动机

`match`（修仙消消乐）小游戏以 `@egret-r/core` + `@egret-r/game` 为依赖，实测数据：

| 指标 | 当前值 | 说明 |
|------|--------|------|
| `dist/wx/game.js` | 851 KB（minified） | 引擎代码约占 600–700 KB，是注入耗时主因 |
| `dist/wx/` 总包 | 1.6 MB | 图片 ~0.75 MB + JS 851 KB |
| npm 包体积 | core 863 KB + game 981 KB（未压缩） | game 包重复打包了 core 代码 |

**根因**：引擎发布产物为单文件 IIFE + `_ns(egret, "X", X)` 副作用赋值 + `export { egret }`。
下游 `import { egret }` 后，esbuild 视所有类为「可能被动态访问」的副作用，**完全无法 tree-shake**。
实测 match bundle 中 201 个类全量进入，而游戏实际只用到约 20 个（`WebPlayer`、`WebTouchHandler`、
`HtmlSound`、`WebVideo`、IE9 VBScript hack 等完全无用的代码全部在场）。

**预期收益**：引擎侧 tree-shaking 改造后，`game.js` 可由 851 KB 降至 **400–500 KB**，
直接缓解微信两个警告；叠加图片优化后总包可降至 ~0.9 MB。

---

## 二、目标（验收 KPI）

1. 下游仅 `import { Bitmap }` 时，bundle 中不得出现 `WebPlayer` / `WebTouchHandler` /
   `HtmlSound` / `WebAudioSound` / `WebVideo` / `CanvasRenderer` / IE9 兼容代码。
2. `match` 的 `game.js`：851 KB → ≤ 500 KB（minigame + release 变体）。
3. minigame bundle 中 `en_US` locale 表与 Web/Wx/Tt/Ks/Qq 之外的适配器为 0 引用。
4. 现有 API 完全兼容：`import { egret } from '@egret-r/core'; egret.Bitmap` 用法不破坏。
5. Web examples 23 用例 + wx/tt/ks/qq 四平台构建 + iOS/Android 真机回归全绿。

---

## 三、现状盘点（2026-08-13 实测）

| 指标 | 数值 | 备注 |
|------|------|------|
| 源文件 | 310 个 `.ts` | `src/egret` + `src/extension/{eui,game,tween,socket,assetsmanager,resource}` |
| ESM import | 1092 条 | **约 90% 已 ESM 化**，迁移基础良好 |
| 运行时 `egret.` 残留引用 | **145 处** | 过滤 JSDoc 后（含注释的原始命中 486 处） |
| ├ `egret.Event` 常量访问 | 114 处 | core 54 / eui 50 / game 19 / resource 11 / socket 2 / assetsmanager 1 |
| └ 其余内部全局 | 31 处 | `$markCannotUse` 13、`$callAsync` 4、`$hashCount`、`$locale_strings` 2、`$TextureScaleFactor` 2、`egret.Sprite`/`Stage` 3、setter 注册等 |
| 命名空间声明 | 6 个 | 仅在 `global.d.ts` 环境声明层面 |

**关键结论**：`DisplayObject.ts` 已 `import { Event }` 却仍写 `egret.Event.ENTER_FRAME`——
114 处 `egret.Event` 引用大多是**迁移不完整的历史遗留，而非循环依赖规避**
（Event 不反向 import DisplayObject）。残留清理是机械劳动，不是架构难题。

---

### 已完成的前置优化（2026-08-14）

在阶段 1 之前先行完成两项低风险优化：

**A6：移除 IE9 兼容层（零风险纯删除）**
- 删除 `WebCapability.ts` 的 `injectUIntFixOnIE9()`（含 76KB VBScript 字符串与 `document.write`）
- 删除 `WebHttpRequest.ts` 的 `/msie 9.0/i` arraybuffer 分支

**A5：扩展包不再重复打包 core（构建产物外部化）**
- 方案：esbuild `alias` 将 `@egret-r/core` 映射到 `scripts/shims/core_shim.js`（`export const egret = globalThis.egret`），扩展包 IIFE 运行时从 `globalThis.egret` 取命名空间（core 先执行）
- 收益：`@egret-r/game` 981 KB → **106.6 KB**，eui 等六包同样大幅缩小；`match` 的 `game.js` 857 KB → **525 KB（-39%）**
- 顺带修复三个构建时代遗留 bug：
  1. header 创建对象后未立即写回 `globalThis`，导致 `SysData.ts` 的 `globalThis.egret?.sys || {}` 在 core 首载时分裂出幽灵 sys 对象（`sys.$ticker` 丢失，旧版靠扩展包内嵌 core 重复执行掩盖）
  2. `SystemTicker.ts` 补 `import { sys } from "../system/SysData"`，消除 bare `sys` 幽灵引用
  3. `extraRenames`（`_is`→`_is2`）仅对 core 包生效，否则会破坏扩展包对 `egret._is` 的解构
- 验证：88/88 单测、8 个 Web example 构建、浏览器运行时（core/eui/tween/game 用例零报错）、match/tea 五平台构建全过

**行为变化**：扩展包不再内嵌 core，下游必须显式 `import '@egret-r/core'`（peerDependency 语义，match/tea 已满足）。

---

## 四、主要障碍

| # | 障碍 | 难度 | 说明 |
|---|------|------|------|
| 1 | 145 处命名空间残留 | 🟢 工作量型 | `egret.Event.X` 可 codemod 机械替换；31 处内部全局需收编为真实模块导出 |
| 2 | 发布产物形态 | 🟡 核心 | 单文件 IIFE + `_ns` 副作用阻断摇树；需新增保留模块边界的 ESM 产物 |
| 3 | IIFE header 全局单例初始化 | 🟡 | `globalThis.egret = {sys:{}, pro:{}}`、`DEBUG=true`、`tr()`、`$error`、polyfill 需改为显式副作用模块或模块级单例 |
| 4 | 运行时全局注册模式 | 🟡 | `getDefinitionByName('Main')` 字符串查类、`MiniGameEntry` 的 `globalThis.egret.WebGLRenderer` 动态查找需改为显式 import / 类引用 |
| 5 | ESM 循环依赖 | 🟠 | `DisplayObject ↔ Stage/Bitmap` 等已有 import 循环，目前靠拓扑排序 + IIFE var 提升兜底；需验证 ESM 初始化顺序 |
| 6 | 向后兼容 | 🟠 | `import { egret }` 老用法必须保留；采用双出口策略 |
| 7 | sideEffects 声明 | 🟡 | 标 `false` 可能误摇有副作用模块（sys 注册、locale 填充）；需精确数组或集中注册模块 |
| 8 | 验证体系适配 | 🟢 | `check-dts.mjs` / `verify-bundle.mjs` / `analyze-symbols.mjs` 需同步改造 + 新增禁止符号检查 |

---

## 五、路线图（5 阶段）

### 阶段 0：基线测量（0.5 天）

- [ ] esbuild `metafile: true` 记录当前 match bundle 各模块体积占比
- [ ] 记录 `game.js` 851 KB 与 core/game 包各符号体积基准
- [ ] 跑通 `npm run build` + `examples/basic` 23 用例，建立回归基线

### 阶段 1：清理命名空间残留（1–2 天，纯源码，不碰发布格式）

- [ ] Codemod：`egret.Event.X` → `Event.X`（114 处，跨 6 包；未 import 的文件补 import）
- [ ] 内部全局收编：新建 `src/egret/internal/globals.ts` 导出 `$markCannotUse`、`$callAsync`、
      `$hashCount`、`$TextureScaleFactor`；`$locale_strings` 归入 i18n 模块；
      resource 包 `VersionController` 注册改为显式导出
- [ ] `MiniGameEntry` 的 `globalThis.egret.WebGLRenderer` → `import { WebGLRenderer }`
- [ ] 验收：`npm run build` 全绿、`verify-bundle.mjs` 通过、examples 全跑通（体积不变属预期）

### 阶段 2：新增 shakeable ESM 产物（2–3 天，核心阶段）

- [ ] `build-esm-direct.mjs` 新增 `packages/*/dist/esm/`：`format: 'esm'` + `splitting: true`，
      不 IIFE wrap、不注入 `_ns`；release 构建移除 `keepNames`
- [ ] header 初始化拆出 `dist/esm/init.js`：`egret.sys` 创建、Defines（esbuild `define`）、平台 polyfill
- [ ] package.json：新增 `"./esm"` / `"./minigame"` 导出子路径；`sideEffects` 精确数组
- [ ] d.ts 用 `export as namespace egret` 保持老类型写法兼容
- [ ] 验收：只 import `Bitmap` 的最小摇树实验，产物中 `WebPlayer` / `HtmlSound` 等消失

### 阶段 3：minigame / release 变体（1–2 天）

- [ ] `--minigame` 复用现有文件过滤（排除 `web/`、`HtmlSound.ts` 等）→ 输出 `dist/minigame/`
- [ ] 真正启用 `WEB_ONLY` 宏（当前宏零引用）：`WebPlayer` / `WebTouchHandler` / `WebAudio*` /
      IE9 hack 加守卫或拆模块
- [ ] Release 变体：`define: { DEBUG: 'false' }`；locale 按语言裁剪（minigame 中文版只注入 `zh_CN`）
- [ ] 平台裁剪：`--platform wx` 只打进 `WxAdapter`

### 阶段 4：match 迁移验证（1 天）

- [ ] `match/build.mjs` import 改为 `@egret-r/core/minigame`（fallback：alias 到 `egret-r/src` 源码）
- [ ] `getDefinitionByName('Main')` → `startMiniGame({ entryClass: Main })`
      （引擎侧加显式类引用参数，向下兼容字符串）
- [ ] metafile 验证清单：`WebTouchHandler` / `HtmlSound` / `WebAudioSound` / `WebVideo` /
      `CanvasRenderer` / `en_US` locale / 非 wx 适配器 → **全部为 0**
- [ ] 预期：`game.js` 851 KB → 400–500 KB

### 阶段 5：回归与发布（1 天）

- [ ] 全量回归：Web examples 23 用例 + 四平台构建 + iOS/Android 真机
      （黑屏 / 清晰度 / 全屏三件套复测）
- [ ] `verify-bundle.mjs` 增加「禁止符号清单」检查；引擎内置修复后 `match/scripts/patch-engine.mjs` 可废弃
- [ ] 发布：`prepublishOnly` 同时构建 Web + esm + minigame 三套产物

---

## 六、风险与对策

| 风险 | 对策 |
|------|------|
| 循环依赖初始化顺序（`egret.Sprite.$EVENT_ADD_TO_STAGE_LIST` 静态数组） | `splitting` 同 chunk 保序 + 静态初始化惰性化（getter / 首次访问初始化） |
| `sideEffects: false` 误摇注册模块 | 精确数组而非全局 false；注册类集中到显式 init 模块 |
| 老用户 `import { egret }` 兼容 | 双出口：主入口不动，新入口增量发布 |
| 摇树后遗漏运行时需要的类（反射 / 动态查找） | 阶段 4 真机四平台复测 + `getDefinitionByName` 改为显式注册表 |
| eui 跨包继承 core 类 | peerDependency 去重保证单实例；eui 改 `import { TextField } from '@egret-r/core'` 直引 |

---

## 七、参考资料

- 分析探针脚本（可复用，位于 `match/scripts/`）：
  - `analyze-bundle.mjs`：match bundle 构成统计
  - `check-engine-target.mjs`：引擎包构建目标检测
  - `deep-analyze.mjs`：tree-shaking 失效机制分析
  - `bundle-accounting.mjs`：体积归因
  - `count-ns-refs.mjs`：运行时命名空间引用精确统计
- 相关文档：`match/docs/包体与启动性能优化分析.md`、`match/docs/egret-r引擎修改清单.md`

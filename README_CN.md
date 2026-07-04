# Egret Engine R

> 现代 HTML5 游戏引擎 — ES Module 包，esbuild 驱动。

[![License](https://img.shields.io/badge/license-New%20BSD-blue.svg)](./LICENSE.md)

Egret Engine R 是 Egret HTML5 游戏引擎的现代化版本，重新打包为 **ES Module npm 包**，使用 **esbuild** 作为构建工具链。提供 2D 渲染（Canvas/WebGL）、EUI 组件库、音频、网络、资源管理等功能。

---

## 包列表

| 包名 | 描述 | 体积 (min) |
|------|------|-----------|
| [`@egret-r/core`](./packages/core) | 核心引擎：显示列表、事件、媒体、网络、渲染 | 309 KB |
| [`@egret-r/eui`](./packages/eui) | UI 组件库：Button、List、Scroller、Layouts、EXML | 190 KB |
| [`@egret-r/game`](./packages/game) | 游戏扩展：MovieClip、URLLoader、ScrollView | 33 KB |
| [`@egret-r/tween`](./packages/tween) | 缓动动画：Tween、Ease（链式、并行、等待） | 10 KB |
| [`@egret-r/socket`](./packages/socket) | WebSocket 封装 | 3 KB |

---

## 安装

```bash
npm install @egret-r/core @egret-r/eui @egret-r/game @egret-r/tween
```

---

## 快速开始

### 使用 Vite

```bash
npm create vite@latest my-game -- --template vanilla-ts
cd my-game
npm install @egret-r/core @egret-r/eui @egret-r/game
```

```typescript
// src/main.ts
import { egret } from '@egret-r/core';
import '@egret-r/eui';

class Main extends egret.DisplayObjectContainer {
  constructor() {
    super();
    this.once(egret.Event.ADDED_TO_STAGE, () => {
      this.stage.frameRate = 60;
    }, this);
  }
}

window.Main = Main;

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('game-container') as HTMLDivElement | null;
  if (!container) return;

  container.classList.add('egret-player');
  container.setAttribute('data-entry-class', 'Main');
  container.setAttribute('data-scale-mode', egret.StageScaleMode.NO_SCALE);
  container.setAttribute('data-frame-rate', '60');
  container.setAttribute('data-content-width', String(container.clientWidth || window.innerWidth));
  container.setAttribute('data-content-height', String(container.clientHeight || window.innerHeight));

  egret.runEgret({ renderMode: 'webgl' });
});
```

### 运行 Basic 示例

```bash
# 在仓库根目录执行，一条命令
npm run dev

# 或手动执行：
npm install
npm run build
cd examples/basic && npx vite --host 127.0.0.1 --port 3005 --strictPort
```

浏览器打开 `http://127.0.0.1:3005/`。使用右上角下拉菜单在 **26 个测试用例** 之间切换。

### 测试用例

| 模块 | 用例 |
|------|------|
| Core | 几何/事件/图形/文本/变换/离屏渲染/混合模式/性能×3/HTTP/音频/视频/图片 |
| EUI | 数组集合/按钮/复选框与单选/列表滚动 |
| Game | URL 参数/MovieClip |
| Tween | 缓动/多目标动画 |
| Socket | WebSocket |
| 🎮 小游戏 | **Flappy Bird**, **Breakout**, **2048** |

### 推荐开发工作流

**一条命令（构建 + 开发服务器）：**

```bash
npm run dev
```

开发过程中如需快速迭代，打开**两个终端**：

| 终端 1 | 终端 2 |
|--------|--------|
| `npm run watch` | `npm -w examples/basic run dev` |
| 监听 `src/` 变更 → 自动重构建包 | Vite 开发服务器 → HMR 自动刷新浏览器 |

### 使用 Vite 模板

```bash
# 从 egret-r 仓库复制模板
cp -r templates/vite-game my-game
cd my-game

# 安装依赖
npm install

# 链接本地包（monorepo 开发模式）
npm link ../../packages/core ../../packages/eui ../../packages/game ../../packages/tween

# 启动开发服务器
npm run dev
```

模板 (`templates/vite-game/`) 包含一个可直接运行的游戏框架，内含 Stage、Button、Label 和 Tween 动画示例。详见 [templates/vite-game/README.md](templates/vite-game/README.md)。

### 使用 HTML `<script>` 标签

```html
<script type="module">
  import { egret } from './node_modules/@egret-r/core/dist/index.js';
  import { eui } from './node_modules/@egret-r/eui/dist/index.js';
  
  const stage = egret.Stage.getInstance();
  // ...
</script>
```

---

## API 概览

### @egret-r/core

```typescript
import { egret } from '@egret-r/core';

// 显示对象
const bitmap = new egret.Bitmap(texture);
const shape = new egret.Shape();
shape.graphics.beginFill(0xff0000);
shape.graphics.drawRect(0, 0, 100, 100);

// 舞台
const stage = egret.Stage.getInstance();
stage.addChild(bitmap);

// 事件
bitmap.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
  console.log('点击了！');
}, this);

// HTTP 请求
const request = new egret.HttpRequest();
request.open('https://api.example.com/data.json', egret.HttpMethod.GET);
request.addEventListener(egret.Event.COMPLETE, () => {
  const data = JSON.parse(request.response);
}, this);
request.send();

// 音频
const sound = new egret.Sound();
sound.load('https://example.com/click.mp3');
sound.play();
```

### @egret-r/eui

```typescript
import { eui } from '@egret-r/eui';

// 组件
const list = new eui.List();
const scroller = new eui.Scroller();
const panel = new eui.Panel();

// 布局
const layout = new eui.HorizontalLayout();
layout.gap = 10;
scroller.layout = layout;

// 数据绑定
const collection = new eui.ArrayCollection([
  { label: '项目 1', value: 1 },
  { label: '项目 2', value: 2 },
]);
list.dataProvider = collection;
```

### @egret-r/tween

```typescript
import { Tween, Ease } from '@egret-r/tween';

// 基础缓动
Tween.get(target)
  .to({ x: 200, y: 300 }, 500)
  .to({ scaleX: 1.5, scaleY: 1.5 }, 300, Ease.backOut);

// 链式
Tween.get(obj1)
  .to({ alpha: 0 }, 400)
  .wait(200)
  .call(() => console.log('完成！'));
```

### @egret-r/game

```typescript
import { egret } from '@egret-r/core';
import { game } from '@egret-r/game';

// 影片剪辑
const mcData = game.MovieClipDataFactory.generateMovieClipData(jsonData, texture);
const mc = new game.MovieClip(mcData);
mc.gotoAndPlay('walk');

// URL 加载器
const loader = new game.URLLoader();
loader.dataFormat = game.URLLoaderDataFormat.TEXT;
loader.load(new game.URLRequest('https://example.com/data.txt'));
```

---

## 开发

### 项目结构

```
egret-r/
├── packages/
│   ├── core/          # @egret-r/core
│   ├── eui/           # @egret-r/eui
│   ├── game/          # @egret-r/game
│   ├── tween/         # @egret-r/tween
│   └── socket/        # @egret-r/socket
├── src/               # ESM 源码（namespace→ESM 迁移）
├── scripts/           # 构建工具
└── package.json       # Monorepo 根（npm workspaces）
```

### 命令

```bash
npm install           # 安装依赖
npm run build         # 构建所有 5 个包
npm run build:core    # 仅构建 @egret-r/core
npm run dev           # 构建 + 启动示例开发服务器
npm run clean         # 清理所有 dist/ 目录
npm test              # 运行所有测试（88 项，5 套件）
```

### 构建流程

```
src/egret/*.ts src/extension/*.ts（ESM 源码）
    │
    ├── Defines.debug.ts → 最先注入（调试常量）
    ├── Kahn 拓扑排序 → 解析循环依赖
    ├── import type → 打破剩余循环
    │
    └── esbuild
          ├── bundle + ESM → dist/index_tmp.js
          ├── IIFE 包装 → var 提升解决 class extends
          └── 内联命名空间赋值 → dist/index.js
```

---

## 平台支持

| 平台 | 状态 |
|------|------|
| Chrome、Edge、Firefox、Safari | ✅ 完全支持 |
| iOS Safari、Android Chrome | ✅ 完全支持 |
| 微信小游戏 | ✅（通过 Web API） |
| Facebook Instant Games | ✅ |

---

## 许可证

BSD License — 详见 [LICENSE.md](./LICENSE.md)。
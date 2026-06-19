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
import { eui } from '@egret-r/eui';

// 创建舞台
const stage = egret.Stage.getInstance();
stage.frameRate = 60;

// 创建按钮
const btn = new eui.Button();
btn.label = '开始游戏';
btn.x = 100;
btn.y = 80;
stage.addChild(btn);

// 添加缓动动画
const { Tween, Ease } = await import('@egret-r/tween');
Tween.get(btn).to({ scaleX: 1.2, scaleY: 1.2 }, 300, Ease.elasticOut);
```

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
├── src/               # 原始 namespace 源码（只读参考）
├── scripts/           # 构建工具
└── package.json       # Monorepo 根（npm workspaces）
```

### 命令

```bash
npm install           # 安装依赖
npm run build         # 构建所有包（index.js + index.min.js + index.d.ts）
npm run build:core    # 仅构建 @egret-r/core
npm run watch         # 监控模式 — 源文件变更自动重新构建
npm run clean         # 清理所有 dist/ 目录
npm run verify        # 检查构建产物
```

### 构建流程

```
src/egret/*.ts（namespace 源码）
    │
    ├── Defines.debug.ts → preamble（ambient 声明）
    ├── 按 /// <reference> 依赖关系拓扑排序
    │
    └── esbuild
          ├── bundle + ESM → dist/index.js
          ├── --minify → dist/index.min.js
          └── namespace 拼接 → dist/index.d.ts
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
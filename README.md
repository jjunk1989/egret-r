# Egret Engine R

> Modern HTML5 Game Engine — ES Module packages, esbuild powered.

[![License](https://img.shields.io/badge/license-New%20BSD-blue.svg)](./LICENSE.md)

Egret Engine R is a modernized version of the Egret HTML5 game engine, repackaged as **ES Module npm packages** with **esbuild** as the build toolchain. It provides 2D rendering (Canvas/WebGL), an EUI component library, audio, networking, resource management, and more.

---

## Packages

| Package | Description | Size (min) |
|---------|-------------|------------|
| [`@egret-r/core`](./packages/core) | Core engine: DisplayList, Events, Media, Net, Rendering | 309 KB |
| [`@egret-r/eui`](./packages/eui) | UI component library: Button, List, Scroller, Layouts, EXML | 190 KB |
| [`@egret-r/game`](./packages/game) | Game extensions: MovieClip, URLLoader, ScrollView | 33 KB |
| [`@egret-r/tween`](./packages/tween) | Easing animation: Tween, Ease (chain, parallel, wait) | 10 KB |
| [`@egret-r/socket`](./packages/socket) | WebSocket wrapper | 3 KB |

---

## Installation

```bash
npm install @egret-r/core @egret-r/eui @egret-r/game @egret-r/tween
```

---

## Quick Start

### Using with Vite

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

### Run the Basic Example

```bash
# from repository root
npm install
npm run build

# run the official basic example
cd examples/basic
npx vite --host 127.0.0.1 --port 3005 --strictPort
```

Open `http://127.0.0.1:3005/` in your browser.

### Using the Vite Template

```bash
# Copy the template from the egret-r repository
cp -r templates/vite-game my-game
cd my-game

# Install dependencies
npm install

# Link local packages (monorepo dev)
npm link ../../packages/core ../../packages/eui ../../packages/game ../../packages/tween

# Start dev server
npm run dev
```

The template (`templates/vite-game/`) includes a ready-to-run game skeleton with Stage, Button, Label and Tween animation examples. See [templates/vite-game/README.md](templates/vite-game/README.md) for details.

### Using with HTML `<script>` tag

```html
<script type="module">
  import { egret } from './node_modules/@egret-r/core/dist/index.js';
  import { eui } from './node_modules/@egret-r/eui/dist/index.js';
  
  const stage = egret.Stage.getInstance();
  // ...
</script>
```

---

## API Overview

### @egret-r/core

```typescript
import { egret } from '@egret-r/core';

// Display objects
const bitmap = new egret.Bitmap(texture);
const shape = new egret.Shape();
shape.graphics.beginFill(0xff0000);
shape.graphics.drawRect(0, 0, 100, 100);

// Stage
const stage = egret.Stage.getInstance();
stage.addChild(bitmap);

// Events
bitmap.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
  console.log('Tapped!');
}, this);

// HTTP
const request = new egret.HttpRequest();
request.open('https://api.example.com/data.json', egret.HttpMethod.GET);
request.addEventListener(egret.Event.COMPLETE, () => {
  const data = JSON.parse(request.response);
}, this);
request.send();

// Sound
const sound = new egret.Sound();
sound.load('https://example.com/click.mp3');
sound.play();
```

### @egret-r/eui

```typescript
import { eui } from '@egret-r/eui';

// Components
const list = new eui.List();
const scroller = new eui.Scroller();
const panel = new eui.Panel();

// Layout
const layout = new eui.HorizontalLayout();
layout.gap = 10;
scroller.layout = layout;

// Data binding
const collection = new eui.ArrayCollection([
  { label: 'Item 1', value: 1 },
  { label: 'Item 2', value: 2 },
]);
list.dataProvider = collection;
```

### @egret-r/tween

```typescript
import { Tween, Ease } from '@egret-r/tween';

// Basic tween
Tween.get(target)
  .to({ x: 200, y: 300 }, 500)
  .to({ scaleX: 1.5, scaleY: 1.5 }, 300, Ease.backOut);

// Chain
Tween.get(obj1)
  .to({ alpha: 0 }, 400)
  .wait(200)
  .call(() => console.log('Done!'));
```

### @egret-r/game

```typescript
import { egret } from '@egret-r/core';
import { game } from '@egret-r/game';

// MovieClip
const mcData = game.MovieClipDataFactory.generateMovieClipData(jsonData, texture);
const mc = new game.MovieClip(mcData);
mc.gotoAndPlay('walk');

// URLLoader
const loader = new game.URLLoader();
loader.dataFormat = game.URLLoaderDataFormat.TEXT;
loader.load(new game.URLRequest('https://example.com/data.txt'));
```

---

## Development

### Project Structure

```
egret-r/
├── packages/
│   ├── core/          # @egret-r/core
│   ├── eui/           # @egret-r/eui
│   ├── game/          # @egret-r/game
│   ├── tween/         # @egret-r/tween
│   └── socket/        # @egret-r/socket
├── src/               # Original namespace source (read-only reference)
├── scripts/           # Build tooling
└── package.json       # Monorepo root (npm workspaces)
```

### Commands

```bash
npm install           # Install dependencies
npm run build         # Build all packages (index.js + index.min.js + index.d.ts)
npm run build:core    # Build only @egret-r/core
npm run watch         # Watch mode — auto-rebuild on source changes
npm run clean         # Remove all dist/ directories
npm run verify        # Check build outputs
```

### Build Pipeline

```
src/egret/*.ts (namespace source)
    │
    ├── Defines.debug.ts → preamble (ambient declarations)
    ├── Topological sort by /// <reference> dependencies
    │
    └── esbuild
          ├── bundle + ESM → dist/index.js
          ├── --minify → dist/index.min.js
          └── namespace concatenation → dist/index.d.ts
```

---

## Platform Support

| Platform | Status |
|----------|--------|
| Chrome, Edge, Firefox, Safari | ✅ Full |
| iOS Safari, Android Chrome | ✅ Full |
| WeChat Mini Game | ✅ (via Web API) |
| Facebook Instant Games | ✅ |

---

## License

BSD License — see [LICENSE.md](./LICENSE.md) for details.
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
| [`@egret-r/assetsmanager`](./packages/assetsmanager) | Resource loading &amp; management | —|
| [`@egret-r/resource`](./packages/resource) | Legacy RES module | —|

> Extension packages (`eui`, `game`, `tween`, `socket`, `assetsmanager`, `resource`) declare `@egret-r/core` as **peerDependency** —install core once, no duplication.

🔗 **[Online Demos](https://jjunk1989.github.io/egret-r/)** · 📖 **[API Docs](https://jjunk1989.github.io/egret-r/docs/api/)**

---

## Installation

```bash
npm install @egret-r/core   # required
npm install @egret-r/eui @egret-r/game @egret-r/tween @egret-r/socket  # optional extensions
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
# from repository root — one command
npm run dev

# or manually:
npm install
npm run build
cd examples/basic && npx vite --host 127.0.0.1 --port 3005 --strictPort
```

Open `http://127.0.0.1:3005/` in your browser. Use the top-right dropdown to switch between **23 test cases** covering all packages.

### Test Cases Included

| Module | Cases |
|--------|-------|
| Core | Geometry, Event/Touch, Graphics, Text, Transform, RenderTexture, BlendMode, Benchmark×3, HttpRequest, Sound, Video, ImageLoader |
| EUI | ArrayCollection, Button, CheckBox/RadioButton, List/Scroller |
| Game | URLVariables, MovieClip |
| Tween | Easing, Multi-target |
| Socket | WebSocket |

### Mini-Game Demos

Standalone playable games in `examples/`:

| Project | Directory | Dev Server |
|---------|-----------|------------|
| 🧪 **Basic** | `examples/basic/` | `npm -w examples/basic run dev` → http://localhost:3000 |
| 🐦 **Flappy Bird** | `examples/flappy-bird/` | `npm -w examples/flappy-bird run dev` → http://localhost:3001 |
| 🧱 **Breakout** | `examples/breakout/` | `npm -w examples/breakout run dev` → http://localhost:3002 |
| 🔢 **2048** | `examples/2048/` | `npm -w examples/2048 run dev` → http://localhost:3003 |
| 🐍 **Snake** | `examples/snake/` | `npm -w examples/snake run dev` → http://localhost:3005 |
| 🚀 **Shooter** | `examples/shooter/` | `npm -w examples/shooter run dev` → http://localhost:3006 |
| 💎 **Match-3** | `examples/match3/` | `npm -w examples/match3 run dev` → http://localhost:3008 |
| 🔗 **Link** | `examples/link/` | `npm -w examples/link run dev` → http://localhost:3009 |
| 📱 **Mini-Game** | `examples/minigame/` | Multi-platform Flappy Bird (WeChat/Douyin/Kuaishou/QQ) |

### Recommended Development Workflow

**Single command (build + dev server):**

```bash
npm run dev
```

For fast iteration during development, open **two terminals**:

| Terminal 1 | Terminal 2 |
|------------|------------|
| `npm run watch` | `npm -w examples/basic run dev` |
| Watches `src/` changes —auto-rebuilds packages | Vite dev server —HMR auto-refreshes browser |

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

## Mini-Game Development

Egret Engine R supports **WeChat**, **Douyin**, **Kuaishou**, **QQ**, and **Alipay** mini-games out of the box. A single codebase can target all five platforms.

### Quick Start

```bash
# Copy the multi-platform template
cp -r examples/minigame my-minigame
cd my-minigame

# Install & build for WeChat
npm install
npm run build:wx     # → dist/wx/

# Or build for all platforms at once
npm run build:all    # → dist/wx/ dist/tt/ dist/ks/ dist/qq/ dist/my/
```

Then import the `dist/{platform}/` folder into the corresponding developer tool.

### Project Structure

```
minigame/
├── package.json              # @egret-r/core + @egret-r/game
├── build.mjs                 # Multi-platform bundler (--platform wx|tt|ks|qq)
├── platforms/                # Per-platform config files
│   ├── wx/  game.json + project.config.json
│   └── tt/  game.json + project.config.json
├── src/
│   └── game.ts               # Platform-agnostic game code
└── dist/
    ├── wx/  ← import in WeChat DevTools
    └── tt/  ← import in Douyin DevTools
```

### Entry Point

```typescript
// src/game.ts
import { egret } from '@egret-r/core';
import '@egret-r/game';

class Main extends egret.DisplayObjectContainer {
  constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, () => {
      const stage = this.stage!;
      // stage.$stageWidth / stage.$stageHeight = actual screen size
      // ... your game setup ...
    }, this);
  }
}

(globalThis as any).Main = Main;
egret.startMiniGame({ entryClass: 'Main' });
```

`egret.startMiniGame()` auto-detects the platform (`wx`/`tt`/`ks`/`qq`/`my` global) and sets up canvas, touch, WebGL rendering, and the game loop for you.

### Build Commands

| Command | Target |
|---------|--------|
| `npm run build:wx` | WeChat Mini Game → `dist/wx/` |
| `npm run build:tt` | Douyin Mini Game → `dist/tt/` |
| `npm run build:ks` | Kuaishou Mini Game → `dist/ks/` |
| `npm run build:qq` | QQ Mini Game → `dist/qq/` |
| `npm run build:my` | Alipay Mini Game → `dist/my/` |
| `npm run build:all` | All five platforms at once |

Or use the build script directly:

```bash
node build.mjs --platform wx
node build.mjs --platform tt
node build.mjs --all
```

### Audio: `egret.playTone()`

The engine provides a cross-platform sound effect API that works on Web (Web Audio API) and all mini-game platforms (WAV file playback):

```typescript
// Play a simple tone
egret.playTone(440, 100);   // 440 Hz (A4), 100ms
egret.playTone(800, 150);   // 800 Hz, 150ms
```

No platform-specific code needed — the engine selects the right playback method automatically.

### Adding a New Platform

1. Create `platforms/{name}/game.json` and `platforms/{name}/project.config.json`
2. Add a `build:{name}` script in `package.json`

The engine's adapter system handles the rest. See [src/egret/platform/](./src/egret/platform/) for details.

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
│   ├── socket/        # @egret-r/socket
│   ├── assetsmanager/ # @egret-r/assetsmanager
│   └── resource/      # @egret-r/resource
├── src/               # ESM source (namespace→ESM migration)
├── scripts/           # Build tooling (ESM .mjs)
├── examples/          # 9 game demos + testbed + mini-game template
├── docs/api/          # API reference (TypeDoc)
└── package.json       # Monorepo root (npm workspaces)
```

### Commands

```bash
npm install           # Install dependencies
npm run build         # Build all 7 packages (Web target)
npm run build:minigame# Build all packages (Mini-Game target)
npm run build:examples# Build all example demos
npm run dev           # Build + start example dev server
npm run docs          # Generate API docs (TypeDoc)
npm run clean         # Remove all dist/ directories
npm test              # Run all tests
```

### publish

```bash
npm publish --workspaces
```

### Build Pipeline

```
src/egret/*.ts src/extension/*.ts (ESM source)
    │
    ├── Defines.debug.ts → injected first (debug constants)
    ├── Kahn topological sort → resolve dependency order
    ├── Auto-generated ESM entry (_esm_entry.ts)
    ├── Namespace bridging → namespace → ESM re-exports
    │
    └── esbuild
          ├── bundle + ESM → dist/index_tmp.js
          ├── IIFE wrap → var hoisting for class extends
          └── inline namespace assignments → dist/index.js
```

---

## Platform Support

| Platform | Status | Adapter |
|----------|--------|---------|
| Chrome, Edge, Firefox, Safari | ✅ Full | `WebAdapter` (auto) |
| iOS Safari, Android Chrome | ✅ Full | `WebAdapter` (auto) |
| WeChat Mini Game | ✅ | `WxAdapter` |
| Douyin Mini Game | ✅ | `TtAdapter` |
| Kuaishou Mini Game | ✅ | `KsAdapter` |
| QQ Mini Game | ✅ | `QqAdapter` |
| Alipay Mini Game | ✅ | `AlipayAdapter` |
| Facebook Instant Games | ⬜ | Planned |

> All mini-game adapters share the same `GenericMiniGameAdapter` base class.
> Adding a new platform is ~5 lines of code. See [src/egret/platform](./src/egret/platform/).

---

## Links

- 🎮 **[Online Demos](https://jjunk1989.github.io/egret-r/)** playable examples &amp; test cases
- 📖 **[API Docs](https://jjunk1989.github.io/egret-r/docs/api/)** full TypeDoc reference
- 📦 **[GitHub](https://jjunk1989.github.io/egret-r)** source &amp; issues

---

## License

BSD License — see [LICENSE.md](./LICENSE.md) for details.
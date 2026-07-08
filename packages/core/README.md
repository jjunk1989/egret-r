# @egret-r/core

> Egret Engine R Core — Display List, Events, Media, Net, Rendering

The core engine package. Provides the complete 2D rendering engine with Canvas/WebGL backends, display list, event system, touch/mouse input, networking, audio, and text rendering.

## Install

```bash
npm install @egret-r/core
```

## Quick Start

```typescript
import { egret } from '@egret-r/core';

class Main extends egret.DisplayObjectContainer {
  constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, () => {
      const shape = new egret.Shape();
      shape.graphics.beginFill(0xff0000);
      shape.graphics.drawRect(0, 0, 100, 100);
      shape.graphics.endFill();
      this.addChild(shape);
    }, this);
  }
}
```

## Platform Support

| Platform | Adapter |
|----------|---------|
| Browser (Chrome/Edge/Firefox/Safari) | `WebAdapter` |
| WeChat Mini Game | `WxAdapter` |
| Douyin Mini Game | `TtAdapter` |
| Kuaishou Mini Game | `KsAdapter` |
| QQ Mini Game | `QqAdapter` |

🔗 [Source Code](https://github.com/jjunk1989/egret-r) · 🎮 [Demos](https://jjunk1989.github.io/egret-r) · 📖 [API Docs](https://jjunk1989.github.io/egret-r/docs/api/)

## License

BSD-2-Clause — see [LICENSE](./LICENSE)

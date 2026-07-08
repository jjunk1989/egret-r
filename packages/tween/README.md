# @egret-r/tween

> Egret Engine R Tween — Easing Animation Library

Lightweight tween animation library for Egret Engine R. Supports chaining, parallel tweens, delays, callbacks, and 30+ easing functions.

Requires `@egret-r/core` as a peer dependency.

## Install

```bash
npm install @egret-r/core @egret-r/tween
```

## Quick Start

```typescript
import { Tween, Ease } from '@egret-r/tween';

// Basic tween
Tween.get(target)
  .to({ x: 200, y: 300 }, 500)
  .to({ scaleX: 1.5, scaleY: 1.5 }, 300, Ease.backOut);

// Chain with delay and callback
Tween.get(obj)
  .to({ alpha: 0 }, 400)
  .wait(200)
  .call(() => console.log('Done!'));
```

🔗 [Source Code](https://github.com/jjunk1989/egret-r) · 🎮 [Demos](https://jjunk1989.github.io/egret-r) · 📖 [API Docs](https://jjunk1989.github.io/egret-r/docs/api/)

## License

BSD-2-Clause — see [LICENSE](./LICENSE)

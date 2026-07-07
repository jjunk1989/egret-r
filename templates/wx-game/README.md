# Egret Engine R — Mini Game Template

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Build
npm run build

# 3. Open in WeChat DevTools
# Import project → Select this directory
```

## Platform Support

The template auto-detects the platform at runtime:

| Platform | Global API | Adapter |
|----------|-----------|---------|
| 微信小游戏 | `wx` | `WxAdapter` |
| 抖音小游戏 | `tt` | `TtAdapter` |
| 快手小游戏 | `ks` | `KsAdapter` |
| QQ 小游戏 | `qq` | `QqAdapter` |

## Write Your Game

Edit `src/game.ts` — the `Main` class is your game entry point.

```typescript
class Main extends egret.DisplayObjectContainer {
  constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, () => {
      // Your game logic here
    }, this);
  }
}
```

## Engine Features Available

- ✅ Display List (Stage, Sprite, Shape, Bitmap, TextField)
- ✅ WebGL Rendering
- ✅ Touch Events
- ✅ Frame Loop
- ✅ Audio (createInnerAudioContext)
- ✅ HTTP Requests (wx.request)
- ✅ Local Storage (wx.getStorageSync)

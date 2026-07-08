# @egret-r/game

> Egret Engine R Game — Game Extensions

Game-oriented extensions for Egret Engine R. Provides MovieClip animation, URLLoader for HTTP requests with typed responses, URLVariables, and ScrollView.

Requires `@egret-r/core` as a peer dependency.

## Install

```bash
npm install @egret-r/core @egret-r/game
```

## Quick Start

```typescript
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

🔗 [Source Code](https://github.com/jjunk1989/egret-r) · 🎮 [Demos](https://jjunk1989.github.io/egret-r) · 📖 [API Docs](https://jjunk1989.github.io/egret-r/docs/api/)

## License

BSD-2-Clause — see [LICENSE](./LICENSE)

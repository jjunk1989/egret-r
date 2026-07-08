# @egret-r/eui

> Egret Engine R EUI — UI Component Library

A complete UI toolkit for Egret Engine R. Includes Button, List, Scroller, Panel, layouts (horizontal/vertical/tile), data binding via ArrayCollection, and EXML template support.

Requires `@egret-r/core` as a peer dependency.

## Install

```bash
npm install @egret-r/core @egret-r/eui
```

## Quick Start

```typescript
import { eui } from '@egret-r/eui';

const list = new eui.List();
const collection = new eui.ArrayCollection([
  { label: 'Item 1', value: 1 },
  { label: 'Item 2', value: 2 },
]);
list.dataProvider = collection;

const scroller = new eui.Scroller();
scroller.viewport = list;

const layout = new eui.HorizontalLayout();
layout.gap = 10;
scroller.layout = layout;
```

🔗 [Source Code](https://github.com/jjunk1989/egret-r) · 🎮 [Demos](https://jjunk1989.github.io/egret-r) · 📖 [API Docs](https://jjunk1989.github.io/egret-r/docs/api/)

## License

BSD-2-Clause — see [LICENSE](./LICENSE)

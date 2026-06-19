/**
 * Egret Engine R — Basic Example
 * Tests: Stage creation, Display objects, EUI components, Tween animation, Events
 */

import { egret } from '@egret-r/core';
import { eui } from '@egret-r/eui';
import { Tween, Ease } from '@egret-r/tween';

// ─── Stage Setup ────────────────────────────────────────
const stage = egret.Stage.getInstance();
stage.frameRate = 60;

const W = stage.stageWidth;
const H = stage.stageHeight;

// ─── Background ─────────────────────────────────────────
const bg = new egret.Shape();
bg.graphics.beginFill(0x1a1a2e);
bg.graphics.drawRect(0, 0, W, H);
bg.graphics.endFill();
stage.addChild(bg);

// ─── Grid Pattern ───────────────────────────────────────
const grid = new egret.Shape();
grid.graphics.lineStyle(1, 0x2a2a3e);
for (let i = 0; i < W; i += 40) {
  grid.graphics.moveTo(i, 0);
  grid.graphics.lineTo(i, H);
}
for (let j = 0; j < H; j += 40) {
  grid.graphics.moveTo(0, j);
  grid.graphics.lineTo(W, j);
}
grid.graphics.endFill();
stage.addChild(grid);

// ─── Title ──────────────────────────────────────────────
const title = new eui.Label();
title.text = 'Egret Engine R';
title.size = 40;
title.textColor = 0xffffff;
title.x = W / 2;
title.y = 60;
stage.addChild(title);

// ─── Moving Shape (test: graphics + frame loop) ─────────
const movingShape = new egret.Shape();
movingShape.graphics.beginFill(0xe94560);
movingShape.graphics.drawCircle(0, 0, 20);
movingShape.graphics.endFill();
movingShape.x = 100;
movingShape.y = 160;
stage.addChild(movingShape);

// ─── EUI Button (test: component + touch event) ─────────
const btn = new eui.Button();
btn.label = 'Click Me';
btn.x = W / 2;
btn.y = 240;
stage.addChild(btn);

// ─── Info Label (test: dynamic update) ──────────────────
const infoLabel = new eui.Label();
infoLabel.text = 'Ready';
infoLabel.size = 16;
infoLabel.textColor = 0x888888;
infoLabel.x = W / 2;
infoLabel.y = 320;
stage.addChild(infoLabel);

// ─── Animated Square (test: tween + chain) ──────────────
const square = new egret.Shape();
square.graphics.beginFill(0x0f3460);
square.graphics.drawRect(-25, -25, 50, 50);
square.graphics.endFill();
square.x = W - 80;
square.y = 160;
stage.addChild(square);

// ─── Another moving circle ──────────────────────────────
const circle2 = new egret.Shape();
circle2.graphics.beginFill(0x16c79a);
circle2.graphics.drawCircle(0, 0, 15);
circle2.graphics.endFill();
circle2.x = 80;
circle2.y = 460;
stage.addChild(circle2);

// ─── Startup ────────────────────────────────────────────
let clickCount = 0;

// Button click handler
btn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
  clickCount++;
  infoLabel.text = `Clicked ${clickCount} time${clickCount > 1 ? 's' : ''}`;
  infoLabel.textColor = 0x16c79a;

  // Reset color after 1 second
  setTimeout(() => {
    infoLabel.textColor = 0x888888;
  }, 1000);
}, this);

// Tween animations
Tween.get(movingShape, { loop: true })
  .to({ x: W - 100 }, 2000, Ease.sineInOut)
  .to({ x: 100 }, 2000, Ease.sineInOut);

Tween.get(circle2, { loop: true })
  .to({ y: 120 }, 1500, Ease.quadInOut)
  .to({ y: 460 }, 1500, Ease.quadInOut);

Tween.get(square, { loop: true })
  .to({ rotation: 360 }, 3000, Ease.linear);

// Center align title when text is ready
setTimeout(() => {
  title.anchorOffsetX = title.width / 2;
}, 16);

console.log('✅ Egret Engine R demo started');
console.log(`   Stage: ${W}x${H}`);
console.log('   Test items: Shape, Label, Button, Tween, Event');
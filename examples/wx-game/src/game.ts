// SPDX-License-Identifier: BSD-2-Clause
// Egret Engine R — Mini Game Demo (WeChat / Douyin / Kuaishou / QQ)

import { egret } from '@egret-r/core';

// --- Game ---
class Main extends egret.DisplayObjectContainer {
  private box: egret.Shape;
  private colors = [0x38bdf8, 0x818cf8, 0xf472b6, 0x34d399, 0xfbbf24, 0xf87171];
  private ci = 0;

  constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onInit, this);
  }

  private onInit(): void {
    const stage = this.stage!;
    const W = stage.stageWidth;
    const H = stage.stageHeight;

    // Background
    const bg = new egret.Shape();
    bg.graphics.beginFill(0x0f172a);
    bg.graphics.drawRect(0, 0, W, H);
    bg.graphics.endFill();
    this.addChild(bg);

    // Title
    const title = new egret.TextField();
    title.text = 'Egret Engine R';
    title.size = 36;
    title.textColor = 0x38bdf8;
    title.bold = true;
    title.textAlign = egret.HorizontalAlign.CENTER;
    title.width = W;
    title.y = H * 0.12;
    this.addChild(title);

    // Subtitle
    const sub = new egret.TextField();
    sub.text = 'Mini Game Demo';
    sub.size = 22;
    sub.textColor = 0x94a3b8;
    sub.textAlign = egret.HorizontalAlign.CENTER;
    sub.width = W;
    sub.y = H * 0.22;
    this.addChild(sub);

    // Color box
    const box = new egret.Shape();
    this.drawBox(box, this.colors[0]);
    box.x = W / 2 - 60;
    box.y = H * 0.35;
    this.addChild(box);
    this.box = box;

    box.touchEnabled = true;
    box.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
      this.ci = (this.ci + 1) % this.colors.length;
      this.drawBox(box, this.colors[this.ci]);
    }, this);
  }

  private drawBox(shape: egret.Shape, color: number): void {
    shape.graphics.clear();
    shape.graphics.beginFill(color, 0.85);
    shape.graphics.drawRoundRect(0, 0, 120, 120, 16, 16);
    shape.graphics.endFill();
  }
}

// Expose to global (required by engine entry system)
(globalThis as any).Main = Main;

// --- Start --- Auto-detect platform and run
egret.startMiniGame({ entryClass: 'Main' });

// Egret Engine R — Mini Game Template
// Supports: WeChat (wx) / Douyin (tt) / Kuaishou (ks) / QQ (qq)

import { egret } from '@egret-r/core';

class Main extends egret.DisplayObjectContainer {
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
    title.text = 'Hello Egret!';
    title.size = 36;
    title.textColor = 0x38bdf8;
    title.bold = true;
    title.textAlign = egret.HorizontalAlign.CENTER;
    title.width = W;
    title.y = H * 0.3;
    this.addChild(title);

    // Subtitle
    const sub = new egret.TextField();
    sub.text = 'Mini Game Ready';
    sub.size = 22;
    sub.textColor = 0x94a3b8;
    sub.textAlign = egret.HorizontalAlign.CENTER;
    sub.width = W;
    sub.y = H * 0.45;
    this.addChild(sub);
  }
}

(globalThis as any).Main = Main;
egret.startMiniGame({ entryClass: 'Main' });

// SPDX-License-Identifier: BSD-2-Clause
// Egret Engine R — WeChat Mini Game Demo

import { egret } from '@egret-r/core';

// Platform adapter is accessible via egret namespace (set up by _ns() bridge)
declare const wx: any;

// --- Platform Setup ---
egret.registerPlatform(new egret.WxAdapter());

// --- Game Entry ---
class Main extends egret.DisplayObjectContainer {
  constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onInit, this);
  }

  private onInit(): void {
    const stage = this.stage!;
    stage.frameRate = 60;

    // Background
    const bg = new egret.Shape();
    bg.graphics.beginFill(0x1a1a2e);
    bg.graphics.drawRect(0, 0, stage.stageWidth, stage.stageHeight);
    bg.graphics.endFill();
    this.addChild(bg);

    // Title
    const title = new egret.TextField();
    title.text = 'Egret Engine R';
    title.size = 36;
    title.textColor = 0x38bdf8;
    title.bold = true;
    title.textAlign = egret.HorizontalAlign.CENTER;
    title.x = stage.stageWidth / 2 - 150;
    title.y = 100;
    title.width = 300;
    this.addChild(title);

    // Subtitle
    const sub = new egret.TextField();
    sub.text = 'WeChat Mini Game';
    sub.size = 24;
    sub.textColor = 0x94a3b8;
    sub.textAlign = egret.HorizontalAlign.CENTER;
    sub.x = stage.stageWidth / 2 - 150;
    sub.y = 160;
    sub.width = 300;
    this.addChild(sub);

    // Tap to change color square
    const box = new egret.Shape();
    this.drawBox(box, 0x38bdf8);
    box.x = stage.stageWidth / 2 - 60;
    box.y = 250;
    this.addChild(box);

    box.touchEnabled = true;
    const colors = [0x38bdf8, 0x818cf8, 0xf472b6, 0x34d399, 0xfbbf24, 0xf87171];
    let ci = 0;

    box.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
      ci = (ci + 1) % colors.length;
      this.drawBox(box, colors[ci]);
    }, this);

    // FPS counter
    const fpsLabel = new egret.TextField();
    fpsLabel.text = 'FPS: 60';
    fpsLabel.size = 16;
    fpsLabel.textColor = 0x64748b;
    fpsLabel.x = 16;
    fpsLabel.y = stage.stageHeight - 40;
    this.addChild(fpsLabel);

    stage.addEventListener(egret.Event.ENTER_FRAME, () => {
      fpsLabel.text = 'FPS: ' + stage.frameRate;
    }, this);
  }

  private drawBox(shape: egret.Shape, color: number): void {
    shape.graphics.clear();
    shape.graphics.beginFill(color, 0.8);
    shape.graphics.drawRoundRect(0, 0, 120, 120, 16, 16);
    shape.graphics.endFill();
  }
}

// --- Mini Game startup (no DOM, no <div class="egret-player">) ---
function startMiniGame(): void {
  const info = wx.getSystemInfoSync();

  const stage = egret.Stage.getInstance();
  stage.$screen = {
    screenWidth: info.screenWidth,
    screenHeight: info.screenHeight,
    pixelRatio: info.pixelRatio || 1,
  };

  stage.frameRate = 60;
  stage.stageWidth = info.screenWidth;
  stage.stageHeight = info.screenHeight;

  // Create canvas via platform adapter
  const canvas = wx.createCanvas();
  const context = canvas.getContext('webgl');

  // WeChat Mini Game: expose canvas to global
  (globalThis as any).canvas = canvas;

  // Set up rendering
  // Note: simplified for demo — full integration needs RenderBuffer setup
  const main = new Main();
  stage.addChild(main);

  // Frame loop
  function loop(): void {
    stage.dispatchEvent(new egret.Event(egret.Event.ENTER_FRAME));
    canvas.requestAnimationFrame(loop);
  }
  loop();
}

// Entry point
startMiniGame();

/**
 * Egret Engine R — Vite Game Template
 * Entry point for your game.
 */

import { egret } from '@egret-r/core';
import { eui } from '@egret-r/eui';
import { Tween, Ease } from '@egret-r/tween';

// ===== Game Entry =====

class Main {
    private stage: egret.Stage;

    constructor() {
        // Initialize stage
        this.stage = egret.Stage.getInstance();
        this.stage.frameRate = 60;

        // Set background
        this.setBackground();

        // Create UI
        this.createUI();

        // Start game loop
        this.stage.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
    }

    private setBackground(): void {
        const sky = new egret.Shape();
        sky.graphics.beginFill(0x1a1a2e);
        sky.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        sky.graphics.endFill();
        this.stage.addChild(sky);
    }

    private createUI(): void {
        // Title label
        const title = new eui.Label();
        title.text = 'Egret Engine R';
        title.size = 36;
        title.textColor = 0xffffff;
        title.x = this.stage.stageWidth / 2;
        title.y = 120;
        title.anchorOffsetX = title.width / 2;
        this.stage.addChild(title);

        // Subtitle
        const subtitle = new eui.Label();
        subtitle.text = 'Vite + TypeScript + ES Module';
        subtitle.size = 16;
        subtitle.textColor = 0x888888;
        subtitle.x = this.stage.stageWidth / 2;
        subtitle.y = 170;
        subtitle.anchorOffsetX = subtitle.width / 2;
        this.stage.addChild(subtitle);

        // Start button
        const btn = new eui.Button();
        btn.label = '开始游戏';
        btn.x = this.stage.stageWidth / 2;
        btn.y = 300;
        btn.anchorOffsetX = btn.width / 2;
        this.stage.addChild(btn);

        // Button animation
        Tween.get(btn, { loop: true })
            .to({ scaleX: 1.05, scaleY: 1.05 }, 800, Ease.sineInOut)
            .to({ scaleX: 1, scaleY: 1 }, 800, Ease.sineInOut);

        // Click handler
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            console.log('Game started!');
            subtitle.text = 'Game running...';
            subtitle.textColor = 0x00ff88;
        }, this);
    }

    private elapsed = 0;
    private onEnterFrame(evt: egret.Event): void {
        this.elapsed += 1 / this.stage.frameRate;
        // Your game logic here
    }
}

// Boot
window.addEventListener('DOMContentLoaded', () => {
    new Main();
});
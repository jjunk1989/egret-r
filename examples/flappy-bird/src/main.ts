import { egret } from '@egret-r/core';
import '@egret-r/eui';
import '@egret-r/game';

class Main extends egret.DisplayObjectContainer {
  constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, () => {
      // Sky background
      const sky = new egret.Shape();
      sky.graphics.beginFill(0x0ea5e9);
      sky.graphics.drawRect(0, 0, 480, 700);
      sky.graphics.endFill();
      this.addChild(sky);

      // Title
      const label = new egret.TextField();
      label.text = 'Hello Egret!';
      label.size = 32;
      label.textColor = 0xffffff;
      label.x = 100; label.y = 300;
      label.width = 280;
      this.addChild(label);
    }, this);
  }
}

(window as any).Main = Main;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => egret.runEgret({ renderMode: 'webgl' }));
} else {
  egret.runEgret({ renderMode: 'webgl' });
}


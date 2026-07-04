import { egret } from '@egret-r/core';
import '@egret-r/game';

class Main extends egret.DisplayObjectContainer {
  constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, () => {
      console.log('Main added to stage');
      const sky = new egret.Shape();
      sky.graphics.beginFill(0x87ceeb);
      sky.graphics.drawRect(0, 0, 480, 700);
      sky.graphics.endFill();
      this.addChild(sky);

      const label = new egret.TextField();
      label.text = 'Hello Egret!';
      label.size = 32;
      label.textColor = 0xffffff;
      label.x = 100; label.y = 300;
      this.addChild(label);
    }, this);
  }
}

(window as any).Main = Main;
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, container:', document.querySelector('.egret-player'));
  egret.runEgret({ renderMode: 'webgl' });
});


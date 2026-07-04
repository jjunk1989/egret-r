import { egret } from '@egret-r/core';
import '@egret-r/eui';
import '@egret-r/game';

class Main extends egret.DisplayObjectContainer {
  constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, () => {
      console.log('Main added to stage');
      const sky = new egret.Shape();
      sky.graphics.beginFill(0x0ea5e9);
      sky.graphics.drawRect(0, 0, 480, 700);
      sky.graphics.endFill();
      this.addChild(sky);

      const label = new egret.TextField();
      label.text = 'Hello Egret!';
      label.size = 32;
      label.textColor = 0x000000;
      label.x = 100; label.y = 300;
      label.width = 280;
      this.addChild(label);
    }, this);
  }
}

(window as any).Main = Main;
console.log('window.Main set:', !!(window as any).Main);
console.log('readyState:', document.readyState);
console.log('container:', document.querySelector('.egret-player'));

// Call directly — DOMContentLoaded may have already fired with type=module
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired, calling runEgret');
    egret.runEgret({ renderMode: 'webgl' });
  });
} else {
  console.log('calling runEgret directly');
  egret.runEgret({ renderMode: 'webgl' });
}


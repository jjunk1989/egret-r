import { egret } from '@egret-r/core';
import '@egret-r/eui';
import '@egret-r/game';

// DEBUG: Hook $doAddChild to trace stage.addChild
const _origDoAddChild = (egret.DisplayObjectContainer as any).prototype.$doAddChild;
(egret.DisplayObjectContainer as any).prototype.$doAddChild = function (child: any, index: number, notifyListeners = true) {
  console.log('$doAddChild called, self.$stage:', !!this.$stage, 'self.$nestLevel:', this.$nestLevel, 'child:', child?.constructor?.name);
  const result = _origDoAddChild.call(this, child, index, notifyListeners);
  console.log('$doAddChild DONE, child.$stage:', !!child.$stage);
  console.log('  EVENT_ADD_TO_STAGE_LIST length:', (egret.DisplayObjectContainer as any).$EVENT_ADD_TO_STAGE_LIST?.length);
  return result;
};

// DEBUG: Hook $onAddToStage
const _origOnAddToStage = (egret.DisplayObject as any).prototype.$onAddToStage;
(egret.DisplayObject as any).prototype.$onAddToStage = function (stage: any, nestLevel: number) {
  console.log('$onAddToStage called, stage:', !!stage, 'nestLevel:', nestLevel);
  _origOnAddToStage.call(this, stage, nestLevel);
  console.log('  after push, EVENT_ADD_TO_STAGE_LIST length:', (egret.DisplayObjectContainer as any).$EVENT_ADD_TO_STAGE_LIST?.length);
};

// DEBUG: Override $error to see ALL errors
const _origError = (egret as any).$error;
(egret as any).$error = function (code: number, ...args: any[]) {
  console.error('!!! $error called:', code, ...args);
  return _origError.apply(this, [code, ...args]);
};

console.log('egret.Event.ADDED_TO_STAGE:', egret.Event.ADDED_TO_STAGE);
console.log('egret.Event === (egret as any).Event:', egret.Event === (egret as any).Event);

class Main extends egret.DisplayObjectContainer {
  constructor() {
    super();
    console.log('Main() constructor called');

    // DEBUG: Hook dispatchEventWith on this instance
    const _origDispatch = (this as any).dispatchEventWith;
    (this as any).dispatchEventWith = function(type: string, bubbles?: boolean, data?: any) {
      console.log('dispatchEventWith called on Main, type:', type, 'bubbles:', bubbles);
      return _origDispatch.call(this, type, bubbles, data);
    };

    console.log('  instanceof DisplayObject:', this instanceof egret.DisplayObject);
    console.log('  instanceof DisplayObjectContainer:', this instanceof egret.DisplayObjectContainer);
    console.log('  DisplayObject:', egret.DisplayObject);
    console.log('  proto chain:', Object.getPrototypeOf(Object.getPrototypeOf(this))?.constructor?.name);
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

    this.once(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
  }
  private onAddedToStage(): void {
    console.log('Main onAddedToStage() called');
  }
}

(window as any).Main = Main;
console.log('window.Main set:', !!(window as any).Main);
console.log('window[\"Main\"]:', (window as any)['Main']);
console.log('egret.getDefinitionByName:', typeof (egret as any).getDefinitionByName);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired, calling runEgret');
    egret.runEgret({ renderMode: 'webgl' });
  });
} else {
  console.log('calling runEgret directly');
  egret.runEgret({ renderMode: 'webgl' });
}


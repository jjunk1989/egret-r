/**
 * Egret Engine R - Vite Game Template
 * Correct startup path: bind DOM container -> egret.runEgret -> entry class added to Stage.
 */
import { egret } from '@egret-r/core';
import '@egret-r/eui';
class Main extends egret.DisplayObjectContainer {
    constructor() {
        super();
        this.once(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
    }
    onAddedToStage() {
        const stage = this.stage;
        stage.frameRate = 60;
        const W = stage.stageWidth;
        const H = stage.stageHeight;
        const bg = new egret.Shape();
        bg.graphics.beginFill(0xffffff);
        bg.graphics.drawRect(W / 4, H / 4, W / 2, H / 2);
        bg.graphics.endFill();
        this.addChild(bg);
        const uiGroup = new eui.Group();
        uiGroup.x = 24;
        uiGroup.y = 24;
        this.addChild(uiGroup);
        const uiTitle = new eui.Label();
        uiTitle.text = 'EUI Demo';
        uiTitle.size = 28;
        uiTitle.textColor = 0x1f2937;
        uiGroup.addChild(uiTitle);
        const uiDesc = new eui.Label();
        uiDesc.text = `Stage: ${W} x ${H}`;
        uiDesc.size = 18;
        uiDesc.textColor = 0x475569;
        uiDesc.y = 42;
        uiGroup.addChild(uiDesc);
        const uiHint = new eui.Label();
        uiHint.text = 'Loaded components: eui.Group + eui.Label';
        uiHint.size = 16;
        uiHint.textColor = 0x0f766e;
        uiHint.y = 74;
        uiGroup.addChild(uiHint);
        console.log('Egret Engine R demo started');
        console.log(`Stage: ${W}x${H}`);
        console.log('EUI demo loaded: Group + Label');
    }
}
window.Main = Main;
window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('game-container');
    if (!container) {
        console.error('Missing #game-container');
        return;
    }
    container.classList.add('egret-player');
    container.setAttribute('data-entry-class', 'Main');
    container.setAttribute('data-scale-mode', egret.StageScaleMode.NO_SCALE);
    container.setAttribute('data-frame-rate', '60');
    container.setAttribute('data-content-width', String(container.clientWidth || window.innerWidth));
    container.setAttribute('data-content-height', String(container.clientHeight || window.innerHeight));
    container.setAttribute('data-multi-fingered', '2');
    container.setAttribute('data-show-fps', 'false');
    container.setAttribute('data-show-log', 'false');
    egret.runEgret({
        renderMode: 'webgl',
        // showFPS: true,
        // showLog: true,
        // maxTouches: 0, // Disable unnecessary input handling
    });
});

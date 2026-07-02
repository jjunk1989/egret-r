import { egret } from '@egret-r/core';
import { egret as tweenEgret } from '@egret-r/tween';
import { egret as gameEgret } from '@egret-r/game';
const g = globalThis;
g.egret = Object.assign(egret, tweenEgret, gameEgret);
g.EventDispatcher = egret.EventDispatcher;
if (typeof window !== 'undefined') {
    window.egret = g.egret;
}

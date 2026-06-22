import { egret } from '@egret-r/core';
const g = globalThis;
g.egret = egret;
g.EventDispatcher = egret.EventDispatcher;
if (typeof window !== 'undefined') {
    window.egret = egret;
}

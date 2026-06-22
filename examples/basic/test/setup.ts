import { egret } from '@egret-r/core';

const g = globalThis as unknown as Record<string, unknown>;

g.egret = egret;
g.EventDispatcher = egret.EventDispatcher;

if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).egret = egret;
}

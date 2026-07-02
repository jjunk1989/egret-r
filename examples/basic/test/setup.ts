import { egret } from '@egret-r/core';
import { egret as tweenEgret } from '@egret-r/tween';
import { egret as gameEgret } from '@egret-r/game';
import { egret as socketEgret } from '@egret-r/socket';

const g = globalThis as unknown as Record<string, unknown>;

g.egret = Object.assign(egret, tweenEgret, gameEgret, socketEgret);
g.EventDispatcher = egret.EventDispatcher;

if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).egret = g.egret;
}

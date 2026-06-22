import { describe, expect, it } from 'vitest';
import { egret } from '@egret-r/core';
describe.skip('game module', () => {
    it('URLVariables should decode key-value pairs', async () => {
        await import('@egret-r/game');
        const vars = new egret.URLVariables('name=egret&mode=debug');
        const parsed = vars.variables;
        expect(parsed.name).toBe('egret');
        expect(parsed.mode).toBe('debug');
    });
    it('URLVariables should collect duplicated keys into arrays', async () => {
        await import('@egret-r/game');
        const vars = new egret.URLVariables('feature=core&feature=eui&feature=tween');
        const parsed = vars.variables;
        expect(Array.isArray(parsed.feature)).toBe(true);
        expect(parsed.feature).toEqual(['core', 'eui', 'tween']);
    });
});

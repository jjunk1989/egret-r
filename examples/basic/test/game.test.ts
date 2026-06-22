import { describe, expect, it } from 'vitest';
import { egret } from '@egret-r/core';

describe('game module', () => {
  it('URLVariables should decode key-value pairs', async () => {
    await import('@egret-r/game');
    expect((egret as any).URLVariables).toBeTruthy();
    const vars = new egret.URLVariables('name=egret&mode=debug');
    const parsed = vars.variables as Record<string, string>;

    expect(parsed.name).toBe('egret');
    expect(parsed.mode).toBe('debug');
  });

  it('URLVariables should collect duplicated keys into arrays', async () => {
    await import('@egret-r/game');
    expect((egret as any).URLVariables).toBeTruthy();
    const vars = new egret.URLVariables('feature=core&feature=eui&feature=tween');
    const parsed = vars.variables as Record<string, string | string[]>;

    expect(Array.isArray(parsed.feature)).toBe(true);
    expect(parsed.feature).toEqual(['core', 'eui', 'tween']);
  });
});

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

  it('URLVariables decode should convert plus signs to spaces', async () => {
    await import('@egret-r/game');
    const vars = new egret.URLVariables();
    vars.decode('title=hello+egret+world');
    const parsed = vars.variables as Record<string, string>;

    expect(parsed.title).toBe('hello egret world');
  });

  it('URLVariables toString should contain encoded key-value pairs', async () => {
    await import('@egret-r/game');
    const vars = new egret.URLVariables('name=egret r&mode=unit test');
    const encoded = vars.toString();

    expect(encoded).toContain('name=egret%20r');
    expect(encoded).toContain('mode=unit%20test');
  });
});

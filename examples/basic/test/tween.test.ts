import { describe, expect, it } from 'vitest';

describe('tween module', () => {
  it('Ease.getPowIn should follow power curve', async () => {
    await import('@egret-r/tween');
    const Ease = (globalThis as any).egret?.Ease;
    expect(Ease).toBeTruthy();
    const fn = Ease.getPowIn(2);
    expect(fn(0)).toBe(0);
    expect(fn(0.5)).toBeCloseTo(0.25, 6);
    expect(fn(1)).toBe(1);
  });

  it('Ease.getPowOut should return eased-out values', async () => {
    await import('@egret-r/tween');
    const Ease = (globalThis as any).egret?.Ease;
    expect(Ease).toBeTruthy();
    const fn = Ease.getPowOut(2);
    expect(fn(0)).toBe(0);
    expect(fn(0.5)).toBeCloseTo(0.75, 6);
    expect(fn(1)).toBe(1);
  });

  it('Ease.quadInOut should be symmetric around 0.5', async () => {
    await import('@egret-r/tween');
    const Ease = (globalThis as any).egret?.Ease;
    expect(Ease).toBeTruthy();
    expect(Ease.quadInOut(0.25)).toBeCloseTo(0.125, 6);
    expect(Ease.quadInOut(0.5)).toBeCloseTo(0.5, 6);
    expect(Ease.quadInOut(0.75)).toBeCloseTo(0.875, 6);
  });

  it('Ease.get should clamp amount into [-1, 1]', async () => {
    await import('@egret-r/tween');
    const Ease = (globalThis as any).egret?.Ease;
    expect(Ease).toBeTruthy();

    const over = Ease.get(2);
    const under = Ease.get(-2);
    expect(over(0.5)).toBeCloseTo(0.75, 6);
    expect(under(0.5)).toBeCloseTo(0.25, 6);
  });

  it('Ease.sineInOut and Ease.bounceOut should keep endpoint invariants', async () => {
    await import('@egret-r/tween');
    const Ease = (globalThis as any).egret?.Ease;
    expect(Ease).toBeTruthy();

    expect(Ease.sineInOut(0)).toBeCloseTo(0, 6);
    expect(Ease.sineInOut(1)).toBeCloseTo(1, 6);
    expect(Ease.bounceOut(0)).toBeCloseTo(0, 6);
    expect(Ease.bounceOut(1)).toBeCloseTo(1, 6);
  });
});

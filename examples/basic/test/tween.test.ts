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

describe('Tween engine', () => {
  it('Tween.get should create a Tween instance for a target', async () => {
    await import('@egret-r/tween');
    const Tween = (globalThis as any).egret?.Tween;
    expect(Tween).toBeTruthy();

    const target = { x: 0, y: 0 };
    const tween = Tween.get(target);
    expect(tween).toBeTruthy();
    expect(typeof tween.to).toBe('function');
    expect(typeof tween.call).toBe('function');
  });

  it('Tween.to should configure property animation', async () => {
    await import('@egret-r/tween');
    const Tween = (globalThis as any).egret?.Tween;
    const target = { x: 0 };
    const tween = Tween.get(target);
    tween.to({ x: 100 }, 500);
    // tween should be chainable
    expect(tween).toBeTruthy();
  });

  it('Tween.removeTweens should clean up tweens on a target', async () => {
    await import('@egret-r/tween');
    const Tween = (globalThis as any).egret?.Tween;
    const target = { x: 0 };
    Tween.get(target).to({ x: 100 }, 1000);
    expect(target.tween_count).toBe(1);
    Tween.removeTweens(target);
    expect(target.tween_count).toBe(0);
  });

  it('Tween.pauseTweens and resumeTweens should control playback', async () => {
    await import('@egret-r/tween');
    const Tween = (globalThis as any).egret?.Tween;
    const target = { x: 0 };
    Tween.get(target).to({ x: 100 }, 1000);
    Tween.pauseTweens(target);
    // No crash is the main assertion here
    expect(target.tween_count).toBe(1);
    Tween.resumeTweens(target);
    Tween.removeTweens(target);
    expect(target.tween_count).toBe(0);
  });
});

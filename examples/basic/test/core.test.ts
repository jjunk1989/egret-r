import { describe, expect, it } from 'vitest';
import { egret } from '@egret-r/core';

describe('core module', () => {
  it('Point.distance should return expected Euclidean distance', () => {
    const p1 = new egret.Point(0, 0);
    const p2 = new egret.Point(3, 4);
    expect(egret.Point.distance(p1, p2)).toBe(5);
  });

  it('Rectangle.contains should match point-in-rect behavior', () => {
    const rect = new egret.Rectangle(10, 20, 100, 80);
    expect(rect.contains(15, 30)).toBe(true);
    expect(rect.contains(500, 300)).toBe(false);
  });

  it('Point helpers should keep coordinate math consistent', () => {
    const base = new egret.Point(1, 2);
    const add = base.add(new egret.Point(4, 5));
    const sub = add.subtract(new egret.Point(1, 1));
    expect(add.equals(new egret.Point(5, 7))).toBe(true);
    expect(sub.equals(new egret.Point(4, 6))).toBe(true);
  });

  it('Point.interpolate and normalize should preserve expected geometry', () => {
    const p1 = new egret.Point(10, 0);
    const p2 = new egret.Point(0, 10);

    const nearP1 = egret.Point.interpolate(p1, p2, 1);
    const nearP2 = egret.Point.interpolate(p1, p2, 0);
    expect(nearP1.equals(p1)).toBe(true);
    expect(nearP2.equals(p2)).toBe(true);

    const n = new egret.Point(3, 4);
    n.normalize(10);
    expect(n.length).toBeCloseTo(10, 6);
  });

  it('Rectangle.intersection and union should return consistent bounds', () => {
    const a = new egret.Rectangle(0, 0, 100, 100);
    const b = new egret.Rectangle(50, 40, 100, 60);

    const inter = a.intersection(b);
    expect(inter.x).toBe(50);
    expect(inter.y).toBe(40);
    expect(inter.width).toBe(50);
    expect(inter.height).toBe(60);

    const uni = a.union(b);
    expect(uni.x).toBe(0);
    expect(uni.y).toBe(0);
    expect(uni.width).toBe(150);
    expect(uni.height).toBe(100);
  });
});

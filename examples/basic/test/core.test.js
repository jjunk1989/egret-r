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
});

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
describe('EventDispatcher', () => {
    it('should dispatch events to registered listeners', () => {
        const dispatcher = new egret.EventDispatcher();
        let received = null;
        dispatcher.addEventListener('test', (e) => { received = e; }, dispatcher);
        const event = new egret.Event('test');
        dispatcher.dispatchEvent(event);
        expect(received).toBe(event);
    });
    it('should not deliver events after removeEventListener', () => {
        const dispatcher = new egret.EventDispatcher();
        let count = 0;
        const handler = () => { count++; };
        dispatcher.addEventListener('test', handler, dispatcher);
        dispatcher.removeEventListener('test', handler, dispatcher);
        dispatcher.dispatchEvent(new egret.Event('test'));
        expect(count).toBe(0);
    });
    it('should dispatch once event only once', () => {
        const dispatcher = new egret.EventDispatcher();
        let count = 0;
        dispatcher.once('test', () => { count++; }, dispatcher);
        dispatcher.dispatchEvent(new egret.Event('test'));
        dispatcher.dispatchEvent(new egret.Event('test'));
        expect(count).toBe(1);
    });
    it('should support multiple listeners for the same event', () => {
        const dispatcher = new egret.EventDispatcher();
        let a = 0, b = 0;
        dispatcher.addEventListener('test', () => { a++; }, dispatcher);
        dispatcher.addEventListener('test', () => { b++; }, dispatcher);
        dispatcher.dispatchEvent(new egret.Event('test'));
        expect(a).toBe(1);
        expect(b).toBe(1);
    });
});
describe('Matrix', () => {
    it('identity matrix should not transform a point', () => {
        const m = new egret.Matrix();
        const p = m.transformPoint(10, 20);
        expect(p.x).toBe(10);
        expect(p.y).toBe(20);
    });
    it('translate should shift coordinates', () => {
        const m = new egret.Matrix();
        m.translate(5, -3);
        const p = m.transformPoint(10, 20);
        expect(p.x).toBe(15);
        expect(p.y).toBe(17);
    });
    it('scale should multiply coordinates', () => {
        const m = new egret.Matrix();
        m.scale(2, 3);
        const p = m.transformPoint(4, 5);
        expect(p.x).toBe(8);
        expect(p.y).toBe(15);
    });
    it('rotate should apply rotation correctly', () => {
        const m = new egret.Matrix();
        m.rotate(Math.PI / 2); // 90 degrees
        const p = m.transformPoint(1, 0);
        expect(p.x).toBeCloseTo(0, 10);
        expect(p.y).toBeCloseTo(1, 10);
    });
    it('concat should combine transforms', () => {
        const m1 = new egret.Matrix();
        m1.translate(10, 0);
        const m2 = new egret.Matrix();
        m2.scale(2, 1);
        m1.concat(m2);
        const p = m1.transformPoint(5, 0);
        // Egret concat does pre-multiplication: translate first, then scale
        expect(p.x).toBe(30);
    });
    it('invert should reverse a transform', () => {
        const m = new egret.Matrix();
        m.translate(3, 4);
        m.invert();
        const p = m.transformPoint(7, 9);
        expect(p.x).toBe(4);
        expect(p.y).toBe(5);
    });
});
describe('Event', () => {
    it('should carry type and data', () => {
        const event = new egret.Event('custom');
        expect(event.type).toBe('custom');
        expect(event.bubbles).toBe(false);
    });
    it('should support bubbling', () => {
        const event = new egret.Event('custom', true);
        expect(event.bubbles).toBe(true);
    });
    it('Event.ADDED_TO_STAGE should be a constant string', () => {
        expect(egret.Event.ADDED_TO_STAGE).toBe('addedToStage');
    });
    it('Event.ENTER_FRAME should be a constant string', () => {
        expect(egret.Event.ENTER_FRAME).toBe('enterFrame');
    });
});
describe('DisplayObjectContainer', () => {
    it('should add and remove children', () => {
        const container = new egret.DisplayObjectContainer();
        expect(container.numChildren).toBe(0);
        const child1 = new egret.DisplayObject();
        const child2 = new egret.DisplayObject();
        container.addChild(child1);
        container.addChild(child2);
        expect(container.numChildren).toBe(2);
        expect(container.getChildAt(0)).toBe(child1);
        expect(container.getChildAt(1)).toBe(child2);
        container.removeChild(child1);
        expect(container.numChildren).toBe(1);
        expect(container.getChildAt(0)).toBe(child2);
    });
    it('should set parent on added child', () => {
        const container = new egret.DisplayObjectContainer();
        const child = new egret.DisplayObject();
        container.addChild(child);
        expect(child.parent).toBe(container);
    });
    it('should add child at specific index', () => {
        const container = new egret.DisplayObjectContainer();
        const a = new egret.DisplayObject();
        const b = new egret.DisplayObject();
        container.addChild(a);
        container.addChildAt(b, 0);
        expect(container.getChildAt(0)).toBe(b);
        expect(container.getChildAt(1)).toBe(a);
    });
    it('should swap children', () => {
        const container = new egret.DisplayObjectContainer();
        const a = new egret.DisplayObject();
        const b = new egret.DisplayObject();
        container.addChild(a);
        container.addChild(b);
        container.swapChildren(a, b);
        expect(container.getChildAt(0)).toBe(b);
        expect(container.getChildAt(1)).toBe(a);
    });
    it('should remove all children', () => {
        const container = new egret.DisplayObjectContainer();
        container.addChild(new egret.DisplayObject());
        container.addChild(new egret.DisplayObject());
        container.addChild(new egret.DisplayObject());
        expect(container.numChildren).toBe(3);
        container.removeChildren();
        expect(container.numChildren).toBe(0);
    });
});
describe('Timer', () => {
    it('should have correct initial state', () => {
        const timer = new egret.Timer(100, 5);
        expect(timer.delay).toBe(100);
        expect(timer.repeatCount).toBe(5);
        expect(timer.currentCount).toBe(0);
        expect(timer.running).toBe(false);
    });
    it('should start and stop', () => {
        const timer = new egret.Timer(100);
        timer.start();
        expect(timer.running).toBe(true);
        timer.stop();
        expect(timer.running).toBe(false);
    });
    it('should reset currentCount', () => {
        const timer = new egret.Timer(100, 3);
        timer.start();
        timer.reset();
        expect(timer.currentCount).toBe(0);
        timer.stop();
    });
    it('should dispatch TimerEvent.TIMER', (done) => {
        const timer = new egret.Timer(10, 1);
        timer.addEventListener(egret.TimerEvent.TIMER, () => {
            timer.stop();
            done();
        }, timer);
        timer.start();
    });
    it('should dispatch TimerEvent.TIMER_COMPLETE when repeatCount reached', (done) => {
        const timer = new egret.Timer(10, 2);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, () => {
            timer.stop();
            done();
        }, timer);
        timer.start();
    });
});
describe('ByteArray', () => {
    it('should write and read integers', () => {
        const ba = new egret.ByteArray();
        ba.writeInt(42);
        ba.position = 0;
        expect(ba.readInt()).toBe(42);
    });
    it('should write and read UTF strings', () => {
        const ba = new egret.ByteArray();
        ba.writeUTF('hello egret');
        ba.position = 0;
        expect(ba.readUTF()).toBe('hello egret');
    });
    it('should write and read bytes', () => {
        const ba = new egret.ByteArray();
        ba.writeByte(0x7f);
        ba.writeByte(0x42);
        ba.position = 0;
        expect(ba.readByte()).toBe(0x7f);
        expect(ba.readByte()).toBe(0x42);
    });
    it('should write and read booleans', () => {
        const ba = new egret.ByteArray();
        ba.writeBoolean(true);
        ba.writeBoolean(false);
        ba.position = 0;
        expect(ba.readBoolean()).toBe(true);
        expect(ba.readBoolean()).toBe(false);
    });
    it('should track length and bytesAvailable', () => {
        const ba = new egret.ByteArray();
        ba.writeInt(123);
        expect(ba.length).toBe(4);
        ba.position = 0;
        expect(ba.bytesAvailable).toBe(4);
        ba.position = 2;
        expect(ba.bytesAvailable).toBe(2);
    });
    it('should support endian switching', () => {
        const ba = new egret.ByteArray();
        expect(ba.endian).toBe(egret.Endian.BIG_ENDIAN);
        ba.endian = egret.Endian.LITTLE_ENDIAN;
        expect(ba.endian).toBe(egret.Endian.LITTLE_ENDIAN);
    });
});
describe('Texture and Bitmap', () => {
    it('Texture should be creatable with default properties', () => {
        const tex = new egret.Texture();
        expect(tex).toBeTruthy();
        expect(tex instanceof egret.HashObject).toBe(true);
    });
    it('Bitmap should accept an optional Texture', () => {
        const tex = new egret.Texture();
        const bmp = new egret.Bitmap(tex);
        expect(bmp.texture).toBe(tex);
    });
    it('Bitmap should have default DisplayObject properties', () => {
        const bmp = new egret.Bitmap();
        expect(bmp.x).toBe(0);
        expect(bmp.y).toBe(0);
        expect(bmp.width).toBe(0);
        expect(bmp.height).toBe(0);
        expect(bmp.visible).toBe(true);
        expect(bmp.alpha).toBe(1);
    });
    it('Bitmap fillMode should default to scale', () => {
        const bmp = new egret.Bitmap();
        expect(bmp.fillMode).toBe(egret.BitmapFillMode.SCALE);
        bmp.fillMode = egret.BitmapFillMode.CLIP;
        expect(bmp.fillMode).toBe(egret.BitmapFillMode.CLIP);
    });
    it('Texture should track $bitmapData reference', () => {
        const tex = new egret.Texture();
        const bd = new egret.BitmapData(64, 64);
        tex.$bitmapData = bd;
        expect(tex.$bitmapData).toBe(bd);
        expect(bd).toBeTruthy();
    });
});

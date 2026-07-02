import { describe, expect, it } from 'vitest';
describe('eui module', () => {
    it('ArrayCollection should expose source length and items', async () => {
        const { eui } = await import('@egret-r/eui');
        const collection = new eui.ArrayCollection([
            { label: 'A', value: 1 },
            { label: 'B', value: 2 },
        ]);
        expect(collection.length).toBe(2);
        expect(collection.getItemAt(0)).toEqual({ label: 'A', value: 1 });
        expect(collection.getItemAt(1)).toEqual({ label: 'B', value: 2 });
    });
    it('ArrayCollection source setter should reset length', async () => {
        const { eui } = await import('@egret-r/eui');
        const collection = new eui.ArrayCollection([{ id: 1 }]);
        collection.source = [{ id: 10 }, { id: 20 }, { id: 30 }];
        expect(collection.length).toBe(3);
        expect(collection.getItemAt(2)).toEqual({ id: 30 });
    });
    it('ArrayCollection add/replace/remove operations should update items correctly', async () => {
        const { eui } = await import('@egret-r/eui');
        const collection = new eui.ArrayCollection([{ id: 1 }, { id: 2 }]);
        collection.addItem({ id: 3 });
        expect(collection.length).toBe(3);
        expect(collection.getItemAt(2)).toEqual({ id: 3 });
        const old = collection.replaceItemAt({ id: 20 }, 1);
        expect(old).toEqual({ id: 2 });
        expect(collection.getItemAt(1)).toEqual({ id: 20 });
        const removed = collection.removeItemAt(0);
        expect(removed).toEqual({ id: 1 });
        expect(collection.length).toBe(2);
    });
    it('ArrayCollection getItemIndex and removeAll should work as expected', async () => {
        const { eui } = await import('@egret-r/eui');
        const target = { code: 'x2' };
        const collection = new eui.ArrayCollection([{ code: 'x1' }, target, { code: 'x3' }]);
        expect(collection.getItemIndex(target)).toBe(1);
        collection.removeAll();
        expect(collection.length).toBe(0);
    });
});
describe('EUI components', () => {
    it('Label should expose text and style properties', async () => {
        const { eui } = await import('@egret-r/eui');
        const label = new eui.Label();
        label.text = 'Hello EUI';
        label.size = 18;
        label.textColor = 0xff0000;
        expect(label.text).toBe('Hello EUI');
        expect(label.size).toBe(18);
        expect(label.textColor).toBe(0xff0000);
    });
    it('Label should support multiline with lineSpacing', async () => {
        const { eui } = await import('@egret-r/eui');
        const label = new eui.Label();
        label.lineSpacing = 6;
        label.textAlign = 'center';
        expect(label.lineSpacing).toBe(6);
        expect(label.textAlign).toBe('center');
    });
    it('Button should expose label and enabled', async () => {
        const { eui } = await import('@egret-r/eui');
        const button = new eui.Button();
        button.label = 'Click me';
        button.enabled = false;
        expect(button.label).toBe('Click me');
        expect(button.enabled).toBe(false);
    });
    it('CheckBox should toggle selected state', async () => {
        const { eui } = await import('@egret-r/eui');
        const checkbox = new eui.CheckBox();
        checkbox.selected = true;
        expect(checkbox.selected).toBe(true);
        checkbox.selected = false;
        expect(checkbox.selected).toBe(false);
    });
    it('Group should hold children', async () => {
        const { eui } = await import('@egret-r/eui');
        const group = new eui.Group();
        const child = new eui.Label();
        group.addChild(child);
        expect(group.numChildren).toBe(1);
    });
});

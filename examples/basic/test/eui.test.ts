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

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
});

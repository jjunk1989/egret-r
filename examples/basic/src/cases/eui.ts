import type { TestCaseDefinition } from './types';
import { egret } from '@egret-r/core';
import { eui } from '@egret-r/eui';
import { createButton, createToggleButton, createCheckBox, createRadioButton } from '../theme';

export const euiCases: TestCaseDefinition[] = [
  {
    id: 'eui-collection',
    title: 'EUI Group + ArrayCollection',
    module: 'eui',
    run: ({ root }) => {
      const group = new eui.Group();
      group.x = 40;
      group.y = 112;
      root.addChild(group);

      const title = new eui.Label();
      title.size = 22;
      title.textColor = 0x1e293b;
      title.text = 'EUI ArrayCollection Test';
      group.addChild(title);

      const data = new eui.ArrayCollection([
        { name: 'alpha', value: 1 },
        { name: 'beta', value: 2 },
        { name: 'gamma', value: 3 },
      ]);

      const detail = new eui.Label();
      detail.y = 40;
      detail.size = 18;
      detail.textColor = 0x475569;
      detail.lineSpacing = 8;
      detail.text = [
        `collection.length = ${data.length}`,
        `getItemAt(0).name = ${data.getItemAt(0).name}`,
        `getItemAt(2).value = ${data.getItemAt(2).value}`,
      ].join('\n');
      group.addChild(detail);
    },
  },
  {
    id: 'eui-button',
    title: 'EUI Button Interaction',
    module: 'eui',
    run: ({ root }) => {
      const objects: egret.DisplayObject[] = [];
      let clickCount = 0;

      const title = new eui.Label();
      title.x = 32; title.y = 102;
      title.size = 18; title.textColor = 0x0f172a;
      title.text = 'Button click test';
      root.addChild(title); objects.push(title);

      const counter = new eui.Label();
      counter.x = 32; counter.y = 134;
      counter.size = 16; counter.textColor = 0x2563eb;
      counter.text = 'Clicks: 0';
      root.addChild(counter); objects.push(counter);

      const btn = createButton('Click Me');
      btn.x = 32; btn.y = 170;
      btn.width = 140; btn.height = 44;
      root.addChild(btn); objects.push(btn);

      btn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        clickCount++;
        counter.text = `Clicks: ${clickCount}`;
      }, root);

      const disabledBtn = createButton('Disabled');
      disabledBtn.enabled = false;
      disabledBtn.x = 190; disabledBtn.y = 170;
      disabledBtn.width = 120; disabledBtn.height = 44;
      root.addChild(disabledBtn); objects.push(disabledBtn);

      const toggleBtn = createToggleButton('Toggle');
      toggleBtn.x = 32; toggleBtn.y = 230;
      toggleBtn.width = 140; toggleBtn.height = 44;
      root.addChild(toggleBtn); objects.push(toggleBtn);

      const toggleLabel = new eui.Label();
      toggleLabel.x = 190; toggleLabel.y = 240;
      toggleLabel.size = 16; toggleLabel.textColor = 0x7c3aed;
      toggleLabel.text = 'State: OFF';
      root.addChild(toggleLabel); objects.push(toggleLabel);

      toggleBtn.addEventListener(egret.Event.CHANGE, () => {
        toggleLabel.text = `State: ${toggleBtn.selected ? 'ON' : 'OFF'}`;
      }, root);

      return () => objects.forEach((o) => root.removeChild(o));
    },
  },
  {
    id: 'eui-checkbox-radio',
    title: 'EUI CheckBox + RadioButton',
    module: 'eui',
    run: ({ root }) => {
      const objects: egret.DisplayObject[] = [];

      const title = new eui.Label();
      title.x = 32; title.y = 102;
      title.size = 18; title.textColor = 0x0f172a;
      title.text = 'CheckBox & RadioButton';
      root.addChild(title); objects.push(title);

      const status = new eui.Label();
      status.x = 32; status.y = 134;
      status.size = 16; status.textColor = 0x475569;
      status.text = 'Check: unchecked';
      root.addChild(status); objects.push(status);

      const cb = createCheckBox('Agree to terms');
      cb.x = 32; cb.y = 165;
      root.addChild(cb); objects.push(cb);

      cb.addEventListener(egret.Event.CHANGE, () => {
        status.text = `Check: ${cb.selected ? 'checked' : 'unchecked'}`;
      }, root);

      // Radio group
      const group = new eui.RadioButtonGroup();
      const rbLabel = new eui.Label();
      rbLabel.x = 32; rbLabel.y = 205;
      rbLabel.size = 16; rbLabel.textColor = 0x7c3aed;
      rbLabel.text = 'Selected: none';
      root.addChild(rbLabel); objects.push(rbLabel);

      ['Option A', 'Option B', 'Option C'].forEach((opt, i) => {
        const rb = createRadioButton(opt);
        rb.value = opt;
        rb.group = group;
        rb.x = 32 + i * 130;
        rb.y = 235;
        root.addChild(rb); objects.push(rb);
      });

      group.addEventListener(egret.Event.CHANGE, () => {
        rbLabel.text = `Selected: ${group.selectedValue || 'none'}`;
      }, root);

      return () => objects.forEach((o) => root.removeChild(o));
    },
  },
  {
    id: 'eui-list',
    title: 'EUI List + Scroller with Data',
    module: 'eui',
    run: ({ root, stage }) => {
      const objects: egret.DisplayObject[] = [];

      const title = new eui.Label();
      title.x = 32; title.y = 112;
      title.size = 20; title.textColor = 0x0f172a;
      title.text = 'EUI List: Scroller with 12 items';
      root.addChild(title); objects.push(title);

      // Data
      const colors = ['#2563eb', '#dc2626', '#7c3aed', '#059669', '#f59e0b', '#0ea5e9',
        '#d946ef', '#84cc16', '#f97316', '#14b8a6', '#6366f1', '#ec4899'];
      const dataArr = colors.map((c, i) => ({
        label: `Item ${i + 1}`,
        color: parseInt(c.replace('#', ''), 16),
      }));

      const collection = new eui.ArrayCollection(dataArr);

      // ItemRenderer
      class ItemRenderer extends eui.ItemRenderer {
        public labelDisplay!: eui.Label;
        public colorBox!: egret.Shape;
        constructor() {
          super();
          this.skinName = undefined;
        }
        protected createChildren(): void {
          super.createChildren();
          this.width = 260; this.height = 40;

          const bg = new egret.Shape();
          bg.graphics.beginFill(0xf8fafc);
          bg.graphics.drawRoundRect(0, 0, 260, 38, 6, 6);
          bg.graphics.endFill();
          this.addChild(bg);

          const box = new egret.Shape();
          box.x = 8; box.y = 9;
          this.colorBox = box;
          this.addChild(box);

          const label = new eui.Label();
          label.x = 36; label.y = 7;
          label.size = 16; label.textColor = 0x1e293b;
          this.labelDisplay = label;
          this.addChild(label);
        }
        protected dataChanged(): void {
          if (this.data) {
            this.labelDisplay.text = this.data.label;
            const g = this.colorBox.graphics;
            g.clear();
            g.beginFill(this.data.color);
            g.drawRoundRect(0, 0, 20, 20, 4, 4);
            g.endFill();
          }
        }
      }

      const list = new eui.List();
      list.x = 32; list.y = 155;
      list.width = 280; list.height = 260;
      list.itemRenderer = ItemRenderer;
      list.dataProvider = collection;
      root.addChild(list);
      objects.push(list);

      const info = new eui.Label();
      info.x = 32; info.y = 430;
      info.size = 13; info.textColor = 0x6b7280;
      info.text = `Scroller list with ${dataArr.length} colored items`;
      root.addChild(info); objects.push(info);

      return () => objects.forEach((o) => root.removeChild(o));
    },
  },
];

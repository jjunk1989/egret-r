import type { TestCaseDefinition } from './types';
import { EUI } from './types';
const _E = (globalThis as any).eui;

export const euiCases: TestCaseDefinition[] = [
  {
    id: 'eui-collection',
    title: 'EUI Group + ArrayCollection',
    module: 'eui',
    run: ({ root }) => {
      const group = new _E.Group();
      group.x = 40;
      group.y = 112;
      root.addChild(group);

      const title = new _E.Label();
      title.size = 22;
      title.textColor = 0x1e293b;
      title.text = 'EUI ArrayCollection Test';
      group.addChild(title);

      const data = new _E.ArrayCollection([
        { name: 'alpha', value: 1 },
        { name: 'beta', value: 2 },
        { name: 'gamma', value: 3 },
      ]);

      const detail = new _E.Label();
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

      const title = new _E.Label();
      title.x = 32; title.y = 102;
      title.size = 18; title.textColor = 0x0f172a;
      title.text = 'Button click test';
      root.addChild(title); objects.push(title);

      const counter = new _E.Label();
      counter.x = 32; counter.y = 134;
      counter.size = 16; counter.textColor = 0x2563eb;
      counter.text = 'Clicks: 0';
      root.addChild(counter); objects.push(counter);

      const btn = new _E.Button();
      btn.label = 'Click Me';
      btn.x = 32; btn.y = 170;
      btn.width = 140; btn.height = 44;
      root.addChild(btn); objects.push(btn);

      btn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        clickCount++;
        counter.text = `Clicks: ${clickCount}`;
      }, root);

      const disabledBtn = new _E.Button();
      disabledBtn.label = 'Disabled';
      disabledBtn.enabled = false;
      disabledBtn.x = 190; disabledBtn.y = 170;
      disabledBtn.width = 120; disabledBtn.height = 44;
      root.addChild(disabledBtn); objects.push(disabledBtn);

      const toggleBtn = new _E.ToggleButton();
      toggleBtn.label = 'Toggle';
      toggleBtn.x = 32; toggleBtn.y = 230;
      toggleBtn.width = 140; toggleBtn.height = 44;
      root.addChild(toggleBtn); objects.push(toggleBtn);

      const toggleLabel = new _E.Label();
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

      const title = new _E.Label();
      title.x = 32; title.y = 102;
      title.size = 18; title.textColor = 0x0f172a;
      title.text = 'CheckBox & RadioButton';
      root.addChild(title); objects.push(title);

      const status = new _E.Label();
      status.x = 32; status.y = 134;
      status.size = 16; status.textColor = 0x475569;
      status.text = 'Check: unchecked';
      root.addChild(status); objects.push(status);

      const cb = new _E.CheckBox();
      cb.label = 'Agree to terms';
      cb.x = 32; cb.y = 165;
      root.addChild(cb); objects.push(cb);

      cb.addEventListener(egret.Event.CHANGE, () => {
        status.text = `Check: ${cb.selected ? 'checked' : 'unchecked'}`;
      }, root);

      // Radio group
      const group = new _E.RadioButtonGroup();
      const rbLabel = new _E.Label();
      rbLabel.x = 32; rbLabel.y = 205;
      rbLabel.size = 16; rbLabel.textColor = 0x7c3aed;
      rbLabel.text = 'Selected: none';
      root.addChild(rbLabel); objects.push(rbLabel);

      ['Option A', 'Option B', 'Option C'].forEach((opt, i) => {
        const rb = new _E.RadioButton();
        rb.label = opt;
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
];

/**
 * Default EUI Theme — Factory-based skin approach.
 * Skin children in $elementsContent are added to the component.
 */
import { egret } from '@egret-r/core';
import { eui } from '@egret-r/eui';

// ---------------------------------------------------------------------------
// ButtonSkin with visible background
// ---------------------------------------------------------------------------

class ButtonSkin extends eui.Skin {
  public labelDisplay: eui.Label;

  constructor() {
    super();
    this.minWidth = 60;
    this.minHeight = 32;

    // Background
    const bg = new egret.Shape();
    bg.graphics.beginFill(0x2563eb);
    bg.graphics.drawRoundRect(0, 0, 200, 50, 8, 8);
    bg.graphics.endFill();
    bg.width = 200;
    bg.height = 50;

    // Label — use explicit positioning, NOT textAlign/verticalAlign
    const label = new eui.Label();
    label.size = 14;
    label.textColor = 0xffffff;
    label.x = 8;
    label.y = 10;
    this.labelDisplay = label;

    this.$elementsContent = [bg, label];
    this.skinParts = ['labelDisplay'];
  }
}

// ---------------------------------------------------------------------------
// ToggleButtonSkin
// ---------------------------------------------------------------------------

class ToggleButtonSkin extends eui.Skin {
  public labelDisplay: eui.Label;

  constructor() {
    super();
    this.minWidth = 60;
    this.minHeight = 32;

    const bg = new egret.Shape();
    bg.graphics.beginFill(0x6b7280);
    bg.graphics.drawRoundRect(0, 0, 200, 50, 8, 8);
    bg.graphics.endFill();
    bg.width = 200;
    bg.height = 50;

    const label = new eui.Label();
    label.size = 14;
    label.textColor = 0xffffff;
    label.x = 8;
    label.y = 10;
    this.labelDisplay = label;

    this.$elementsContent = [bg, label];
    this.skinParts = ['labelDisplay'];
  }
}

// ---------------------------------------------------------------------------
// CheckBoxSkin — visible checkbox box + label
// ---------------------------------------------------------------------------

class CheckBoxSkin extends eui.Skin {
  public labelDisplay: eui.Label;

  constructor() {
    super();
    this.minWidth = 140;
    this.minHeight = 24;

    // Checkbox outer border
    const boxBorder = new egret.Shape();
    boxBorder.graphics.lineStyle(2, 0x9ca3af);
    boxBorder.graphics.drawRoundRect(0, 2, 18, 18, 3, 3);
    boxBorder.graphics.endFill();
    boxBorder.width = 20;
    boxBorder.height = 22;

    // Checkbox fill background (white)
    const boxBg = new egret.Shape();
    boxBg.graphics.beginFill(0xffffff);
    boxBg.graphics.drawRoundRect(1, 3, 16, 16, 2, 2);
    boxBg.graphics.endFill();
    boxBg.width = 20;
    boxBg.height = 22;

    // Check mark (shown when selected)
    const checkMark = new egret.Shape();
    checkMark.graphics.beginFill(0x2563eb);
    checkMark.graphics.drawRoundRect(4, 6, 10, 10, 2, 2);
    checkMark.graphics.endFill();
    checkMark.width = 18;
    checkMark.height = 20;
    checkMark.name = 'checkMark';
    checkMark.alpha = 0;

    // Label
    const label = new eui.Label();
    label.size = 14;
    label.textColor = 0x1f2937;
    label.x = 26;
    label.y = 4;
    this.labelDisplay = label;

    this.$elementsContent = [boxBg, boxBorder, checkMark, label];
    this.skinParts = ['labelDisplay'];
  }
}

// ---------------------------------------------------------------------------
// RadioButtonSkin — visible radio circle + label
// ---------------------------------------------------------------------------

class RadioButtonSkin extends eui.Skin {
  public labelDisplay: eui.Label;

  constructor() {
    super();
    this.minWidth = 140;
    this.minHeight = 24;

    // Outer circle border
    const outer = new egret.Shape();
    outer.graphics.lineStyle(2, 0x9ca3af);
    outer.graphics.drawCircle(9, 11, 8);
    outer.graphics.endFill();
    outer.width = 20;
    outer.height = 24;

    // Inner dot (alpha=0 when unselected, alpha=1 when selected)
    const inner = new egret.Shape();
    inner.graphics.beginFill(0x2563eb);
    inner.graphics.drawCircle(9, 11, 5);
    inner.graphics.endFill();
    inner.width = 20;
    inner.height = 24;
    inner.name = 'innerDot';
    inner.alpha = 0;

    // Label
    const label = new eui.Label();
    label.size = 14;
    label.textColor = 0x1f2937;
    label.x = 24;
    label.y = 4;
    this.labelDisplay = label;

    this.$elementsContent = [outer, inner, label];
    this.skinParts = ['labelDisplay'];
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createButton(label?: string): eui.Button {
  const btn = new eui.Button();
  btn.skinName = ButtonSkin;
  if (label !== undefined) btn.label = label;
  return btn;
}

export function createToggleButton(label?: string): eui.ToggleButton {
  const btn = new eui.ToggleButton();
  btn.skinName = ToggleButtonSkin;
  if (label !== undefined) btn.label = label;
  const syncBg = () => {
    const skin = btn.skin as ToggleButtonSkin;
    if (skin && skin.$elementsContent && skin.$elementsContent[0]) {
      const bg = skin.$elementsContent[0] as egret.Shape;
      bg.graphics.clear();
      bg.graphics.beginFill(btn.selected ? 0x2563eb : 0x6b7280);
      bg.graphics.drawRoundRect(0, 0, 200, 50, 8, 8);
      bg.graphics.endFill();
      bg.$renderDirty = true;
    }
  };
  btn.addEventListener(egret.Event.COMPLETE, syncBg, btn);
  btn.addEventListener('propertyChange', (e: any) => {
    if (e.property === 'selected') syncBg();
  }, btn);
  return btn;
}

export function createCheckBox(label?: string): eui.CheckBox {
  const cb = new eui.CheckBox();
  cb.skinName = CheckBoxSkin;
  if (label !== undefined) cb.label = label;
  const syncCheck = () => {
    const skin = cb.skin as CheckBoxSkin;
    if (skin) {
      for (const el of skin.$elementsContent) {
        if (el.name === 'checkMark') { el.alpha = cb.selected ? 1 : 0; }
      }
    }
  };
  cb.addEventListener(egret.Event.COMPLETE, syncCheck, cb);
  cb.addEventListener('propertyChange', (e: any) => {
    if (e.property === 'selected') syncCheck();
  }, cb);
  return cb;
}

export function createRadioButton(label?: string): eui.RadioButton {
  const rb = new eui.RadioButton();
  rb.skinName = RadioButtonSkin;
  if (label !== undefined) rb.label = label;

  const syncDot = () => {
    const skin = rb.skin as RadioButtonSkin;
    if (skin) {
      for (const el of skin.$elementsContent) {
        if (el.name === 'innerDot') { el.alpha = rb.selected ? 1 : 0; }
      }
    }
  };

  // COMPLETE: skin attached, sync initial state
  rb.addEventListener(egret.Event.COMPLETE, syncDot, rb);

  // propertyChange: fires on EACH radio button when selected changes
  // (including deselection by group, unlike Event.CHANGE)
  rb.addEventListener('propertyChange', (e: any) => {
    if (e.property === 'selected') syncDot();
  }, rb);

  return rb;
}

// Theme registration (for any code using Theme system)
(globalThis as any).skins = {
  ButtonSkin, ToggleButtonSkin, CheckBoxSkin, RadioButtonSkin,
};

const THEME_CFG = {
  skins: {
    Button: 'skins.ButtonSkin',
    ToggleButton: 'skins.ToggleButtonSkin',
    CheckBox: 'skins.CheckBoxSkin',
    RadioButton: 'skins.RadioButtonSkin',
  },
};

class InlineThemeAdapter {
  getTheme(_url: string, done: Function, _fail: Function, ctx: any): void {
    done.call(ctx, THEME_CFG);
  }
}

export function setupDefaultTheme(stage: egret.Stage): void {
  egret.registerImplementation('IThemeAdapter', new InlineThemeAdapter());
  new eui.Theme('inline://default', stage);
}

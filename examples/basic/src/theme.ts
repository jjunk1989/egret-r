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
// CheckBoxSkin
// ---------------------------------------------------------------------------

class CheckBoxSkin extends eui.Skin {
  public labelDisplay: eui.Label;

  constructor() {
    super();
    this.minWidth = 24;
    this.minHeight = 24;

    const label = new eui.Label();
    label.size = 14;
    label.textColor = 0x1f2937;
    label.x = 4;
    label.y = 4;
    this.labelDisplay = label;

    this.$elementsContent = [label];
    this.skinParts = ['labelDisplay'];
  }
}

// ---------------------------------------------------------------------------
// RadioButtonSkin
// ---------------------------------------------------------------------------

class RadioButtonSkin extends eui.Skin {
  public labelDisplay: eui.Label;

  constructor() {
    super();
    this.minWidth = 24;
    this.minHeight = 24;

    const label = new eui.Label();
    label.size = 14;
    label.textColor = 0x1f2937;
    label.x = 4;
    label.y = 4;
    this.labelDisplay = label;

    this.$elementsContent = [label];
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
  return btn;
}

export function createCheckBox(label?: string): eui.CheckBox {
  const cb = new eui.CheckBox();
  cb.skinName = CheckBoxSkin;
  if (label !== undefined) cb.label = label;
  return cb;
}

export function createRadioButton(label?: string): eui.RadioButton {
  const rb = new eui.RadioButton();
  rb.skinName = RadioButtonSkin;
  if (label !== undefined) rb.label = label;
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

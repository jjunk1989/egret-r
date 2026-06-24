import { egret } from '@egret-r/core';

export type TestCaseContext = {
  root: egret.DisplayObjectContainer;
  stage: egret.Stage;
};

export type TestCaseDefinition = {
  id: string;
  title: string;
  module: 'core' | 'eui' | 'game' | 'tween' | 'socket';
  run: (ctx: TestCaseContext) => void | (() => void) | Promise<void | (() => void)>;
};

// Shared aliases accessible to all case files
export const EUI = (globalThis as any).eui as any;
export const EG = egret as any;

export function showCaseError(root: egret.DisplayObjectContainer, title: string, detail: string): void {
  const titleLabel = new EUI.Label();
  titleLabel.x = 40;
  titleLabel.y = 112;
  titleLabel.size = 22;
  titleLabel.textColor = 0xb91c1c;
  titleLabel.text = title;
  root.addChild(titleLabel);

  const detailLabel = new EUI.Label();
  detailLabel.x = 40;
  detailLabel.y = 148;
  detailLabel.size = 16;
  detailLabel.textColor = 0x7f1d1d;
  detailLabel.lineSpacing = 8;
  detailLabel.text = detail;
  root.addChild(detailLabel);
}

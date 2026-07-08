/**
 * Shared UI helpers for game examples
 */
import { egret } from '@egret-r/core';

/** Creates a centered "Start" button. Returns a function that resolves when clicked. */
export function createStartButton(
  parent: egret.DisplayObjectContainer,
  W: number, H: number,
  label: string = 'Start',
): { button: egret.DisplayObject; onClick: Promise<void> } {
  const container = new egret.DisplayObjectContainer();

  // Dim overlay
  const overlay = new egret.Shape();
  overlay.graphics.beginFill(0x000000, 0.35);
  overlay.graphics.drawRect(0, 0, W, H);
  overlay.graphics.endFill();
  container.addChild(overlay);

  // Button background
  const btnBg = new egret.Shape();
  btnBg.graphics.beginFill(0x2563eb);
  btnBg.graphics.drawRoundRect(-60, -22, 120, 44, 12, 12);
  btnBg.graphics.endFill();
  btnBg.x = W / 2; btnBg.y = H / 2 + 40;
  container.addChild(btnBg);

  // Button text
  const btnText = new egret.TextField();
  btnText.text = label;
  btnText.size = 24; btnText.textColor = 0xffffff; btnText.bold = true;
  btnText.textAlign = egret.HorizontalAlign.CENTER;
  btnText.x = W / 2 - 60; btnText.y = H / 2 + 28; btnText.width = 120;
  container.addChild(btnText);

  // Title
  const title = new egret.TextField();
  title.text = label === 'Start' ? 'Tap to fly!' : label;
  title.size = 20; title.textColor = 0xffffff;
  title.strokeColor = 0x333333; title.stroke = 2;
  title.textAlign = egret.HorizontalAlign.CENTER;
  title.x = W / 2 - 120; title.y = H / 2 - 40; title.width = 240;
  container.addChild(title);

  parent.addChild(container);

  const onClick = new Promise<void>((resolve) => {
    const tapHandler = () => {
      parent.removeChild(container);
      resolve();
    };
    btnBg.touchEnabled = true;
    btnBg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, tapHandler, parent);
  });

  return { button: container, onClick };
}

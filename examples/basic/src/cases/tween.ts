import { egret } from '@egret-r/core';
import type { TestCaseDefinition } from './types';
import { EUI, EG, showCaseError } from './types';

export const tweenCases: TestCaseDefinition[] = [
  {
    id: 'tween-ease',
    title: 'Tween + Ease',
    module: 'tween',
    run: async ({ root, stage }) => {
      if (!EG.Tween || !EG.Ease) {
        try {
          await (0, eval)("import('@egret-r/tween')");
        } catch {
          showCaseError(
            root,
            'Tween module unavailable',
            'Failed to load @egret-r/tween at runtime.',
          );
          return;
        }
      }

      const target = new egret.Shape();
      target.graphics.beginFill(0xdc2626);
      target.graphics.drawRoundRect(0, 0, 72, 72, 12, 12);
      target.graphics.endFill();
      target.x = 44;
      target.y = Math.max(160, Math.floor(stage.stageHeight * 0.5));
      root.addChild(target);

      const label = new EUI.Label();
      label.x = 40;
      label.y = 116;
      label.size = 20;
      label.textColor = 0x111827;
      label.text = 'Tween case: loop + Ease.quadInOut';
      root.addChild(label);

      const endX = Math.max(80, stage.stageWidth - 120);
      EG.Tween.get(target, { loop: true })
        .to({ x: endX, rotation: 360 }, 1300, EG.Ease.quadInOut)
        .to({ x: 44, rotation: 0 }, 1300, EG.Ease.quadInOut);

      return () => {
        EG.Tween.removeTweens(target);
      };
    },
  },
  {
    id: 'tween-multi',
    title: 'Tween Multiple Parallel',
    module: 'tween',
    run: async ({ root, stage }) => {
      if (!EG.Tween || !EG.Ease) {
        try { await (0, eval)("import('@egret-r/tween')"); } catch { return; }
      }

      const objects: egret.DisplayObject[] = [];
      const cx = stage.stageWidth / 2;
      const colors = [0x2563eb, 0xdc2626, 0x7c3aed, 0x059669, 0xf59e0b];
      const targets: egret.Shape[] = [];

      for (let i = 0; i < 5; i++) {
        const sq = new egret.Shape();
        sq.graphics.beginFill(colors[i]);
        sq.graphics.drawRoundRect(0, 0, 36, 36, 6, 6);
        sq.graphics.endFill();
        sq.x = 40 + i * 60;
        sq.y = 160;
        sq.alpha = 0.6;
        root.addChild(sq); objects.push(sq);
        targets.push(sq);

        EG.Tween.get(sq, { loop: true })
          .to({ y: 280, alpha: 1, rotation: 180 }, 600 + i * 150, EG.Ease.quadInOut)
          .to({ y: 160, alpha: 0.6, rotation: 0 }, 600 + i * 150, EG.Ease.quadInOut);
      }

      const label = new EUI.Label();
      label.x = 32; label.y = 102;
      label.size = 18; label.textColor = 0x0f172a;
      label.text = '5 parallel bouncing squares · staggered timing';
      root.addChild(label); objects.push(label);

      return () => {
        targets.forEach((t) => EG.Tween.removeTweens(t));
        objects.forEach((o) => root.removeChild(o));
      };
    },
  },
];

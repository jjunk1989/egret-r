import { egret } from '@egret-r/core';
import type { TestCaseDefinition } from './types';
import { EUI } from './types';

export const coreCases: TestCaseDefinition[] = [
  {
    id: 'core-geom',
    title: 'Core Geometry + Display',
    module: 'core',
    run: ({ root, stage }) => {
      const panel = new egret.Shape();
      panel.graphics.beginFill(0xf8fafc);
      panel.graphics.drawRoundRect(24, 96, stage.stageWidth - 48, 180, 16, 16);
      panel.graphics.endFill();
      root.addChild(panel);

      const p1 = new egret.Point(0, 0);
      const p2 = new egret.Point(3, 4);
      const distance = egret.Point.distance(p1, p2);
      const rect = new egret.Rectangle(24, 96, 180, 120);
      const hit = rect.contains(100, 120);

      const label = new EUI.Label();
      label.x = 40;
      label.y = 120;
      label.size = 20;
      label.textColor = 0x0f172a;
      label.lineSpacing = 10;
      label.text = [
        'Core Case: Point + Rectangle',
        `distance((0,0),(3,4)) = ${distance}`,
        `rect.contains(100, 120) = ${hit}`,
      ].join('\n');
      root.addChild(label);
    },
  },
  {
    id: 'events-touch',
    title: 'Core Event + Touch',
    module: 'core',
    run: ({ root, stage }) => {
      let taps = 0;
      const bus = new egret.EventDispatcher();

      const tip = new EUI.Label();
      tip.x = 40;
      tip.y = 116;
      tip.size = 20;
      tip.textColor = 0x1f2937;
      tip.text = 'Tap the circle to dispatch custom event';
      root.addChild(tip);

      const countLabel = new EUI.Label();
      countLabel.x = 40;
      countLabel.y = 150;
      countLabel.size = 18;
      countLabel.textColor = 0x0f766e;
      countLabel.text = 'Custom event count: 0';
      root.addChild(countLabel);

      const circle = new egret.Shape();
      circle.graphics.beginFill(0x2563eb);
      circle.graphics.drawCircle(0, 0, 44);
      circle.graphics.endFill();
      circle.x = Math.max(120, Math.floor(stage.stageWidth * 0.5));
      circle.y = Math.max(230, Math.floor(stage.stageHeight * 0.5));
      circle.touchEnabled = true;
      root.addChild(circle);

      const onTick = () => {
        taps += 1;
        countLabel.text = `Custom event count: ${taps}`;
      };
      bus.addEventListener('demo:tick', onTick, root);

      const onTap = () => {
        bus.dispatchEventWith('demo:tick');
      };
      circle.addEventListener(egret.TouchEvent.TOUCH_TAP, onTap, root);

      return () => {
        bus.removeEventListener('demo:tick', onTick, root);
        circle.removeEventListener(egret.TouchEvent.TOUCH_TAP, onTap, root);
      };
    },
  },
  {
    id: 'core-graphics',
    title: 'Core Graphics Drawing',
    module: 'core',
    run: ({ root, stage }) => {
      const w = stage.stageWidth;
      const shapes: egret.DisplayObject[] = [];

      // Filled rectangle
      const rect = new egret.Shape();
      rect.graphics.beginFill(0x2563eb);
      rect.graphics.drawRect(0, 0, 80, 60);
      rect.graphics.endFill();
      rect.x = 32; rect.y = 120;
      root.addChild(rect); shapes.push(rect);

      // Stroked circle
      const circle = new egret.Shape();
      circle.graphics.lineStyle(3, 0xdc2626);
      circle.graphics.drawCircle(0, 0, 30);
      circle.graphics.endFill();
      circle.x = 155; circle.y = 150;
      root.addChild(circle); shapes.push(circle);

      // Rounded rect with gradient-like colors
      const rr = new egret.Shape();
      rr.graphics.beginFill(0x7c3aed);
      rr.graphics.drawRoundRect(0, 0, 80, 60, 14, 14);
      rr.graphics.endFill();
      rr.x = 210; rr.y = 120;
      root.addChild(rr); shapes.push(rr);

      // Lines
      const lines = new egret.Shape();
      lines.graphics.lineStyle(2, 0x059669);
      lines.graphics.moveTo(0, 0);
      lines.graphics.lineTo(60, 0);
      lines.graphics.lineTo(60, 40);
      lines.graphics.lineTo(0, 40);
      lines.graphics.lineTo(0, 0);
      lines.x = 320; lines.y = 130;
      root.addChild(lines); shapes.push(lines);

      // Arc / pie
      const arc = new egret.Shape();
      arc.graphics.beginFill(0xf59e0b);
      arc.graphics.moveTo(0, 0);
      arc.graphics.lineTo(40, 0);
      arc.graphics.drawArc(0, 0, 40, 0, Math.PI * 0.75);
      arc.graphics.lineTo(0, 0);
      arc.graphics.endFill();
      arc.x = 420; arc.y = 150;
      root.addChild(arc); shapes.push(arc);

      const label = new EUI.Label();
      label.x = 32; label.y = 102;
      label.size = 16;
      label.textColor = 0x475569;
      label.text = 'Rect · Circle · RoundRect · Lines · Arc';
      root.addChild(label); shapes.push(label);

      return () => shapes.forEach((s) => root.removeChild(s));
    },
  },
  {
    id: 'core-text',
    title: 'Core TextField Rendering',
    module: 'core',
    run: ({ root, stage }) => {
      const labels: egret.DisplayObject[] = [];
      const y0 = 112;

      // Multi-style text
      const title = new EUI.Label();
      title.x = 32; title.y = y0;
      title.size = 20; title.textColor = 0x0f172a;
      title.text = 'TextField with various styles';
      root.addChild(title); labels.push(title);

      const normal = new egret.TextField();
      normal.x = 32; normal.y = y0 + 34;
      normal.size = 18; normal.textColor = 0x1e293b;
      normal.text = 'Normal text — 你好世界';
      root.addChild(normal); labels.push(normal);

      const bold = new egret.TextField();
      bold.x = 32; bold.y = y0 + 64;
      bold.size = 22; bold.textColor = 0x2563eb;
      bold.bold = true;
      bold.text = 'Bold text — Hello World';
      root.addChild(bold); labels.push(bold);

      const italic = new egret.TextField();
      italic.x = 32; italic.y = y0 + 100;
      italic.size = 18; italic.textColor = 0xdc2626;
      italic.italic = true;
      italic.text = 'Italic text — Lorem ipsum';
      root.addChild(italic); labels.push(italic);

      const multiline = new egret.TextField();
      multiline.x = 32; multiline.y = y0 + 140;
      multiline.size = 16; multiline.textColor = 0x475569;
      multiline.multiline = true;
      multiline.width = Math.min(400, stage.stageWidth - 64);
      multiline.text = 'Multiline text: Line one\nLine two\nLine three — 多行文本测试';
      root.addChild(multiline); labels.push(multiline);

      return () => labels.forEach((l) => root.removeChild(l));
    },
  },
  {
    id: 'core-transform',
    title: 'Core Sprite + Transform',
    module: 'core',
    run: ({ root, stage }) => {
      const objects: egret.DisplayObject[] = [];
      const cx = stage.stageWidth / 2;
      const cy = stage.stageHeight / 2 + 30;

      // Parent container
      const container = new egret.DisplayObjectContainer();
      container.x = cx; container.y = cy;
      root.addChild(container); objects.push(container);

      // Rotated squares
      for (let i = 0; i < 4; i++) {
        const sq = new egret.Shape();
        sq.graphics.beginFill([0x2563eb, 0xdc2626, 0x7c3aed, 0x059669][i]);
        sq.graphics.drawRect(-20, -20, 40, 40);
        sq.graphics.endFill();
        sq.x = Math.cos((i * Math.PI) / 2) * 60;
        sq.y = Math.sin((i * Math.PI) / 2) * 60;
        sq.rotation = i * 30;
        sq.alpha = 0.8;
        container.addChild(sq);
        objects.push(sq);
      }

      // Center circle
      const center = new egret.Shape();
      center.graphics.beginFill(0xf59e0b);
      center.graphics.drawCircle(0, 0, 16);
      center.graphics.endFill();
      container.addChild(center); objects.push(center);

      const label = new EUI.Label();
      label.x = 32; label.y = 102;
      label.size = 16; label.textColor = 0x475569;
      label.text = '4 rotated squares around a center';
      root.addChild(label); objects.push(label);

      // Animate rotation
      const tick = () => { container.rotation += 0.5; return false; };
      egret.startTick(tick, root);

      return () => {
        egret.stopTick(tick, root);
        objects.forEach((o) => { try { root.removeChild(o); } catch (_) {} });
      };
    },
  },
];

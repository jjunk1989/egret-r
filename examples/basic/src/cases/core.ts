import { egret } from '@egret-r/core';
import { eui } from '@egret-r/eui';
import type { TestCaseDefinition } from './types';

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

      const label = new eui.Label();
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

      const tip = new eui.Label();
      tip.x = 40;
      tip.y = 116;
      tip.size = 20;
      tip.textColor = 0x1f2937;
      tip.text = 'Tap the circle to dispatch custom event';
      root.addChild(tip);

      const countLabel = new eui.Label();
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

      const label = new eui.Label();
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
      const title = new eui.Label();
      title.x = 32; title.y = y0;
      title.size = 20; title.textColor = 0x0f172a;
      title.text = 'TextField with various styles';
      root.addChild(title); labels.push(title);

      const normal = new egret.TextField();
      normal.x = 32; normal.y = y0 + 34;
      normal.size = 18; normal.textColor = 0x1e293b;
      normal.text = 'Normal text 你好世界';
      root.addChild(normal); labels.push(normal);

      const bold = new egret.TextField();
      bold.x = 32; bold.y = y0 + 64;
      bold.size = 22; bold.textColor = 0x2563eb;
      bold.bold = true;
      bold.text = 'Bold text Hello World';
      root.addChild(bold); labels.push(bold);

      const italic = new egret.TextField();
      italic.x = 32; italic.y = y0 + 100;
      italic.size = 18; italic.textColor = 0xdc2626;
      italic.italic = true;
      italic.text = 'Italic text Lorem ipsum';
      root.addChild(italic); labels.push(italic);

      const multiline = new egret.TextField();
      multiline.x = 32; multiline.y = y0 + 140;
      multiline.size = 16; multiline.textColor = 0x475569;
      multiline.multiline = true;
      multiline.width = Math.min(400, stage.stageWidth - 64);
      multiline.text = 'Multiline text: Line one\nLine two\nLine three 多行文本测试';
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

      const label = new eui.Label();
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
  {
    id: 'core-benchmark',
    title: 'Benchmark: Object Pool + FPS',
    module: 'core',
    run: ({ root, stage }) => {
      const COUNT = 200;
      const objects: egret.DisplayObject[] = [];
      let frameCount = 0;
      let lastFpsTime = performance.now();
      let currentFps = 0;
      let running = true;

      // Title
      const title = new eui.Label();
      title.x = 32; title.y = 102;
      title.size = 18; title.textColor = 0x0f172a;
      title.text = `Benchmark: ${COUNT} moving sprites · FPS monitor`;
      root.addChild(title); objects.push(title);

      // FPS display
      const fpsLabel = new eui.Label();
      fpsLabel.x = 32; fpsLabel.y = 134;
      fpsLabel.size = 22; fpsLabel.textColor = 0x2563eb;
      fpsLabel.text = 'FPS: --';
      root.addChild(fpsLabel); objects.push(fpsLabel);

      // Detail line
      const detail = new eui.Label();
      detail.x = 32; detail.y = 166;
      detail.size = 15; detail.textColor = 0x475569;
      detail.text = 'Objects: -- | Frame: 0';
      root.addChild(detail); objects.push(detail);

      // Toggle button
      const btn = new eui.Button();
      btn.label = 'Pause';
      btn.x = 32; btn.y = 200;
      btn.width = 100; btn.height = 36;
      root.addChild(btn); objects.push(btn);

      btn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        running = !running;
        btn.label = running ? 'Pause' : 'Resume';
      }, root);

      // Create moving sprites
      const colors = [0x2563eb, 0xdc2626, 0x7c3aed, 0x059669, 0xf59e0b, 0x0ea5e9, 0xd946ef, 0x84cc16];
      const sprites = new egret.DisplayObjectContainer();
      sprites.x = 0; sprites.y = 260;
      root.addChild(sprites); objects.push(sprites);

      const spriteData: { s: egret.Shape; vx: number; vy: number }[] = [];
      const w = stage.stageWidth;
      const h = stage.stageHeight - 300;

      for (let i = 0; i < COUNT; i++) {
        const sq = new egret.Shape();
        sq.graphics.beginFill(colors[i % colors.length]);
        sq.graphics.drawRect(-3, -3, 6, 6);
        sq.graphics.endFill();
        sq.x = Math.random() * w;
        sq.y = Math.random() * h;
        sq.alpha = 0.7;
        sprites.addChild(sq);
        spriteData.push({
          s: sq,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
        });
      }

      // FPS ticker
      const tick = () => {
        frameCount++;
        const now = performance.now();
        if (now - lastFpsTime >= 1000) {
          currentFps = Math.round(frameCount / ((now - lastFpsTime) / 1000));
          fpsLabel.text = `FPS: ${currentFps}`;
          detail.text = `Objects: ${COUNT} | Frame: ${frameCount}`;
          frameCount = 0;
          lastFpsTime = now;
        }

        if (running) {
          for (let i = 0; i < spriteData.length; i++) {
            const d = spriteData[i];
            d.s.x += d.vx;
            d.s.y += d.vy;
            if (d.s.x < 0 || d.s.x > w) d.vx *= -1;
            if (d.s.y < 0 || d.s.y > h) d.vy *= -1;
          }
        }
        return false;
      };
      egret.startTick(tick, root);

      return () => {
        egret.stopTick(tick, root);
        objects.forEach((o) => { try { root.removeChild(o); } catch (_) {} });
      };
    },
  },
  {
    id: 'core-benchmark-events',
    title: 'Benchmark: Event Dispatch',
    module: 'core',
    run: ({ root }) => {
      const objects: egret.DisplayObject[] = [];
      const ITERATIONS = 10000;

      const title = new eui.Label();
      title.x = 32; title.y = 102;
      title.size = 18; title.textColor = 0x0f172a;
      title.text = `Benchmark: ${ITERATIONS.toLocaleString()} event dispatches`;
      root.addChild(title); objects.push(title);

      const result = new eui.Label();
      result.x = 32; result.y = 138;
      result.size = 16; result.textColor = 0x475569;
      result.lineSpacing = 6;
      result.text = 'Running...';
      root.addChild(result); objects.push(result);

      const btn = new eui.Button();
      btn.label = 'Run Test';
      btn.x = 32; btn.y = 190;
      btn.width = 120; btn.height = 36;
      root.addChild(btn); objects.push(btn);

      btn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        btn.enabled = false;
        result.text = 'Running...';

        // Use requestAnimationFrame to avoid blocking UI
        setTimeout(() => {
          let counter = 0;
          const bus = new egret.EventDispatcher();
          const handler = () => { counter++; };

          const t0 = performance.now();
          for (let i = 0; i < ITERATIONS; i++) {
            bus.addEventListener('test', handler, bus);
            bus.dispatchEvent(new egret.Event('test'));
            bus.removeEventListener('test', handler, bus);
          }
          const elapsed = performance.now() - t0;

          result.text = [
            `Iterations: ${ITERATIONS.toLocaleString()}`,
            `Total time: ${elapsed.toFixed(1)} ms`,
            `Per dispatch: ${(elapsed / ITERATIONS * 1000).toFixed(2)} μs`,
            `Throughput: ${Math.round(ITERATIONS / elapsed * 1000).toLocaleString()} ops/s`,
          ].join('\n');
          btn.enabled = true;
        }, 50);
      }, root);

      return () => objects.forEach((o) => root.removeChild(o));
    },
  },
  {
    id: 'core-benchmark-matrix',
    title: 'Benchmark: Matrix Math',
    module: 'core',
    run: ({ root }) => {
      const objects: egret.DisplayObject[] = [];
      const ITERATIONS = 50000;

      const title = new eui.Label();
      title.x = 32; title.y = 102;
      title.size = 18; title.textColor = 0x0f172a;
      title.text = `Benchmark: ${ITERATIONS.toLocaleString()} matrix ops`;
      root.addChild(title); objects.push(title);

      const result = new eui.Label();
      result.x = 32; result.y = 138;
      result.size = 16; result.textColor = 0x475569;
      result.lineSpacing = 6;
      result.text = 'Click to run matrix benchmark';
      root.addChild(result); objects.push(result);

      const btn = new eui.Button();
      btn.label = 'Run Test';
      btn.x = 32; btn.y = 200;
      btn.width = 120; btn.height = 36;
      root.addChild(btn); objects.push(btn);

      btn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        btn.enabled = false;
        result.text = 'Running...';

        setTimeout(() => {
          const m = new egret.Matrix();
          const p = new egret.Point(10, 20);

          const t0 = performance.now();
          for (let i = 0; i < ITERATIONS; i++) {
            m.identity();
            m.translate(i % 100, i % 50);
            m.rotate((i % 360) * Math.PI / 180);
            m.scale(1 + (i % 10) / 10, 1 + (i % 10) / 10);
            m.transformPoint(p.x, p.y);
          }
          const elapsed = performance.now() - t0;

          result.text = [
            `Iterations: ${ITERATIONS.toLocaleString()}`,
            `Total time: ${elapsed.toFixed(1)} ms`,
            `Per op: ${(elapsed / ITERATIONS * 1000).toFixed(2)} μs`,
            `Throughput: ${Math.round(ITERATIONS / elapsed * 1000).toLocaleString()} ops/s`,
          ].join('\n');
          btn.enabled = true;
        }, 50);
      }, root);

      return () => objects.forEach((o) => root.removeChild(o));
    },
  },
  {
    id: 'core-http',
    title: 'Core HttpRequest Load JSON',
    module: 'core',
    run: ({ root }) => {
      const objects: egret.DisplayObject[] = [];

      const title = new eui.Label();
      title.x = 32; title.y = 102;
      title.size = 18; title.textColor = 0x0f172a;
      title.text = 'HttpRequest: Load demo-config.json';
      root.addChild(title); objects.push(title);

      const status = new eui.Label();
      status.x = 32; status.y = 134;
      status.size = 15; status.textColor = 0x2563eb;
      status.text = 'Status: Loading...';
      root.addChild(status); objects.push(status);

      const result = new eui.Label();
      result.x = 32; result.y = 160;
      result.size = 14; result.textColor = 0x334155;
      result.lineSpacing = 6;
      result.text = '';
      root.addChild(result); objects.push(result);

      const request = new egret.HttpRequest();
      request.responseType = egret.HttpResponseType.TEXT;

      request.addEventListener(egret.Event.COMPLETE, () => {
        status.text = 'Status: Loaded OK';
        status.textColor = 0x059669;
        try {
          const data = JSON.parse(request.response);
          result.text = [
            'app: ' + data.app.name + ' v' + data.app.version,
            'display: ' + data.display.width + 'x' + data.display.height,
            'frameRate: ' + data.display.frameRate,
            'features: sound=' + data.features.enableSound,
            'items: ' + data.items.length + ' entries',
            '  - ' + data.items[0].name + ' (' + data.items[0].type + ')',
            '  - ' + data.items[1].name + ' (' + data.items[1].type + ')',
            '  - ' + data.items[2].name + ' (' + data.items[2].type + ')',
          ].join('\n');
        } catch (_e) {
          result.text = 'Parse error: ' + request.response.substring(0, 100);
        }
      }, root);

      request.addEventListener(egret.IOErrorEvent.IO_ERROR, () => {
        status.text = 'Status: Load Failed';
        status.textColor = 0xdc2626;
      }, root);

      request.open('/demo-config.json', 'GET');
      request.send();

      return () => objects.forEach((o) => root.removeChild(o));
    },
  },
  {
    id: 'core-sound',
    title: 'Core Sound: Load & Play Audio',
    module: 'core',
    run: ({ root, stage }) => {
      const objects: egret.DisplayObject[] = [];

      const title = new eui.Label();
      title.x = 32; title.y = 116;
      title.size = 20; title.textColor = 0x0f172a;
      title.text = 'Sound: Load & Play Audio';
      root.addChild(title); objects.push(title);

      const status = new eui.Label();
      status.x = 32; status.y = 150;
      status.size = 15; status.textColor = 0x2563eb;
      status.text = 'Loading test-tone.wav...';
      root.addChild(status); objects.push(status);

      const info = new eui.Label();
      info.x = 32; info.y = 176;
      info.size = 14; info.textColor = 0x334155;
      info.lineSpacing = 6;
      info.text = '';
      root.addChild(info); objects.push(info);

      // Play button (triangle)
      const playBtn = new egret.Shape();
      playBtn.x = 32; playBtn.y = 246;
      const pg = playBtn.graphics;
      pg.beginFill(0x059669);
      pg.moveTo(0, 0);
      pg.lineTo(44, 20);
      pg.lineTo(0, 40);
      pg.lineTo(0, 0);
      pg.endFill();
      playBtn.alpha = 0.35;
      playBtn.touchEnabled = true;
      root.addChild(playBtn); objects.push(playBtn);

      // Stop button (square)
      const stopBtn = new egret.Shape();
      stopBtn.x = 96; stopBtn.y = 246;
      const sg = stopBtn.graphics;
      sg.beginFill(0xdc2626);
      sg.drawRect(0, 0, 40, 40);
      sg.endFill();
      stopBtn.alpha = 0.35;
      stopBtn.touchEnabled = true;
      root.addChild(stopBtn); objects.push(stopBtn);

      const playHint = new eui.Label();
      playHint.x = 32; playHint.y = 292;
      playHint.size = 12; playHint.textColor = 0x9ca3af;
      playHint.text = '\u25B6 Play';
      root.addChild(playHint); objects.push(playHint);

      const stopHint = new eui.Label();
      stopHint.x = 96; stopHint.y = 292;
      stopHint.size = 12; stopHint.textColor = 0x9ca3af;
      stopHint.text = '\u25A0 Stop';
      root.addChild(stopHint); objects.push(stopHint);

      const volLabel = new eui.Label();
      volLabel.x = 32; volLabel.y = 322;
      volLabel.size = 13; volLabel.textColor = 0x6b7280;
      volLabel.text = 'Volume: 0.5';
      root.addChild(volLabel); objects.push(volLabel);

      let channel: any = null;

      // Runtime polyfill: bridge sys.$pushSoundChannel / sys.$popSoundChannel
      // (esbuild renames these; ensure they exist on sys regardless of build)
      const _sys = egret.sys as any;
      if (!_sys.$pushSoundChannel) _sys.$pushSoundChannel = (egret as any).$pushSoundChannel;
      if (!_sys.$popSoundChannel) _sys.$popSoundChannel = (egret as any).$popSoundChannel;

      // Use the engine's configured audio class (HtmlSound for HTML5 audio)
      const SoundCtor = (egret as any).HtmlSound || (egret as any).WebAudioSound;
      const sound: egret.Sound = new SoundCtor();

      sound.addEventListener(egret.Event.COMPLETE, () => {
        status.text = 'Loaded! Duration: ' + (sound.length).toFixed(1) + 's';
        status.textColor = 0x059669;
        playBtn.alpha = 1;
        stopBtn.alpha = 1;
        info.text = 'Tap Play to start';
      }, root);

      sound.addEventListener(egret.IOErrorEvent.IO_ERROR, () => {
        status.text = 'Load Failed';
        status.textColor = 0xdc2626;
      }, root);

      sound.load('/test-tone.wav');

      playBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        if (channel) {
          channel.stop();
        }
        channel = sound.play(0, 1);
        channel.volume = 0.5;
        info.text = 'Playing...';
        info.textColor = 0x059669;

        channel.addEventListener(egret.Event.SOUND_COMPLETE, () => {
          info.text = 'Playback finished';
          info.textColor = 0x6b7280;
          channel = null;
        }, root);
      }, root);

      stopBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        if (channel) {
          channel.stop();
          channel = null;
          info.text = 'Stopped';
          info.textColor = 0xdc2626;
        }
      }, root);

      return () => {
        if (channel) {
          channel.stop();
          channel = null;
        }
        sound.close();
        objects.forEach((o) => root.removeChild(o));
      };
    },
  },
  {
    id: 'core-video',
    title: 'Core Video: Load & Play Video',
    module: 'core',
    run: ({ root, stage }) => {
      const objects: egret.DisplayObject[] = [];

      const title = new eui.Label();
      title.x = 32; title.y = 116;
      title.size = 20; title.textColor = 0x0f172a;
      title.text = 'Video: Load & Play Video';
      root.addChild(title); objects.push(title);

      const status = new eui.Label();
      status.x = 32; status.y = 150;
      status.size = 15; status.textColor = 0x2563eb;
      status.text = 'Loading test-video.mp4...';
      root.addChild(status); objects.push(status);

      const info = new eui.Label();
      info.x = 32; info.y = 176;
      info.size = 14; info.textColor = 0x334155;
      info.lineSpacing = 6;
      info.text = '';
      root.addChild(info); objects.push(info);

      // Video display area (blue placeholder)
      const videoArea = new egret.Shape();
      videoArea.x = 32; videoArea.y = 210;
      const vg = videoArea.graphics;
      vg.beginFill(0x1e293b);
      vg.drawRect(0, 0, 320, 240);
      vg.endFill();
      root.addChild(videoArea); objects.push(videoArea);

      // Use egret.WebVideo directly (egret.Video has same value-copy race as Sound)
      const VideoCtor = (egret as any).WebVideo;
      const video: any = new VideoCtor();
      video.x = 32; video.y = 210;
      video.width = 320;
      video.height = 240;
      root.addChild(video); objects.push(video);

      // Play button
      const playBtn = new egret.Shape();
      playBtn.x = 32; playBtn.y = 468;
      const pg = playBtn.graphics;
      pg.beginFill(0x059669);
      pg.moveTo(0, 0);
      pg.lineTo(44, 20);
      pg.lineTo(0, 40);
      pg.lineTo(0, 0);
      pg.endFill();
      playBtn.alpha = 0.35;
      playBtn.touchEnabled = true;
      root.addChild(playBtn); objects.push(playBtn);

      // Pause button
      const pauseBtn = new egret.Shape();
      pauseBtn.x = 96; pauseBtn.y = 468;
      const psg = pauseBtn.graphics;
      psg.beginFill(0xd97706);
      psg.drawRect(0, 0, 14, 40);
      psg.drawRect(22, 0, 14, 40);
      psg.endFill();
      pauseBtn.alpha = 0.35;
      pauseBtn.touchEnabled = true;
      root.addChild(pauseBtn); objects.push(pauseBtn);

      // Stop button
      const stopBtn = new egret.Shape();
      stopBtn.x = 152; stopBtn.y = 468;
      const sg = stopBtn.graphics;
      sg.beginFill(0xdc2626);
      sg.drawRect(0, 0, 40, 40);
      sg.endFill();
      stopBtn.alpha = 0.35;
      stopBtn.touchEnabled = true;
      root.addChild(stopBtn); objects.push(stopBtn);

      // Button labels
      const playHint = new eui.Label();
      playHint.x = 32; playHint.y = 514;
      playHint.size = 12; playHint.textColor = 0x9ca3af;
      playHint.text = '\u25B6 Play';
      root.addChild(playHint); objects.push(playHint);

      const pauseHint = new eui.Label();
      pauseHint.x = 96; pauseHint.y = 514;
      pauseHint.size = 12; pauseHint.textColor = 0x9ca3af;
      pauseHint.text = '\u23F8 Pause';
      root.addChild(pauseHint); objects.push(pauseHint);

      const stopHint = new eui.Label();
      stopHint.x = 152; stopHint.y = 514;
      stopHint.size = 12; stopHint.textColor = 0x9ca3af;
      stopHint.text = '\u25A0 Stop';
      root.addChild(stopHint); objects.push(stopHint);

      video.addEventListener(egret.Event.COMPLETE, () => {
        status.text = 'Loaded! 320x240, 3s';
        status.textColor = 0x059669;
        playBtn.alpha = 1;
        pauseBtn.alpha = 1;
        stopBtn.alpha = 1;
        info.text = 'Tap Play to start';
      }, root);

      video.addEventListener(egret.IOErrorEvent.IO_ERROR, () => {
        status.text = 'Load Failed';
        status.textColor = 0xdc2626;
      }, root);

      video.addEventListener(egret.Event.ENDED, () => {
        info.text = 'Playback ended';
        info.textColor = 0x6b7280;
      }, root);

      // Disable fullscreen: render video inline on the Egret canvas
      video.fullscreen = false;

      video.load('/test-video.mp4');

      playBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        video.play(0, false);
        info.text = 'Playing...';
        info.textColor = 0x059669;
      }, root);

      pauseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        video.pause();
        info.text = 'Paused';
        info.textColor = 0xd97706;
      }, root);

      stopBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
        video.close();
        info.text = 'Stopped';
        info.textColor = 0xdc2626;
      }, root);

      return () => {
        video.close();
        objects.forEach((o) => root.removeChild(o));
      };
    },
  },
];

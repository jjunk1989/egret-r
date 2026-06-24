/**
 * Egret Engine R - Basic Example
 * Demo testbed: supports switching between multiple functional test scenes.
 */

import { egret } from '@egret-r/core';
import '@egret-r/eui';
import '@egret-r/game';
import '@egret-r/tween';
import '@egret-r/socket';

type TestCaseContext = {
  root: egret.DisplayObjectContainer;
  stage: egret.Stage;
};

type TestCaseDefinition = {
  id: string;
  title: string;
  module: 'core' | 'eui' | 'game' | 'tween' | 'socket';
  run: (ctx: TestCaseContext) => void | (() => void) | Promise<void | (() => void)>;
};

const TEST_CHANGE_EVENT = 'egret-test-change';
const QUERY_KEY = 'case';
const EUI = eui as any;
const EG = egret as any;

function showCaseError(root: egret.DisplayObjectContainer, title: string, detail: string): void {
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

const TEST_CASES: TestCaseDefinition[] = [
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
    id: 'eui-collection',
    title: 'EUI Group + ArrayCollection',
    module: 'eui',
    run: ({ root }) => {
      const group = new EUI.Group();
      group.x = 40;
      group.y = 112;
      root.addChild(group);

      const title = new EUI.Label();
      title.size = 22;
      title.textColor = 0x1e293b;
      title.text = 'EUI ArrayCollection Test';
      group.addChild(title);

      const data = new EUI.ArrayCollection([
        { name: 'alpha', value: 1 },
        { name: 'beta', value: 2 },
        { name: 'gamma', value: 3 },
      ]);

      const detail = new EUI.Label();
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
    id: 'tween-ease',
    title: 'Tween + Ease',
    module: 'tween',
    run: async ({ root, stage }) => {
      if (!EG.Tween || !EG.Ease) {
        try {
          await (0, eval)("import('@egret-r/tween')");
        }
        catch {
          showCaseError(
            root,
            'Tween module unavailable',
            'Failed to load @egret-r/tween at runtime.\nCurrent package build still has ESM bare symbol issues.'
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
    id: 'game-urlvariables',
    title: 'Game URLVariables Parse',
    module: 'game',
    run: async ({ root }) => {
      if (!EG.URLVariables) {
        try {
          await (0, eval)("import('@egret-r/game')");
        }
        catch {
          showCaseError(
            root,
            'Game module unavailable',
            'Failed to load @egret-r/game at runtime.\nCurrent package build still has ESM bare symbol issues.'
          );
          return;
        }
      }

      if (!EG.URLVariables) {
        showCaseError(root, 'URLVariables unavailable', 'egret.URLVariables is missing in current runtime build.');
        return;
      }

      const vars = new EG.URLVariables('name=egret&mode=debug&feature=test&feature=unit');
      const data = vars.variables as Record<string, string | string[]>;

      const title = new EUI.Label();
      title.x = 40;
      title.y = 112;
      title.size = 22;
      title.textColor = 0x0f172a;
      title.text = 'Game case: URLVariables decode';
      root.addChild(title);

      const body = new EUI.Label();
      body.x = 40;
      body.y = 148;
      body.size = 18;
      body.textColor = 0x334155;
      body.lineSpacing = 8;
      body.text = [
        `name = ${String(data.name)}`,
        `mode = ${String(data.mode)}`,
        `feature = ${Array.isArray(data.feature) ? data.feature.join(', ') : String(data.feature)}`,
      ].join('\n');
      root.addChild(body);
    },
  },
  {
    id: 'socket-websocket',
    title: 'Socket WebSocket Wrapper',
    module: 'socket',
    run: async ({ root }) => {
      const EG_SOCKET = (globalThis as any).egret;

      const label = new EUI.Label();
      label.x = 40;
      label.y = 112;
      label.size = 22;
      label.textColor = 0x0f172a;
      label.text = 'Socket case: ISocket API';
      root.addChild(label);

      const body = new EUI.Label();
      body.x = 40;
      body.y = 148;
      body.size = 18;
      body.textColor = 0x334155;
      body.lineSpacing = 8;

      if (!EG_SOCKET.WebSocket) {
        body.text = 'egret.WebSocket is unavailable.\nSocket module may not be loaded yet.';
        root.addChild(body);
        return;
      }

      const socket = new EG_SOCKET.WebSocket();
      const typeStr = typeof socket.connect === 'function' ? 'WebSocket API ready' : 'WebSocket API incomplete';
      body.text = [
        'Socket module loaded successfully.',
        `WebSocket constructor: ${typeof EG_SOCKET.WebSocket}`,
        `${typeStr}`,
      ].join('\n');
      root.addChild(body);
    },
  },
];

function resolveInitialCaseId(): string {
  const fromWindow = (window as Window & { __EGRET_TEST_CASE__?: string }).__EGRET_TEST_CASE__;
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get(QUERY_KEY) || undefined;
  const chosen = fromWindow || fromQuery || TEST_CASES[0].id;
  return TEST_CASES.some((item) => item.id === chosen) ? chosen : TEST_CASES[0].id;
}

function syncCaseQuery(id: string): void {
  const url = new URL(window.location.href);
  url.searchParams.set(QUERY_KEY, id);
  window.history.replaceState(null, '', url.toString());
}

function emitCaseChange(id: string): void {
  (window as Window & { __EGRET_TEST_CASE__?: string }).__EGRET_TEST_CASE__ = id;
  syncCaseQuery(id);
  window.dispatchEvent(new CustomEvent(TEST_CHANGE_EVENT, { detail: { id } }));
}

function setupTestNavigator(): void {
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.top = '10px';
  wrapper.style.right = '10px';
  wrapper.style.zIndex = '9999';
  wrapper.style.display = 'flex';
  wrapper.style.gap = '8px';
  wrapper.style.padding = '8px';
  wrapper.style.borderRadius = '8px';
  wrapper.style.background = 'rgba(15,23,42,0.76)';
  wrapper.style.backdropFilter = 'blur(4px)';
  wrapper.style.color = '#fff';
  wrapper.style.fontFamily = 'monospace';

  const select = document.createElement('select');
  select.style.minWidth = '260px';
  select.style.padding = '6px 8px';
  select.style.borderRadius = '6px';
  select.style.border = '1px solid #334155';
  select.style.background = '#0f172a';
  select.style.color = '#e2e8f0';
  TEST_CASES.forEach((item, idx) => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = `${idx + 1}. [${item.module}] ${item.title}`;
    select.appendChild(option);
  });

  const prev = document.createElement('button');
  prev.textContent = '<';
  prev.style.padding = '6px 10px';
  const next = document.createElement('button');
  next.textContent = '>';
  next.style.padding = '6px 10px';

  const getIndex = () => TEST_CASES.findIndex((item) => item.id === select.value);
  const setByIndex = (index: number) => {
    const total = TEST_CASES.length;
    const safe = ((index % total) + total) % total;
    const id = TEST_CASES[safe].id;
    select.value = id;
    emitCaseChange(id);
  };

  select.value = resolveInitialCaseId();
  prev.addEventListener('click', () => setByIndex(getIndex() - 1));
  next.addEventListener('click', () => setByIndex(getIndex() + 1));
  select.addEventListener('change', () => emitCaseChange(select.value));

  wrapper.appendChild(prev);
  wrapper.appendChild(select);
  wrapper.appendChild(next);
  document.body.appendChild(wrapper);
}

class Main extends egret.DisplayObjectContainer {
  private headerGroup!: any;
  private caseTitle!: any;
  private caseMeta!: any;
  private sceneRoot = new egret.DisplayObjectContainer();
  private currentCleanup: (() => void) | null = null;
  private caseRunToken = 0;

  public constructor() {
    super();
    this.once(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
  }

  private onAddedToStage(): void {
    const stage = this.stage;
    stage.frameRate = 60;

    this.drawBackground(stage.stageWidth, stage.stageHeight);
    this.createHeader(stage.stageWidth, stage.stageHeight);

    this.sceneRoot.y = 0;
    this.addChild(this.sceneRoot);

    window.addEventListener(TEST_CHANGE_EVENT, this.onCaseChange as EventListener);
    this.applyCase(resolveInitialCaseId());
  }

  private drawBackground(w: number, h: number): void {
    const bg = new egret.Shape();
    bg.graphics.beginFill(0xf1f5f9);
    bg.graphics.drawRect(0, 0, w, h);
    bg.graphics.endFill();
    this.addChild(bg);

    const stripe = new egret.Shape();
    stripe.graphics.beginFill(0xe2e8f0);
    stripe.graphics.drawRect(0, 0, w, 88);
    stripe.graphics.endFill();
    this.addChild(stripe);
  }

  private createHeader(w: number, h: number): void {
    this.headerGroup = new EUI.Group();
    this.headerGroup.x = 24;
    this.headerGroup.y = 18;
    this.addChild(this.headerGroup);

    const title = new EUI.Label();
    title.text = 'Egret Basic Testbed';
    title.size = 30;
    title.textColor = 0x0f172a;
    this.headerGroup.addChild(title);

    this.caseTitle = new EUI.Label();
    this.caseTitle.y = 40;
    this.caseTitle.size = 20;
    this.caseTitle.textColor = 0x1d4ed8;
    this.headerGroup.addChild(this.caseTitle);

    this.caseMeta = new EUI.Label();
    this.caseMeta.y = 66;
    this.caseMeta.size = 15;
    this.caseMeta.textColor = 0x334155;
    this.caseMeta.text = `Stage: ${w} x ${h}`;
    this.headerGroup.addChild(this.caseMeta);
  }

  private onCaseChange = (evt: CustomEvent<{ id: string }>): void => {
    const id = evt?.detail?.id;
    if (typeof id === 'string' && id) {
      this.applyCase(id);
    }
  };

  private async applyCase(id: string): Promise<void> {
    const current = TEST_CASES.find((item) => item.id === id) || TEST_CASES[0];
    const token = ++this.caseRunToken;
    this.caseTitle.text = `[${current.module}] ${current.title}`;

    if (this.currentCleanup) {
      this.currentCleanup();
      this.currentCleanup = null;
    }
    this.sceneRoot.removeChildren();

    const maybeCleanup = await current.run({ root: this.sceneRoot, stage: this.stage });
    if (token !== this.caseRunToken) {
      return;
    }
    if (typeof maybeCleanup === 'function') {
      this.currentCleanup = maybeCleanup;
    }
    console.log(`Switched test case => ${current.id}`);
  }

  public $onRemoveFromStage(): void {
    if (this.currentCleanup) {
      this.currentCleanup();
      this.currentCleanup = null;
    }
    window.removeEventListener(TEST_CHANGE_EVENT, this.onCaseChange as EventListener);
    super.$onRemoveFromStage();
  }
}

(window as any).Main = Main;

window.addEventListener('DOMContentLoaded', () => {
  setupTestNavigator();

  const container = document.getElementById('game-container') as HTMLDivElement | null;
  if (!container) {
    console.error('Missing #game-container');
    return;
  }

  container.classList.add('egret-player');
  container.setAttribute('data-entry-class', 'Main');
  container.setAttribute('data-scale-mode', egret.StageScaleMode.NO_SCALE);
  container.setAttribute('data-frame-rate', '60');
  container.setAttribute('data-content-width', String(container.clientWidth || window.innerWidth));
  container.setAttribute('data-content-height', String(container.clientHeight || window.innerHeight));
  container.setAttribute('data-multi-fingered', '2');
  container.setAttribute('data-show-fps', 'false');
  container.setAttribute('data-show-log', 'false');

  egret.runEgret({
    renderMode: 'webgl',
    // showFPS: true,
    // showLog: true,
    // maxTouches: 0, // Disable unnecessary input handling
  });
});
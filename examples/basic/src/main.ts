/**
 * Egret Engine R - Basic Example
 * Demo testbed: supports switching between multiple functional test scenes.
 */

import { egret } from '@egret-r/core';
import '@egret-r/eui';
import '@egret-r/game';
import '@egret-r/tween';
import '@egret-r/socket';

import type { TestCaseDefinition } from './cases/types';
import { coreCases } from './cases/core';
import { euiCases } from './cases/eui';
import { tweenCases } from './cases/tween';
import { gameCases } from './cases/game';
import { socketCases } from './cases/socket';

const _E = (globalThis as any).eui;

const TEST_CHANGE_EVENT = 'egret-test-change';
const QUERY_KEY = 'case';

const TEST_CASES: TestCaseDefinition[] = [
  ...coreCases,
  ...euiCases,
  ...tweenCases,
  ...gameCases,
  ...socketCases,
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
    this.headerGroup = new _E.Group();
    this.headerGroup.x = 24;
    this.headerGroup.y = 18;
    this.addChild(this.headerGroup);

    const title = new _E.Label();
    title.text = 'Egret Basic Testbed';
    title.size = 30;
    title.textColor = 0x0f172a;
    this.headerGroup.addChild(title);

    this.caseTitle = new _E.Label();
    this.caseTitle.y = 40;
    this.caseTitle.size = 20;
    this.caseTitle.textColor = 0x1d4ed8;
    this.headerGroup.addChild(this.caseTitle);

    this.caseMeta = new _E.Label();
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
    // renderMode: 'webgl',
    // showFPS: true,
    // showLog: true,
    // maxTouches: 0, // Disable unnecessary input handling
  });
});
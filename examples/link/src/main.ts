import { egret } from '@egret-r/core';
import '@egret-r/game';
import { createStartButton } from './startButton';

const COLS = 8, ROWS = 6, CELL = 52, GAP = 4;
const OX = (480 - COLS * (CELL + GAP)) / 2, OY = 120;
const ICONS = ['●', '■', '▲', '◆', '★', '♥', '♠', '♦', '♣', '✿', '☀', '♫'];

class Main extends egret.DisplayObjectContainer {
  private grid: number[][] = []; // 0 = empty
  private selected: { c: number; r: number } | null = null;
  private score = 0;
  private scoreText!: egret.TextField;
  private gameLayer!: egret.DisplayObjectContainer;

  constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, () => {
      this.createScene();
      this.initGrid();
      this.draw();
      const { onClick } = createStartButton(this, 480, 700, 'Link');
      onClick.then(() => { this.addListeners(); });
    }, this);
  }

  private createScene(): void {
    const bg = new egret.Shape();
    bg.graphics.beginFill(0x1e293b);
    bg.graphics.drawRect(OX - 6, OY - 6, COLS * (CELL + GAP) + 4, ROWS * (CELL + GAP) + 4);
    bg.graphics.endFill();
    this.addChild(bg);
    this.gameLayer = new egret.DisplayObjectContainer();
    this.addChild(this.gameLayer);
    this.scoreText = new egret.TextField();
    this.scoreText.text = 'Score: 0'; this.scoreText.size = 20;
    this.scoreText.textColor = 0xe2e8f0; this.scoreText.x = OX; this.scoreText.y = OY - 32;
    this.addChild(this.scoreText);
  }

  private initGrid(): void {
    // Each icon appears 4 times in 8x6=48 cells (12 icons × 4)
    const tiles: number[] = [];
    for (let i = 0; i < ICONS.length; i++) {
      for (let j = 0; j < 4; j++) tiles.push(i);
    }
    // Shuffle
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    for (let r = 0; r < ROWS; r++) {
      this.grid[r] = [];
      for (let c = 0; c < COLS; c++) {
        this.grid[r][c] = tiles[r * COLS + c] + 1; // 1-based, 0 = empty
      }
    }
  }

  private addListeners(): void {
    document.addEventListener('click', (e: MouseEvent) => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (480 / rect.width);
      const my = (e.clientY - rect.top) * (700 / rect.height);
      const c = Math.floor((mx - OX) / (CELL + GAP));
      const r = Math.floor((my - OY) / (CELL + GAP));
      if (c < 0 || c >= COLS || r < 0 || r >= ROWS || this.grid[r][c] === 0) return;

      if (this.selected) {
        const s = this.selected;
        if (s.c === c && s.r === r) { this.selected = null; this.draw(); return; }
        if (this.grid[s.r][s.c] === this.grid[r][c] && this.canConnect(s.c, s.r, c, r)) {
          this.grid[s.r][s.c] = 0; this.grid[r][c] = 0;
          this.score += 10; this.scoreText.text = `Score: ${this.score}`;
        }
        this.selected = null;
      } else {
        this.selected = { c, r };
      }
      this.draw();
    });
  }

  // Path with at most 2 turns (3 segments: horizontal-vertical-horizontal or vertical-horizontal-vertical)
  private canConnect(c1: number, r1: number, c2: number, r2: number): boolean {
    if (c1 === c2) return this.isLineClear(c1, Math.min(r1, r2), c1, Math.max(r1, r2), true);
    if (r1 === r2) return this.isLineClear(Math.min(c1, c2), r1, Math.max(c1, c2), r1, false);
    // 1 turn: via (c1, r2) or (c2, r1)
    if (this.grid[r2][c1] === 0 && this.isLineClear(c1, Math.min(r1, r2), c1, Math.max(r1, r2), true) &&
        this.isLineClear(Math.min(c1, c2), r2, Math.max(c1, c2), r2, false)) return true;
    if (this.grid[r1][c2] === 0 && this.isLineClear(c2, Math.min(r1, r2), c2, Math.max(r1, r2), true) &&
        this.isLineClear(Math.min(c1, c2), r1, Math.max(c1, c2), r1, false)) return true;
    // 2 turns: scan vertical
    for (let r = 0; r < ROWS; r++) {
      if (r === r1 || r === r2) continue;
      if (this.grid[r][c1] !== 0 || this.grid[r][c2] !== 0) continue;
      if (this.isLineClear(c1, Math.min(r1, r), c1, Math.max(r1, r), true) &&
          this.isLineClear(Math.min(c1, c2), r, Math.max(c1, c2), r, false) &&
          this.isLineClear(c2, Math.min(r, r2), c2, Math.max(r, r2), true)) return true;
    }
    // 2 turns: scan horizontal
    for (let c = 0; c < COLS; c++) {
      if (c === c1 || c === c2) continue;
      if (this.grid[r1][c] !== 0 || this.grid[r2][c] !== 0) continue;
      if (this.isLineClear(Math.min(c1, c), r1, Math.max(c1, c), r1, false) &&
          this.isLineClear(c, Math.min(r1, r2), c, Math.max(r1, r2), true) &&
          this.isLineClear(Math.min(c, c2), r2, Math.max(c, c2), r2, false)) return true;
    }
    return false;
  }

  private isLineClear(x1: number, y1: number, x2: number, y2: number, vertical: boolean): boolean {
    if (vertical) {
      for (let r = y1; r <= y2; r++) { if (r !== y1 && r !== y2 && this.grid[r][x1] !== 0) return false; }
    } else {
      for (let c = x1; c <= x2; c++) { if (c !== x1 && c !== x2 && this.grid[y1][c] !== 0) return false; }
    }
    return true;
  }

  private draw(): void {
    this.gameLayer.removeChildren();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (this.grid[r][c] === 0) continue;
        const tile = new egret.Shape();
        const colorIdx = (this.grid[r][c] - 1) % 6;
        const colors = [0xef4444, 0xf59e0b, 0x22c55e, 0x3b82f6, 0x8b5cf6, 0xec4899];
        tile.graphics.beginFill(colors[colorIdx]);
        tile.graphics.drawRoundRect(OX + c * (CELL + GAP), OY + r * (CELL + GAP), CELL, CELL, 6, 6);
        tile.graphics.endFill();
        const label = new egret.TextField();
        label.text = ICONS[this.grid[r][c] - 1];
        label.size = 22; label.textColor = 0xffffff; label.textAlign = egret.HorizontalAlign.CENTER;
        label.x = OX + c * (CELL + GAP); label.y = OY + r * (CELL + GAP) + 12;
        label.width = CELL;
        this.gameLayer.addChild(tile); this.gameLayer.addChild(label);
      }
    }
    if (this.selected) {
      const s = this.selected;
      const hl = new egret.Shape();
      hl.graphics.lineStyle(3, 0xffffff);
      hl.graphics.drawRoundRect(OX + s.c * (CELL + GAP) - 1, OY + s.r * (CELL + GAP) - 1, CELL + 2, CELL + 2, 8, 8);
      this.gameLayer.addChild(hl);
    }
  }
}

(window as any).Main = Main;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => egret.runEgret({ renderMode: 'webgl' }));
} else {
  egret.runEgret({ renderMode: 'webgl' });
}

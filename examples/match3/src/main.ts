import { egret } from '@egret-r/core';
import '@egret-r/game';
import { createStartButton } from './startButton';

const COLS = 8, ROWS = 8, CELL = 52, GAP = 4;
const OX = (480 - COLS * (CELL + GAP)) / 2, OY = 80;
const COLORS = [0xef4444, 0xf59e0b, 0x22c55e, 0x3b82f6, 0x8b5cf6, 0xec4899];

class Main extends egret.DisplayObjectContainer {
  private grid: number[][] = [];
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
      this.addEventListener(egret.Event.ENTER_FRAME, () => {}, this);
      const { onClick } = createStartButton(this, 480, 700, 'Match-3');
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
    for (let r = 0; r < ROWS; r++) {
      this.grid[r] = [];
      for (let c = 0; c < COLS; c++) {
        this.grid[r][c] = Math.floor(Math.random() * COLORS.length);
      }
    }
    this.removeMatches();
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
      if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return;
      if (this.selected) {
        const s = this.selected;
        if (Math.abs(s.c - c) + Math.abs(s.r - r) === 1) {
          this.swap(s.c, s.r, c, r);
        }
        this.selected = null; this.draw();
      } else {
        this.selected = { c, r }; this.draw();
      }
    });
  }

  private swap(c1: number, r1: number, c2: number, r2: number): void {
    [this.grid[r1][c1], this.grid[r2][c2]] = [this.grid[r2][c2], this.grid[r1][c1]];
    if (!this.removeMatches()) {
      [this.grid[r1][c1], this.grid[r2][c2]] = [this.grid[r2][c2], this.grid[r1][c1]];
    }
    this.draw();
  }

  private removeMatches(): boolean {
    let found = false;
    const toRemove = new Set<string>();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS - 2; c++) {
        if (this.grid[r][c] === this.grid[r][c + 1] && this.grid[r][c] === this.grid[r][c + 2]) {
          toRemove.add(`${r},${c}`); toRemove.add(`${r},${c + 1}`); toRemove.add(`${r},${c + 2}`);
          found = true;
        }
      }
    }
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS - 2; r++) {
        if (this.grid[r][c] === this.grid[r + 1][c] && this.grid[r][c] === this.grid[r + 2][c]) {
          toRemove.add(`${r},${c}`); toRemove.add(`${r + 1},${c}`); toRemove.add(`${r + 2},${c}`);
          found = true;
        }
      }
    }
    toRemove.forEach(k => { const [r, c] = k.split(',').map(Number); this.grid[r][c] = -1; this.score += 10; });
    this.scoreText.text = `Score: ${this.score}`;
    // Drop
    for (let c = 0; c < COLS; c++) {
      let wr = ROWS - 1;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (this.grid[r][c] !== -1) this.grid[wr--][c] = this.grid[r][c];
      }
      while (wr >= 0) this.grid[wr--][c] = Math.floor(Math.random() * COLORS.length);
    }
    if (found) this.removeMatches();
    return found;
  }

  private draw(): void {
    this.gameLayer.removeChildren();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const gem = new egret.Shape();
        gem.graphics.beginFill(this.grid[r][c] >= 0 ? COLORS[this.grid[r][c]] : 0x334155);
        gem.graphics.drawRoundRect(OX + c * (CELL + GAP), OY + r * (CELL + GAP), CELL, CELL, 8, 8);
        gem.graphics.endFill();
        if (this.selected && this.selected.c === c && this.selected.r === r) {
          gem.graphics.lineStyle(3, 0xffffff);
          gem.graphics.drawRoundRect(OX + c * (CELL + GAP), OY + r * (CELL + GAP), CELL, CELL, 8, 8);
        }
        this.gameLayer.addChild(gem);
      }
    }
  }
}

(window as any).Main = Main;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => egret.runEgret({ renderMode: 'webgl' }));
} else {
  egret.runEgret({ renderMode: 'webgl' });
}

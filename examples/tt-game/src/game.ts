// Egret Engine R — Mini Game Match-3 Demo
import { egret } from '@egret-r/core';
import '@egret-r/game';
import { createStartButton } from './startButton';

const COLS = 8, ROWS = 8, GAP = 4;
let CELL = 44;
let OX = 10, OY = 90;
const COLORS = [0xef4444, 0xf59e0b, 0x22c55e, 0x3b82f6, 0x8b5cf6, 0xec4899];

class Main extends egret.DisplayObjectContainer {
  private grid: number[][] = [];
  private gems: egret.Shape[][] = [];
  private busy = false; private score = 0;
  private scoreText!: egret.TextField;
  private gameLayer!: egret.DisplayObjectContainer;

  constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, () => {
      const stage = this.stage!;
      // Calculate grid size from screen
      CELL = Math.floor((stage.$stageWidth - 16) / COLS) - GAP;
      if (CELL > 56) CELL = 56;
      if (CELL < 28) CELL = 28;
      OX = Math.floor((stage.$stageWidth - COLS * (CELL + GAP)) / 2);
      // Center grid vertically
      const gridH = ROWS * (CELL + GAP);
      OY = Math.floor(60 + (stage.$stageHeight - 60 - gridH) / 2);
      this.createScene(); this.initGrid();
      createStartButton(this, stage.$stageWidth, stage.$stageHeight, 'Match-3').onClick.then(() => this.addListeners());
    }, this);
  }

  private createScene(): void {
    const stage = this.stage!;
    // Full-screen background
    const bg = new egret.Shape();
    bg.graphics.beginFill(0x1a3a5c);
    bg.graphics.drawRect(0, 0, stage.$stageWidth, stage.$stageHeight);
    bg.graphics.endFill(); this.addChild(bg);
    this.gameLayer = new egret.DisplayObjectContainer(); this.addChild(this.gameLayer);
    this.scoreText = new egret.TextField();
    this.scoreText.text = 'Score: 0'; this.scoreText.size = 20;
    this.scoreText.textColor = 0xe2e8f0; this.scoreText.x = OX; this.scoreText.y = OY - 32;
    this.addChild(this.scoreText);
  }

  private initGrid(): void {
    for (let r = 0; r < ROWS; r++) { this.grid[r] = [];
      for (let c = 0; c < COLS; c++) { let v: number; do { v = Math.floor(Math.random() * COLORS.length); }
        while ((c >= 2 && this.grid[r][c - 1] === v && this.grid[r][c - 2] === v) ||
          (r >= 2 && this.grid[r - 1][c] === v && this.grid[r - 2][c] === v));
        this.grid[r][c] = v; } }
    this.spawnGems(true);
  }

  private spawnGems(animate: boolean): void {
    this.gameLayer.removeChildren(); this.gems = [];
    for (let r = 0; r < ROWS; r++) { this.gems[r] = []; for (let c = 0; c < COLS; c++) {
      const g = new egret.Shape(); this.redraw(g, this.grid[r][c]);
      g.x = OX + c * (CELL + GAP);
      g.y = animate ? OY - 100 - r * 30 : OY + r * (CELL + GAP);
      this.gameLayer.addChild(g); this.gems[r][c] = g;
    }}
    if (animate) this.settle();
  }

  private settle(): void {
    this.busy = true; const moves: { g: egret.Shape; r: number }[] = [];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) { const g = this.gems[r][c]; if (g) moves.push({ g, r }); }
    const start = Date.now(), dur = 400;
    const tick = () => { const t = Math.min(1, (Date.now() - start) / dur), e = 1 - Math.pow(1 - t, 3);
      moves.forEach(m => { m.g.y = OY + (m.r * e - (1 - e) * 3) * (CELL + GAP); });
      if (t < 1) requestAnimationFrame(tick); else { moves.forEach(m => { m.g.y = OY + m.r * (CELL + GAP) }); this.busy = false; } }; tick();
  }

  private redraw(g: egret.Shape, colorIdx: number): void {
    g.graphics.clear(); g.graphics.beginFill(COLORS[colorIdx]);
    g.graphics.drawRoundRect(0, 0, CELL, CELL, 8, 8); g.graphics.endFill();
  }

  private addListeners(): void {
    const stage = this.stage!;
    let startC = 0, startR = 0, gem: egret.Shape | null = null;
    stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => {
      if (this.busy) return;
      const c = Math.floor((e.stageX - OX) / (CELL + GAP)), r = Math.floor((e.stageY - OY) / (CELL + GAP));
      if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return;
      startC = c; startR = r; gem = this.gems[r][c];
      if (gem) this.gameLayer.addChild(gem);
    }, this);
    stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, (e: egret.TouchEvent) => {
      if (!gem || this.busy) return;
      const c = Math.floor((e.stageX - OX) / (CELL + GAP)), r = Math.floor((e.stageY - OY) / (CELL + GAP));
      const dx = c - startC, dy = r - startR, m = (CELL + GAP) * 0.7;
      gem.x = OX + startC * (CELL + GAP) + Math.max(-m, Math.min(m, dx * (CELL + GAP)));
      gem.y = OY + startR * (CELL + GAP) + Math.max(-m, Math.min(m, dy * (CELL + GAP)));
    }, this);
    stage.addEventListener(egret.TouchEvent.TOUCH_END, (e: egret.TouchEvent) => {
      if (!gem || this.busy) return;
      const c = Math.floor((e.stageX - OX) / (CELL + GAP)), r = Math.floor((e.stageY - OY) / (CELL + GAP));
      gem.x = OX + startC * (CELL + GAP); gem.y = OY + startR * (CELL + GAP);
      const dc = c - startC, dr = r - startR;
      const tc = startC + (Math.abs(dc) > Math.abs(dr) ? Math.sign(dc) : 0);
      const tr = startR + (Math.abs(dr) >= Math.abs(dc) ? Math.sign(dr) : 0);
      gem = null;
      if ((tc !== startC || tr !== startR) && tc >= 0 && tc < COLS && tr >= 0 && tr < ROWS &&
        Math.abs(tc - startC) + Math.abs(tr - startR) === 1)
        this.swap(startC, startR, tc, tr);
    }, this);
  }

  private async swap(c1: number, r1: number, c2: number, r2: number): Promise<void> {
    this.busy = true;
    egret.playTone(440, 60);
    [this.grid[r1][c1], this.grid[r2][c2]] = [this.grid[r2][c2], this.grid[r1][c1]];
    [this.gems[r1][c1], this.gems[r2][c2]] = [this.gems[r2][c2], this.gems[r1][c1]];
    await this.anim(c1, r1, c2, r2);
    if (!this.matches()) {
      [this.grid[r1][c1], this.grid[r2][c2]] = [this.grid[r2][c2], this.grid[r1][c1]];
      [this.gems[r1][c1], this.gems[r2][c2]] = [this.gems[r2][c2], this.gems[r1][c1]];
      await this.anim(c1, r1, c2, r2);
    } else { await this.process(); }
    this.busy = false;
  }

  private anim(c1: number, r1: number, c2: number, r2: number): Promise<void> {
    return new Promise(resolve => {
      const g1 = this.gems[r1][c1], g2 = this.gems[r2][c2];
      const x1 = OX + c1 * (CELL + GAP), y1 = OY + r1 * (CELL + GAP);
      const x2 = OX + c2 * (CELL + GAP), y2 = OY + r2 * (CELL + GAP);
      this.redraw(g1, this.grid[r1][c1]); this.redraw(g2, this.grid[r2][c2]);
      const s = Date.now(), d = 180;
      const tick = () => { const t = Math.min(1, (Date.now() - s) / d), e = t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        g1.x = x1 + (x2 - x1) * e; g1.y = y1 + (y2 - y1) * e; g2.x = x2 + (x1 - x2) * e; g2.y = y2 + (y1 - y2) * e;
        if (t < 1) requestAnimationFrame(tick); else { g1.x = x1; g1.y = y1; g2.x = x2; g2.y = y2; resolve(); } }; tick(); });
  }

  private _m = new Set<string>();
  private matches(): boolean {
    this._m.clear();
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS - 2; c++)
      if (this.grid[r][c] >= 0 && this.grid[r][c] === this.grid[r][c + 1] && this.grid[r][c] === this.grid[r][c + 2])
      { this._m.add(r + ',' + c); this._m.add(r + ',' + (c + 1)); this._m.add(r + ',' + (c + 2)); }
    for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS - 2; r++)
      if (this.grid[r][c] >= 0 && this.grid[r][c] === this.grid[r + 1][c] && this.grid[r][c] === this.grid[r + 2][c])
      { this._m.add(r + ',' + c); this._m.add((r + 1) + ',' + c); this._m.add((r + 2) + ',' + c); }
    return this._m.size > 0;
  }

  private async process(): Promise<void> {
    while (this._m.size > 0) {
      const rm = this._m;
      await new Promise<void>(resolve => { const s = Date.now(), d = 200;
        const tick = () => { const t = Math.min(1, (Date.now() - s) / d);
          rm.forEach(k => { const [p, q] = k.split(',').map(Number); const g = this.gems[p]?.[q]; if (g) g.scaleX = g.scaleY = 1 - t; });
          if (t < 1) requestAnimationFrame(tick); else resolve(); }; tick(); });
      rm.forEach(k => { const [p, q] = k.split(',').map(Number);
        if (this.gems[p][q]) { this.gameLayer.removeChild(this.gems[p][q]); this.gems[p][q] = null!; }
        this.grid[p][q] = -1; });
      this.score += rm.size * 10; this.scoreText.text = 'Score: ' + this.score;
      if (rm.size >= 4) egret.playTone(1000, 150); else egret.playTone(600, 100);
      const mv: { g: egret.Shape; r: number; c: number; fr: number }[] = [];
      for (let c = 0; c < COLS; c++) { let wr = ROWS - 1;
        for (let r = ROWS - 1; r >= 0; r--) { if (this.grid[r][c] !== -1) {
          if (r !== wr) { mv.push({ g: this.gems[r][c], r: wr, c, fr: r }); this.gems[wr][c] = this.gems[r][c]; }
          this.grid[wr--][c] = this.grid[r][c]; }}
        for (let r = wr; r >= 0; r--) { this.grid[r][c] = Math.floor(Math.random() * COLORS.length);
          const g = new egret.Shape(); this.redraw(g, this.grid[r][c]);
          g.x = OX + c * (CELL + GAP); g.y = OY - (wr - r + 2) * (CELL + GAP);
          this.gameLayer.addChild(g); this.gems[r][c] = g; mv.push({ g, r, c, fr: r - (wr - r + 2) }); }}
      await new Promise<void>(resolve => { const s = Date.now(), d = 280;
        const tick = () => { const t = Math.min(1, (Date.now() - s) / d), e = 1 - Math.pow(1 - t, 3);
          mv.forEach(m => { m.g.y = OY + (m.fr + (m.r - m.fr) * e) * (CELL + GAP); });
          if (t < 1) requestAnimationFrame(tick); else { mv.forEach(m => { m.g.y = OY + m.r * (CELL + GAP) }); resolve(); } }; tick(); });
      this.matches();
    }
  }
}

(globalThis as any).Main = Main;
egret.startMiniGame({ entryClass: 'Main' });

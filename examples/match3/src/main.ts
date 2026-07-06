import { egret } from "@egret-r/core";
import "@egret-r/game";
import { createStartButton } from "./startButton";

const COLS = 8, ROWS = 8, CELL = 52, GAP = 4;
const OX = (480 - COLS * (CELL + GAP)) / 2, OY = 80;
const COLORS = [0xef4444, 0xf59e0b, 0x22c55e, 0x3b82f6, 0x8b5cf6, 0xec4899];

class Main extends egret.DisplayObjectContainer {
  private grid: number[][] = [];
  private gems: egret.Shape[][] = [];
  private selected: { c: number; r: number } | null = null;
  private busy = false;
  private score = 0;
  private scoreText!: egret.TextField;
  private gameLayer!: egret.DisplayObjectContainer;

  constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, () => {
      this.createScene(); this.initGrid();
      const { onClick } = createStartButton(this, 480, 700, "Match-3");
      onClick.then(() => { this.addListeners(); });
    }, this);
  }

  private createScene(): void {
    const bg = new egret.Shape();
    bg.graphics.beginFill(0x1e293b);
    bg.graphics.drawRect(OX - 6, OY - 6, COLS * (CELL + GAP) + 4, ROWS * (CELL + GAP) + 4);
    bg.graphics.endFill(); this.addChild(bg);
    this.gameLayer = new egret.DisplayObjectContainer(); this.addChild(this.gameLayer);
    this.scoreText = new egret.TextField();
    this.scoreText.text = "Score: 0"; this.scoreText.size = 20;
    this.scoreText.textColor = 0xe2e8f0; this.scoreText.x = OX; this.scoreText.y = OY - 32;
    this.addChild(this.scoreText);
  }

  private initGrid(): void {
    for (let r = 0; r < ROWS; r++) { this.grid[r] = [];
      for (let c = 0; c < COLS; c++) { let v: number; do { v = Math.floor(Math.random() * COLORS.length); }
        while ((c>=2&&this.grid[r][c-1]===v&&this.grid[r][c-2]===v)||(r>=2&&this.grid[r-1]&&this.grid[r-1][c]===v&&this.grid[r-2]&&this.grid[r-2][c]===v));
        this.grid[r][c] = v; } }
    this.spawnGems(true);
  }

  private spawnGems(animate: boolean): void {
    this.gameLayer.removeChildren(); this.gems = [];
    for (let r = 0; r < ROWS; r++) { this.gems[r] = []; for (let c = 0; c < COLS; c++) {
      const g = new egret.Shape(); this.redrawGem(g, this.grid[r][c]);
      g.x = OX + c * (CELL + GAP);
      g.y = animate ? OY - 100 - r * 30 : OY + r * (CELL + GAP);
      this.gameLayer.addChild(g); this.gems[r][c] = g;
    }}
    if (animate) this.settle();
  }

  private settle(): void {
    this.busy = true; const moves: {g:egret.Shape, r:number}[] = [];
    for (let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){const g=this.gems[r][c];if(g)moves.push({g,r});}
    const start=Date.now(),dur=400;
    const tick=()=>{const t=Math.min(1,(Date.now()-start)/dur),e=1-Math.pow(1-t,3);
      moves.forEach(m=>{m.g.y=OY+(m.r*e-(1-e)*3)*(CELL+GAP);});
      if(t<1)requestAnimationFrame(tick);else{moves.forEach(m=>{m.g.y=OY+m.r*(CELL+GAP)});this.busy=false;}};tick();
  }

  private dragGem: egret.Shape | null = null;
  private dragC = 0; private dragR = 0;

  private addListeners(): void {
    const canvas = document.querySelector("canvas")!;
    const onStart = (e: MouseEvent | TouchEvent) => {
      if (this.busy) return;
      const ev = "touches" in e ? (e as TouchEvent).touches[0] : (e as MouseEvent);
      const { c, r } = this.posFromClient(ev.clientX, ev.clientY);
      if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return;
      this.dragC = c; this.dragR = r;
      this.dragGem = this.gems[r][c];
      if (this.dragGem) this.gameLayer.addChild(this.dragGem); // bring to front
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!this.dragGem || this.busy) return;
      e.preventDefault();
      const ev = "touches" in e ? (e as TouchEvent).touches[0] : (e as MouseEvent);
      const { c, r } = this.posFromClient(ev.clientX, ev.clientY);
      const dx = c - this.dragC, dy = r - this.dragR;
      const maxOff = (CELL + GAP) * 0.7;
      const offX = Math.max(-maxOff, Math.min(maxOff, dx * (CELL + GAP)));
      const offY = Math.max(-maxOff, Math.min(maxOff, dy * (CELL + GAP)));
      this.dragGem.x = OX + this.dragC * (CELL + GAP) + offX;
      this.dragGem.y = OY + this.dragR * (CELL + GAP) + offY;
    };
    const onEnd = (e: MouseEvent | TouchEvent) => {
      if (!this.dragGem || this.busy) return;
      const ev = "changedTouches" in e ? (e as TouchEvent).changedTouches[0] : (e as MouseEvent);
      const { c, r } = this.posFromClient(ev.clientX, ev.clientY);
      this.dragGem.x = OX + this.dragC * (CELL + GAP);
      this.dragGem.y = OY + this.dragR * (CELL + GAP);
      const dc = c - this.dragC, dr = r - this.dragR;
      const targetC = this.dragC + (Math.abs(dc) > Math.abs(dr) ? Math.sign(dc) : 0);
      const targetR = this.dragR + (Math.abs(dr) >= Math.abs(dc) ? Math.sign(dr) : 0);
      this.dragGem = null;
      if ((targetC !== this.dragC || targetR !== this.dragR) &&
          targetC >= 0 && targetC < COLS && targetR >= 0 && targetR < ROWS &&
          Math.abs(targetC - this.dragC) + Math.abs(targetR - this.dragR) === 1) {
        this.doSwap(this.dragC, this.dragR, targetC, targetR);
      }
    };
    canvas.addEventListener("mousedown", onStart);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseup", onEnd);
    canvas.addEventListener("touchstart", onStart, { passive: false });
    canvas.addEventListener("touchmove", onMove, { passive: false });
    canvas.addEventListener("touchend", onEnd);
  }
  private posFromClient(cx: number, cy: number): { c: number; r: number } {
    const canvas = document.querySelector("canvas"); if (!canvas) return { c: -1, r: -1 };
    const rect = canvas.getBoundingClientRect();
    const mx = (cx - rect.left) * (480 / rect.width);
    const my = (cy - rect.top) * (700 / rect.height);
    return { c: Math.floor((mx - OX) / (CELL + GAP)), r: Math.floor((my - OY) / (CELL + GAP)) };
  }
}

(window as any).Main = Main;
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => egret.runEgret({ renderMode: "webgl" }));
} else { egret.runEgret({ renderMode: "webgl" }); }
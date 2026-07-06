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
    const canvas = document.querySelector('canvas')!;
    canvas.addEventListener('mousedown', (e: MouseEvent) => {
      if (this.busy) return;
      const { c, r } = this.posFromEvent(e);
      if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return;
      this.dragC = c; this.dragR = r;
      this.dragGem = this.gems[r][c];
      this.selected = { c, r };
    });
    canvas.addEventListener('mousemove', (e: MouseEvent) => {
      if (!this.dragGem || this.busy) return;
      const { c, r } = this.posFromEvent(e);
      const dx = c - this.dragC, dy = r - this.dragR;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxOff = (CELL + GAP) * 0.6;
      const offX = dist > 0 ? Math.min(maxOff, Math.abs(dx * (CELL + GAP))) * Math.sign(dx) : 0;
      const offY = dist > 0 ? Math.min(maxOff, Math.abs(dy * (CELL + GAP))) * Math.sign(dy) : 0;
      this.dragGem.x = OX + this.dragC * (CELL + GAP) + offX;
      this.dragGem.y = OY + this.dragR * (CELL + GAP) + offY;
    });
    canvas.addEventListener('mouseup', (e: MouseEvent) => {
      if (!this.dragGem || this.busy) return;
      const { c, r } = this.posFromEvent(e);
      this.dragGem.x = OX + this.dragC * (CELL + GAP);
      this.dragGem.y = OY + this.dragR * (CELL + GAP);
      const dc = c - this.dragC, dr = r - this.dragR;
      const targetC = this.dragC + (Math.abs(dc) > Math.abs(dr) ? Math.sign(dc) : 0);
      const targetR = this.dragR + (Math.abs(dr) >= Math.abs(dc) ? Math.sign(dr) : 0);
      this.dragGem = null; this.selected = null;
      if ((targetC !== this.dragC || targetR !== this.dragR) &&
          targetC >= 0 && targetC < COLS && targetR >= 0 && targetR < ROWS &&
          Math.abs(targetC - this.dragC) + Math.abs(targetR - this.dragR) === 1) {
        this.doSwap(this.dragC, this.dragR, targetC, targetR);
      }
    });
  }
  private posFromEvent(e: MouseEvent): { c: number; r: number } {
    const canvas = document.querySelector('canvas'); if (!canvas) return { c: -1, r: -1 };
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (480 / rect.width);
    const my = (e.clientY - rect.top) * (700 / rect.height);
    return { c: Math.floor((mx - OX) / (CELL + GAP)), r: Math.floor((my - OY) / (CELL + GAP)) };
  }

  private clearHighlight(): void {
    for (let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){const g=this.gems[r][c];if(g)this.redrawGem(g,this.grid[r][c]);}
  }
  private highlight(c: number, r: number): void {
    const g = this.gems[r][c]; if (!g) return; this.redrawGem(g, this.grid[r][c]);
    g.graphics.lineStyle(3, 0xffffff); g.graphics.drawRoundRect(0, 0, CELL, CELL, 8, 8);
  }
  private redrawGem(g: egret.Shape, colorIdx: number): void {
    g.graphics.clear(); g.graphics.beginFill(COLORS[colorIdx]);
    g.graphics.drawRoundRect(0, 0, CELL, CELL, 8, 8); g.graphics.endFill();
  }

  private async doSwap(c1:number,r1:number,c2:number,r2:number): Promise<void> {
    this.busy=true;
    [this.grid[r1][c1],this.grid[r2][c2]]=[this.grid[r2][c2],this.grid[r1][c1]];
    [this.gems[r1][c1],this.gems[r2][c2]]=[this.gems[r2][c2],this.gems[r1][c1]];
    await this.animSwap(c1,r1,c2,r2);
    if(!this.findMatches()){
      [this.grid[r1][c1],this.grid[r2][c2]]=[this.grid[r2][c2],this.grid[r1][c1]];
      [this.gems[r1][c1],this.gems[r2][c2]]=[this.gems[r2][c2],this.gems[r1][c1]];
      await this.animSwap(c1,r1,c2,r2);
    }else{await this.processMatches();}
    this.busy=false;
  }

  private animSwap(c1:number,r1:number,c2:number,r2:number): Promise<void> {
    return new Promise(resolve=>{
      const g1=this.gems[r1][c1],g2=this.gems[r2][c2];
      const x1=OX+c1*(CELL+GAP),y1=OY+r1*(CELL+GAP),x2=OX+c2*(CELL+GAP),y2=OY+r2*(CELL+GAP);
      this.redrawGem(g1,this.grid[r1][c1]);this.redrawGem(g2,this.grid[r2][c2]);
      const s=Date.now(),d=180;
      const tick=()=>{const t=Math.min(1,(Date.now()-s)/d),e=t<.5?2*t*t:-1+(4-2*t)*t;
        g1.x=x1+(x2-x1)*e;g1.y=y1+(y2-y1)*e;g2.x=x2+(x1-x2)*e;g2.y=y2+(y1-y2)*e;
        if(t<1)requestAnimationFrame(tick);else{g1.x=x1;g1.y=y1;g2.x=x2;g2.y=y2;resolve();}};tick();});
  }

  private findMatches(): boolean {
    this._matches.clear();
    for(let r=0;r<ROWS;r++)for(let c=0;c<COLS-2;c++)
      if(this.grid[r][c]>=0&&this.grid[r][c]===this.grid[r][c+1]&&this.grid[r][c]===this.grid[r][c+2])
        {this._matches.add(r+","+c);this._matches.add(r+","+(c+1));this._matches.add(r+","+(c+2));}
    for(let c=0;c<COLS;c++)for(let r=0;r<ROWS-2;r++)
      if(this.grid[r][c]>=0&&this.grid[r][c]===this.grid[r+1][c]&&this.grid[r][c]===this.grid[r+2][c])
        {this._matches.add(r+","+c);this._matches.add((r+1)+","+c);this._matches.add((r+2)+","+c);}
    return this._matches.size>0;
  }
  private _matches=new Set<string>();

  private async processMatches(): Promise<void> {
    while(this._matches.size>0){
      const toRemove=this._matches;
      await new Promise<void>(resolve=>{const s=Date.now(),d=200;
        const tick=()=>{const t=Math.min(1,(Date.now()-s)/d);
          toRemove.forEach(k=>{const[p,q]=k.split(",").map(Number);const g=this.gems[p]?.[q];if(g)g.scaleX=g.scaleY=1-t;});
          if(t<1)requestAnimationFrame(tick);else resolve();};tick();});
      toRemove.forEach(k=>{const[p,q]=k.split(",").map(Number);
        if(this.gems[p][q]){this.gameLayer.removeChild(this.gems[p][q]);this.gems[p][q]=null!;}
        this.grid[p][q]=-1;});
      this.score+=toRemove.size*10;this.scoreText.text="Score: "+this.score;
      const moves:{g:egret.Shape,r:number,c:number,fr:number}[]=[];
      for(let c=0;c<COLS;c++){let wr=ROWS-1;
        for(let r=ROWS-1;r>=0;r--){if(this.grid[r][c]!==-1){
          if(r!==wr){moves.push({g:this.gems[r][c],r:wr,c,fr:r});this.gems[wr][c]=this.gems[r][c];}
          this.grid[wr--][c]=this.grid[r][c];}}
        for(let r=wr;r>=0;r--){this.grid[r][c]=Math.floor(Math.random()*COLORS.length);
          const g=new egret.Shape();this.redrawGem(g,this.grid[r][c]);
          g.x=OX+c*(CELL+GAP);g.y=OY-(wr-r+2)*(CELL+GAP);
          this.gameLayer.addChild(g);this.gems[r][c]=g;moves.push({g,r,c,fr:r-(wr-r+2)});}}
      await new Promise<void>(resolve=>{const s=Date.now(),d=280;
        const tick=()=>{const t=Math.min(1,(Date.now()-s)/d),e=1-Math.pow(1-t,3);
          moves.forEach(m=>{m.g.y=OY+(m.fr+(m.r-m.fr)*e)*(CELL+GAP);});
          if(t<1)requestAnimationFrame(tick);else{moves.forEach(m=>{m.g.y=OY+m.r*(CELL+GAP)});resolve();}};tick();});
      this.findMatches();
    }
  }
}

(window as any).Main = Main;
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => egret.runEgret({ renderMode: "webgl" }));
} else { egret.runEgret({ renderMode: "webgl" }); }
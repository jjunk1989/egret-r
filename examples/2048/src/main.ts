import { egret } from '@egret-r/core';
import { eui } from '@egret-r/eui';
import '@egret-r/game';
import '@egret-r/tween';
import { createStartButton } from './startButton';

class Main extends egret.DisplayObjectContainer {
  private objects: egret.DisplayObject[] = [];
  private SIZE = 4; private CELL = 80; private GAP = 8;
  private OX = (480 - this.SIZE * (this.CELL + this.GAP)) / 2; private OY = 130;
  private grid: number[][] = Array.from({ length: this.SIZE }, () => Array(this.SIZE).fill(0));
  private score = 0; private gameOver = false;
  private tileColors: Record<number, number> = {
    0: 0xcdc1b4, 2: 0xeee4da, 4: 0xede0c8, 8: 0xf2b179, 16: 0xf59563,
    32: 0xf67c5f, 64: 0xf65e3b, 128: 0xedcf72, 256: 0xedcc61, 512: 0xedc850,
    1024: 0xedc53f, 2048: 0xedc22e,
  };

  constructor() { super(); this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onInit, this); }

  private onInit() {
    const stage = this.stage!; stage.frameRate = 30; const root = this;

    const bg = new egret.Shape();
    bg.graphics.beginFill(0xbbada0); bg.graphics.drawRoundRect(this.OX - 6, this.OY - 6, this.SIZE * (this.CELL + this.GAP) + 4, this.SIZE * (this.CELL + this.GAP) + 4, 8, 8); bg.graphics.endFill();
    root.addChild(bg); this.objects.push(bg);

    const scoreLabel = new egret.TextField();
    scoreLabel.text = 'Score: 0'; scoreLabel.size = 22; scoreLabel.textColor = 0x776e65;
    scoreLabel.x = this.OX; scoreLabel.y = 96;
    root.addChild(scoreLabel); this.objects.push(scoreLabel);

    const title = new egret.TextField();
    title.text = '2048'; title.size = 48; title.textColor = 0x776e65; title.bold = true;
    title.textAlign = egret.HorizontalAlign.CENTER; title.x = 480/2 - 100; title.y = 26; title.width = 200;
    root.addChild(title); this.objects.push(title);

    this.addRandom(); this.addRandom(); this.drawGrid();

    // Start button — blocks input until clicked, then register controls
    const { onClick } = createStartButton(root, 480, 700, '2048');
    onClick.then(() => {
      const onKey = (e: KeyboardEvent) => {
        if (this.gameOver) return;
        if (e.key === 'ArrowLeft') this.move('left');
        else if (e.key === 'ArrowRight') this.move('right');
        else if (e.key === 'ArrowUp') this.move('up');
        else if (e.key === 'ArrowDown') this.move('down');
      };
      document.addEventListener('keydown', onKey);

      let sx = 0, sy = 0;
      stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (e) => { sx = e.stageX; sy = e.stageY; }, root);
      stage.addEventListener(egret.TouchEvent.TOUCH_END, (e) => {
        const dx = e.stageX - sx, dy = e.stageY - sy;
        const absDx = Math.abs(dx), absDy = Math.abs(dy);
        if (absDx < 20 && absDy < 20) return; // ignore taps
        if (absDx > absDy) this.move(dx > 0 ? 'right' : 'left');
        else this.move(dy > 0 ? 'down' : 'up');
      }, root);
    });
  }

  private drawGrid() {
    const old = this.getChildByName('grid');
    if (old && old.parent) old.parent.removeChild(old);
    const c = new egret.DisplayObjectContainer(); c.name = 'grid';
    this.addChildAt(c, 2); this.objects.push(c);

    for (let r = 0; r < this.SIZE; r++) for (let col = 0; col < this.SIZE; col++) {
      const v = this.grid[r][col];
      const x = this.OX + col * (this.CELL + this.GAP), y = this.OY + r * (this.CELL + this.GAP);
      const s = new egret.Shape();
      s.graphics.beginFill(this.tileColors[v] || 0xcdc1b4);
      s.graphics.drawRoundRect(x, y, this.CELL, this.CELL, 4, 4); s.graphics.endFill();
      c.addChild(s);
      if (v > 0) {
        const label = new egret.TextField();
        label.text = String(v); label.size = v < 128 ? 32 : v < 1024 ? 26 : 22;
        label.textColor = v <= 4 ? 0x776e65 : 0xffffff; label.bold = true;
        label.textAlign = egret.HorizontalAlign.CENTER; label.verticalAlign = egret.VerticalAlign.MIDDLE;
        label.x = x; label.y = y; label.width = this.CELL; label.height = this.CELL;
        c.addChild(label);
      }
    }
  }

  private addRandom() {
    const empty: [number, number][] = [];
    for (let r = 0; r < this.SIZE; r++) for (let c = 0; c < this.SIZE; c++) if (this.grid[r][c] === 0) empty.push([r, c]);
    if (empty.length > 0) { const [r, c] = empty[Math.floor(Math.random() * empty.length)]; this.grid[r][c] = Math.random() < 0.9 ? 2 : 4; }
  }

  private slide(line: number[]): number[] {
    const f = line.filter(v => v !== 0);
    for (let i = 0; i < f.length - 1; i++) { if (f[i] === f[i + 1]) { f[i] *= 2; this.score += f[i]; f.splice(i + 1, 1); } }
    while (f.length < this.SIZE) f.push(0);
    return f;
  }

  private move(dir: 'up' | 'down' | 'left' | 'right') {
    if (this.gameOver) return;
    let moved = false;
    for (let i = 0; i < this.SIZE; i++) {
      let line: number[];
      if (dir === 'left') line = this.slide(this.grid[i]);
      else if (dir === 'right') line = this.slide([...this.grid[i]].reverse()).reverse();
      else if (dir === 'up') line = this.slide([this.grid[0][i], this.grid[1][i], this.grid[2][i], this.grid[3][i]]);
      else line = this.slide([this.grid[3][i], this.grid[2][i], this.grid[1][i], this.grid[0][i]]).reverse();

      if (dir === 'left') { if (line.join() !== this.grid[i].join()) moved = true; this.grid[i] = line; }
      else if (dir === 'right') { if (line.join() !== this.grid[i].join()) moved = true; this.grid[i] = line; }
      else if (dir === 'up') { for (let r = 0; r < this.SIZE; r++) { if (line[r] !== this.grid[r][i]) moved = true; this.grid[r][i] = line[r]; } }
      else { for (let r = 0; r < this.SIZE; r++) { if (line[r] !== this.grid[3 - r][i]) moved = true; this.grid[3 - r][i] = line[r]; } }
    }
    if (moved) { this.addRandom(); this.drawGrid(); this.updateScore(); }
    const hasEmpty = this.grid.some(r => r.some(v => v === 0));
    let canMerge = false;
    for (let r = 0; r < this.SIZE; r++) for (let c = 0; c < this.SIZE - 1; c++)
      if (this.grid[r][c] === this.grid[r][c + 1] || (r < this.SIZE - 1 && this.grid[r][c] === this.grid[r + 1][c])) canMerge = true;
    if (!hasEmpty && !canMerge) { this.gameOver = true; this.showEnd(`Game Over\nScore: ${this.score}`, 0xdc2626); }
    if (this.grid.some(r => r.some(v => v === 2048))) { this.gameOver = true; this.showEnd(`You Win!\nScore: ${this.score}`, 0x059669); }
  }

  private updateScore() {
    const sl = this.getChildAt(this.objects.length > 3 ? 3 : 0) as egret.TextField;
    if (sl) sl.text = `Score: ${this.score}`;
  }

  private showEnd(msg: string, color: number) {
    const over = new egret.TextField();
    over.text = msg; over.size = 28; over.textColor = color; over.textAlign = egret.HorizontalAlign.CENTER;
    over.x = 480 / 2 - 100; over.y = 500; over.width = 200;
    this.addChild(over);
    this.stage!.addEventListener(egret.TouchEvent.TOUCH_TAP, () => location.reload(), this);
  }
}

(window as any).Main = Main;

// Call directly — DOMContentLoaded may have already fired with type=module
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => egret.runEgret({ renderMode: 'webgl' }));
} else {
  egret.runEgret({ renderMode: 'webgl' });
}

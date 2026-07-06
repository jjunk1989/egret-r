import { egret } from '@egret-r/core';
import '@egret-r/eui';
import '@egret-r/game';

const W = 480, H = 700;
const BULLET_SPEED = 8, ENEMY_SPEED = 1.5;
const SPAWN_INTERVAL = 50;

interface Bullet { x: number; y: number; shape: egret.Shape }
interface Enemy { x: number; y: number; shape: egret.Shape }

class Main extends egret.DisplayObjectContainer {
  private ship!: egret.Shape;
  private shipX = W / 2;
  private bullets: Bullet[] = [];
  private enemies: Enemy[] = [];
  private score = 0;
  private lives = 3;
  private running = false;
  private gameOver = false;
  private tick = 0;
  private scoreText!: egret.TextField;
  private gameLayer!: egret.DisplayObjectContainer;

  constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, () => {
      this.createScene();
      this.createShip();
      this.createUI();
      this.addEventListener(egret.Event.ENTER_FRAME, this.update, this);
      document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.code === 'Space') { e.preventDefault(); this.shoot(); }
      });
      document.addEventListener('mousemove', (e) => {
        if (this.running) this.shipX = e.clientX;
      });
      document.addEventListener('click', () => {
        if (this.gameOver) { this.restart(); return; }
        if (!this.running) { this.running = true; this.hideStart(); }
      });
    }, this);
  }

  private createScene(): void {
    const bg = new egret.Shape();
    bg.graphics.beginFill(0x0b1120);
    bg.graphics.drawRect(0, 0, W, H);
    bg.graphics.endFill();
    // Stars
    for (let i = 0; i < 40; i++) {
      bg.graphics.beginFill(0xffffff, 0.5 + Math.random() * 0.5);
      bg.graphics.drawCircle(Math.random() * W, Math.random() * H, 1 + Math.random());
      bg.graphics.endFill();
    }
    this.addChild(bg);
    this.gameLayer = new egret.DisplayObjectContainer();
    this.addChild(this.gameLayer);
  }

  private createShip(): void {
    this.ship = new egret.Shape();
    this.ship.graphics.beginFill(0x3b82f6);
    this.ship.moveTo(0, -16); this.ship.lineTo(14, 12); this.ship.lineTo(-14, 12); this.ship.lineTo(0, -16);
    this.ship.graphics.endFill();
    this.ship.graphics.beginFill(0x60a5fa);
    this.ship.moveTo(0, -8); this.ship.lineTo(8, 6); this.ship.lineTo(-8, 6); this.ship.lineTo(0, -8);
    this.ship.graphics.endFill();
    this.ship.x = this.shipX; this.ship.y = H - 60;
    this.gameLayer.addChild(this.ship);
  }

  private createUI(): void {
    this.scoreText = new egret.TextField();
    this.scoreText.text = 'Score: 0  Lives: 3';
    this.scoreText.size = 18; this.scoreText.textColor = 0xe2e8f0;
    this.scoreText.x = 20; this.scoreText.y = 10;
    this.addChild(this.scoreText);

    const hint = new egret.TextField();
    hint.text = 'Mouse to move  |  Click to shoot\nClick anywhere to Start';
    hint.size = 16; hint.textColor = 0x94a3b8;
    hint.textAlign = egret.HorizontalAlign.CENTER;
    hint.x = 0; hint.y = H / 2 - 20; hint.width = W;
    this.addChild(hint);
    setTimeout(() => { hint.visible = false; }, 5000);
  }

  private hideStart(): void { }

  private shoot(): void {
    if (!this.running) return;
    const bullet = new egret.Shape();
    bullet.graphics.beginFill(0xfbbf24);
    bullet.graphics.drawRect(-2, -6, 4, 12);
    bullet.graphics.endFill();
    bullet.x = this.shipX; bullet.y = this.ship.y - 20;
    this.gameLayer.addChild(bullet);
    this.bullets.push({ x: this.shipX, y: this.ship.y - 20, shape: bullet });
  }

  private spawnEnemy(): void {
    const enemy = new egret.Shape();
    enemy.graphics.beginFill(0xef4444);
    enemy.moveTo(0, 10); enemy.lineTo(-12, -8); enemy.lineTo(12, -8); enemy.lineTo(0, 10);
    enemy.graphics.endFill();
    const ex = 30 + Math.random() * (W - 60);
    enemy.x = ex; enemy.y = -20;
    this.gameLayer.addChild(enemy);
    this.enemies.push({ x: ex, y: -20, shape: enemy });
  }

  private update(): void {
    if (!this.running || this.gameOver) return;
    this.tick++;
    if (this.tick >= SPAWN_INTERVAL) { this.tick = 0; this.spawnEnemy(); }
    this.ship.x = this.shipX;

    // Bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.y -= BULLET_SPEED; b.shape.y = b.y;
      if (b.y < -20) { this.gameLayer.removeChild(b.shape); this.bullets.splice(i, 1); }
    }

    // Enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.y += ENEMY_SPEED; e.shape.y = e.y;
      if (e.y > H + 20) { this.gameLayer.removeChild(e.shape); this.enemies.splice(i, 1); continue; }

      // Collision with ship
      if (Math.abs(e.x - this.shipX) < 18 && Math.abs(e.y - (H - 60)) < 22) {
        this.gameLayer.removeChild(e.shape); this.enemies.splice(i, 1);
        this.lives--; this.scoreText.text = `Score: ${this.score}  Lives: ${this.lives}`;
        if (this.lives <= 0) this.endGame();
        continue;
      }

      // Collision with bullets
      for (let j = this.bullets.length - 1; j >= 0; j--) {
        const b = this.bullets[j];
        if (Math.abs(e.x - b.x) < 14 && Math.abs(e.y - b.y) < 16) {
          this.gameLayer.removeChild(e.shape); this.enemies.splice(i, 1);
          this.gameLayer.removeChild(b.shape); this.bullets.splice(j, 1);
          this.score += 10; this.scoreText.text = `Score: ${this.score}  Lives: ${this.lives}`;
          break;
        }
      }
    }
  }

  private endGame(): void {
    this.gameOver = true;
    const over = new egret.TextField();
    over.text = `Game Over\nScore: ${this.score}\nClick to Retry`;
    over.size = 28; over.textColor = 0xef4444; over.textAlign = egret.HorizontalAlign.CENTER;
    over.x = 0; over.y = H / 2 - 40; over.width = W;
    this.addChild(over);
  }

  private restart(): void {
    this.bullets.forEach(b => this.gameLayer.removeChild(b.shape));
    this.enemies.forEach(e => this.gameLayer.removeChild(e.shape));
    this.bullets = []; this.enemies = [];
    this.score = 0; this.lives = 3; this.tick = 0;
    this.gameOver = false; this.running = true;
    this.scoreText.text = 'Score: 0  Lives: 3';
    while (this.numChildren > 4) this.removeChildAt(this.numChildren - 1);
  }
}

(window as any).Main = Main;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => egret.runEgret({ renderMode: 'webgl' }));
} else {
  egret.runEgret({ renderMode: 'webgl' });
}

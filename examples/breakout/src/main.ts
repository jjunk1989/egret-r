import { egret } from '@egret-r/core';
import { eui } from '@egret-r/eui';
import '@egret-r/game';
import '@egret-r/tween';

// ── Simple Sound Engine ─────────────────────────────
class SoundEngine {
  private ctx: AudioContext | null = null;
  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext();
    return this.ctx;
  }
  private beep(freq: number, dur: number, type: OscillatorType = "square", vol = 0.08) {
    const ctx = this.getCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, ctx.currentTime);
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + dur);
    o.connect(g).connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + dur);
  }
  paddle() { this.beep(300, 0.08); }
  brick() { this.beep(600, 0.06, "square", 0.06); }
  wall() { this.beep(200, 0.05, "triangle", 0.05); }
  lose() {
    const ctx = this.getCtx();
    [300, 200, 100].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sawtooth"; o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.12);
      g.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.12);
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.12 + 0.15);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.12); o.stop(ctx.currentTime + i * 0.12 + 0.15);
    });
  }
}
const sfx = new SoundEngine();
import { createStartButton } from './startButton';

class Main extends egret.DisplayObjectContainer {
  private objects: egret.DisplayObject[] = [];
  private W = 480; private H = 700;
  private PADDLE_W = 80; private PADDLE_H = 14;
  private BALL_R = 6;
  private ROWS = 5; private COLS = 8;
  private BRICK_W = (this.W - 40) / this.COLS - 4; private BRICK_H = 22;
  private paddleX = this.W / 2;
  private ballX = this.W / 2; private ballY = this.H - 80;
  private ballVX = 3; private ballVY = -3;
  private score = 0; private lives = 3;
  private running = false;
  private bricks: boolean[][] = [];
  private brickColors = [0xdc2626, 0xf59e0b, 0x22c55e, 0x2563eb, 0x7c3aed];

  constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onInit, this);
  }

  private onInit() {
    const stage = this.stage!; const root = this;
    stage.frameRate = 60;
    for (let r = 0; r < this.ROWS; r++) { this.bricks[r] = []; for (let c = 0; c < this.COLS; c++) this.bricks[r][c] = true; }

    const scoreLabel = new egret.TextField();
    scoreLabel.text = 'Score: 0  Lives: 3'; scoreLabel.size = 18;
    scoreLabel.textColor = 0xe2e8f0; scoreLabel.x = 20; scoreLabel.y = 90;
    root.addChild(scoreLabel); this.objects.push(scoreLabel);

    const paddle = new egret.Shape();
    const drawPaddle = () => { const g = paddle.graphics; g.clear(); g.beginFill(0xe2e8f0); g.drawRoundRect(-this.PADDLE_W/2, -this.PADDLE_H/2, this.PADDLE_W, this.PADDLE_H, 6, 6); g.endFill(); };
    drawPaddle(); paddle.x = this.paddleX; paddle.y = this.H - 50;
    root.addChild(paddle); this.objects.push(paddle);

    const ball = new egret.Shape();
    ball.graphics.beginFill(0xef4444); ball.graphics.drawCircle(0, 0, this.BALL_R); ball.graphics.endFill();
    ball.x = this.ballX; ball.y = this.ballY;
    root.addChild(ball); this.objects.push(ball);

    const brickContainer = new egret.DisplayObjectContainer();
    root.addChild(brickContainer); this.objects.push(brickContainer);
    const drawBricks = () => {
      brickContainer.removeChildren();
      for (let r = 0; r < this.ROWS; r++) for (let c = 0; c < this.COLS; c++) {
        if (!this.bricks[r][c]) continue;
        const s = new egret.Shape(); s.graphics.beginFill(this.brickColors[r]);
        s.graphics.drawRoundRect(c * (this.BRICK_W + 4) + 20, r * (this.BRICK_H + 4) + 118, this.BRICK_W, this.BRICK_H, 3, 3); s.graphics.endFill();
        brickContainer.addChild(s);
      }
    };
    drawBricks();

    const { onClick } = createStartButton(root, this.W, this.H, 'Breakout');
    onClick.then(() => { this.running = true; });

    let mouseActive = false;
    stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, (e) => { mouseActive = true; this.paddleX = e.stageX; }, root);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { mouseActive = false; this.paddleX -= 8; }
      if (e.key === 'ArrowRight') { mouseActive = false; this.paddleX += 8; }
    });
    stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, (e) => { mouseActive = true; this.paddleX = e.stageX; }, root);

    const tick = () => {
      if (!this.running) return false;
      this.paddleX = Math.max(this.PADDLE_W / 2, Math.min(this.W - this.PADDLE_W / 2, this.paddleX));
      paddle.x = this.paddleX;
      this.ballX += this.ballVX; this.ballY += this.ballVY;
      ball.x = this.ballX; ball.y = this.ballY;

      if (this.ballX - this.BALL_R < 0 || this.ballX + this.BALL_R > this.W) { sfx.wall(); this.ballVX *= -1; }
      if (this.ballY - this.BALL_R < 0) { sfx.wall(); this.ballVY *= -1; }

      if (this.ballY + this.BALL_R > paddle.y - this.PADDLE_H / 2 && this.ballY - this.BALL_R < paddle.y + this.PADDLE_H / 2 &&
        this.ballX > this.paddleX - this.PADDLE_W / 2 && this.ballX < this.paddleX + this.PADDLE_W / 2 && this.ballVY > 0) {
        sfx.paddle();
        this.ballVY *= -1; this.ballVX += (this.ballX - this.paddleX) * 0.1;
      }

      if (this.ballY > this.H + 50) {
        sfx.lose(); this.lives--; scoreLabel.text = `Score: ${this.score}  Lives: ${this.lives}`;
        if (this.lives <= 0) return this.endGame('Game Over', this.score);
        this.ballX = this.W / 2; this.ballY = this.H - 80; this.ballVX = 3; this.ballVY = -3;
      }

      for (let r = 0; r < this.ROWS; r++) for (let c = 0; c < this.COLS; c++) {
        if (!this.bricks[r][c]) continue;
        const bx = c * (this.BRICK_W + 4) + 20, by = r * (this.BRICK_H + 4) + 118;
        if (this.ballX + this.BALL_R > bx && this.ballX - this.BALL_R < bx + this.BRICK_W &&
          this.ballY + this.BALL_R > by && this.ballY - this.BALL_R < by + this.BRICK_H) {
          sfx.brick(); this.bricks[r][c] = false; this.ballVY *= -1; this.score += 10;
          scoreLabel.text = `Score: ${this.score}  Lives: ${this.lives}`;
          drawBricks();
          if (this.bricks.every(row => row.every(b => !b))) return this.endGame('You Win!', this.score);
          break;
        }
      }
      return false;
    };
    egret.startTick(tick, this);
  }

  private endGame(title: string, score: number): boolean {
    this.running = false;
    const over = new egret.TextField();
    over.text = `${title}\nScore: ${score}\nClick to restart`;
    over.size = 28; over.textColor = 0xef4444; over.textAlign = egret.HorizontalAlign.CENTER;
    over.x = this.W / 2 - 100; over.y = this.H / 2 - 40; over.width = 200;
    this.addChild(over);
    this.stage!.addEventListener(egret.TouchEvent.TOUCH_TAP, () => location.reload(), this);
    return false;
  }
}

(window as any).Main = Main;

// Call directly — DOMContentLoaded may have already fired with type=module
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => egret.runEgret({ renderMode: 'webgl' }));
} else {
  egret.runEgret({ renderMode: 'webgl' });
}

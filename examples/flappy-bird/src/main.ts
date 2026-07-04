import { egret } from '@egret-r/core';
import { eui } from '@egret-r/eui';
import '@egret-r/game';
import '@egret-r/tween';

class Main extends egret.DisplayObjectContainer {
  private objects: egret.DisplayObject[] = [];
  private W = 480; private H = 700;
  private GRAVITY = 0.5; private FLAP = -7;
  private PIPE_W = 60; private PIPE_GAP = 140; private PIPE_SPEED = 2.5;
  private birdY = this.H / 2; private birdVY = 0;
  private score = 0; private running = true;
  private pipes: { x: number; topH: number; scored: boolean }[] = [];
  private pipeTimer = 0;

  constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onInit, this);
  }

  private onInit() {
    const stage = this.stage!;
    stage.frameRate = 60;
    const H = this.H, W = this.W, root = this;

    // Sky
    const sky = new egret.Shape();
    sky.graphics.beginFill(0x87ceeb); sky.graphics.drawRect(0, 0, W, H); sky.graphics.endFill();
    root.addChild(sky); this.objects.push(sky);

    // Ground
    const ground = new egret.Shape();
    ground.graphics.beginFill(0x8b7355); ground.graphics.drawRect(0, H - 40, W, 40); ground.graphics.endFill();
    root.addChild(ground); this.objects.push(ground);

    // Bird
    const bird = new egret.Shape();
    const drawBird = () => {
      const g = bird.graphics; g.clear();
      g.beginFill(0xf59e0b); g.drawCircle(0, 0, 16); g.endFill();
      g.beginFill(0xffffff); g.drawCircle(-3, -5, 5); g.endFill();
      g.beginFill(0x000000); g.drawCircle(-4, -6, 2); g.endFill();
      g.beginFill(0xff6600); g.moveTo(10, -2); g.lineTo(22, 0); g.lineTo(10, 2); g.endFill();
    };
    drawBird();
    bird.x = 80; bird.y = this.birdY;
    root.addChild(bird); this.objects.push(bird);

    // Score
    const scoreLabel = new egret.TextField();
    scoreLabel.text = '0'; scoreLabel.size = 48; scoreLabel.textColor = 0xffffff;
    scoreLabel.strokeColor = 0x333333; scoreLabel.stroke = 3;
    scoreLabel.x = W / 2 - 20; scoreLabel.y = 40; scoreLabel.textAlign = egret.HorizontalAlign.CENTER;
    root.addChild(scoreLabel); this.objects.push(scoreLabel);

    // Pipes container
    const pipeContainer = new egret.DisplayObjectContainer();
    root.addChild(pipeContainer); this.objects.push(pipeContainer);

    const onTap = () => {
      if (!this.running) return;
      this.birdVY = this.FLAP;
    };
    stage.addEventListener(egret.TouchEvent.TOUCH_TAP, onTap, root);

    const tick = () => {
      if (!this.running) return false;
      this.birdVY += this.GRAVITY;
      this.birdY += this.birdVY;
      bird.y = this.birdY;

      if (this.birdY > H - 56) return this.endGame('Game Over', this.score);
      if (this.birdY < 0) this.birdY = 0;

      this.pipeTimer++;
      if (this.pipeTimer > 80) {
        this.pipeTimer = 0;
        this.pipes.push({ x: W + 20, topH: 60 + Math.random() * (H - this.PIPE_GAP - 160), scored: false });
      }
      for (let i = this.pipes.length - 1; i >= 0; i--) {
        const p = this.pipes[i];
        p.x -= this.PIPE_SPEED;
        if (p.x < -this.PIPE_W) { this.pipes.splice(i, 1); continue; }
        if (!p.scored && p.x + this.PIPE_W < bird.x) { p.scored = true; this.score++; scoreLabel.text = String(this.score); }
        if (bird.x + 16 > p.x && bird.x - 16 < p.x + this.PIPE_W) {
          if (this.birdY - 16 < p.topH || this.birdY + 16 > p.topH + this.PIPE_GAP)
            return this.endGame('Game Over', this.score);
        }
      }
      pipeContainer.removeChildren();
      this.pipes.forEach(p => {
        const s = new egret.Shape();
        s.graphics.beginFill(0x22c55e); s.graphics.drawRect(p.x, 0, this.PIPE_W, p.topH); s.graphics.endFill();
        s.graphics.beginFill(0x16a34a); s.graphics.drawRect(p.x - 4, p.topH - 30, this.PIPE_W + 8, 30); s.graphics.endFill();
        s.graphics.beginFill(0x22c55e); s.graphics.drawRect(p.x, p.topH + this.PIPE_GAP, this.PIPE_W, H - p.topH - this.PIPE_GAP); s.graphics.endFill();
        s.graphics.beginFill(0x16a34a); s.graphics.drawRect(p.x - 4, p.topH + this.PIPE_GAP, this.PIPE_W + 8, 30); s.graphics.endFill();
        pipeContainer.addChild(s);
      });
      return false;
    };
    egret.startTick(tick, root);
  }

  private endGame(title: string, score: number): boolean {
    this.running = false;
    const over = new egret.TextField();
    over.text = `${title}\nScore: ${score}\nClick to restart`;
    over.size = 28; over.textColor = 0xdc2626; over.strokeColor = 0xffffff; over.stroke = 2;
    over.lineSpacing = 8; over.textAlign = egret.HorizontalAlign.CENTER;
    over.x = this.W / 2 - 100; over.y = this.H / 2 - 60; over.width = 200;
    this.addChild(over);
    this.stage!.addEventListener(egret.TouchEvent.TOUCH_TAP, () => location.reload(), this);
    return false;
  }
}

window.Main = Main;
window.addEventListener('DOMContentLoaded', () => {
  egret.runEgret({ renderMode: 'webgl' });
});

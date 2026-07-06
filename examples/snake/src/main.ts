import { egret } from '@egret-r/core';
import '@egret-r/eui';
import '@egret-r/game';
import { createStartButton } from './startButton';

const COLS = 20, ROWS = 20;
const CELL = 24;
const OX = (480 - COLS * CELL) / 2, OY = 80;
const SPEED = 8; // frames per move
const HEAD_COLOR = 0x22c55e, BODY_COLOR = 0x16a34a, FOOD_COLOR = 0xef4444;

class Main extends egret.DisplayObjectContainer {
  private snake: { x: number; y: number }[] = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  private food = { x: 15, y: 10 };
  private dir = { x: 1, y: 0 };
  private nextDir = { x: 1, y: 0 };
  private tick = 0;
  private score = 0;
  private running = false;
  private gameOver = false;
  private scoreText!: egret.TextField;
  private gameLayer!: egret.DisplayObjectContainer;
  private uiLayer!: egret.DisplayObjectContainer;

  constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, () => {
      this.createScene();
      this.createUI();
      this.spawnFood();
      this.draw();
      this.addEventListener(egret.Event.ENTER_FRAME, this.update, this);
      const { onClick } = createStartButton(this, 480, 700, 'Snake');
      onClick.then(() => { this.running = true; this.hideStart(); });
      document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (this.gameOver) { if (e.code === 'Space') this.restart(); return; }
        if (!this.running) return;
        if (e.key === 'ArrowUp' && this.dir.y !== 1) this.nextDir = { x: 0, y: -1 };
        if (e.key === 'ArrowDown' && this.dir.y !== -1) this.nextDir = { x: 0, y: 1 };
        if (e.key === 'ArrowLeft' && this.dir.x !== 1) this.nextDir = { x: -1, y: 0 };
        if (e.key === 'ArrowRight' && this.dir.x !== -1) this.nextDir = { x: 1, y: 0 };
      });
    }, this);
  }

  private createScene(): void {
    const bg = new egret.Shape();
    bg.graphics.beginFill(0x0f172a);
    bg.graphics.drawRect(OX - 4, OY - 4, COLS * CELL + 8, ROWS * CELL + 8);
    bg.graphics.endFill();
    this.addChild(bg);
    this.gameLayer = new egret.DisplayObjectContainer();
    this.addChild(this.gameLayer);
    this.uiLayer = new egret.DisplayObjectContainer();
    this.addChild(this.uiLayer);
  }

  private createUI(): void {
    this.scoreText = new egret.TextField();
    this.scoreText.text = 'Score: 0';
    this.scoreText.size = 20; this.scoreText.textColor = 0xe2e8f0;
    this.scoreText.x = OX; this.scoreText.y = OY - 36;
    this.addChild(this.scoreText);

    const hint = new egret.TextField();
    hint.text = 'Press Arrow Keys to Start';
    hint.size = 18; hint.textColor = 0x94a3b8;
    hint.textAlign = egret.HorizontalAlign.CENTER;
    hint.x = 0; hint.y = OY + ROWS * CELL + 20; hint.width = 480;
    this.addChild(hint);
    this.uiLayer.addChild(hint);
    setTimeout(() => { hint.visible = false; }, 4000);
  }

  private hideStart(): void {
    while (this.uiLayer.numChildren > 0) this.uiLayer.removeChildAt(0);
  }

  private spawnFood(): void {
    const occupied = new Set(this.snake.map(s => `${s.x},${s.y}`));
    const free: { x: number; y: number }[] = [];
    for (let x = 0; x < COLS; x++) for (let y = 0; y < ROWS; y++) {
      if (!occupied.has(`${x},${y}`)) free.push({ x, y });
    }
    if (free.length > 0) this.food = free[Math.floor(Math.random() * free.length)];
  }

  private update(): void {
    if (!this.running || this.gameOver) return;
    this.tick++;
    if (this.tick < SPEED) return;
    this.tick = 0;
    this.dir = this.nextDir;

    const head = this.snake[0];
    const nx = head.x + this.dir.x, ny = head.y + this.dir.y;

    if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) { this.endGame(); return; }
    if (this.snake.some(s => s.x === nx && s.y === ny)) { this.endGame(); return; }

    this.snake.unshift({ x: nx, y: ny });
    if (nx === this.food.x && ny === this.food.y) {
      this.score += 10; this.scoreText.text = `Score: ${this.score}`;
      this.spawnFood();
    } else {
      this.snake.pop();
    }
    this.draw();
  }

  private draw(): void {
    this.gameLayer.removeChildren();
    for (let i = 0; i < this.snake.length; i++) {
      const s = this.snake[i];
      const cell = new egret.Shape();
      cell.graphics.beginFill(i === 0 ? HEAD_COLOR : BODY_COLOR);
      cell.graphics.drawRoundRect(OX + s.x * CELL + 1, OY + s.y * CELL + 1, CELL - 2, CELL - 2, 4, 4);
      cell.graphics.endFill();
      this.gameLayer.addChild(cell);
    }
    const foodShape = new egret.Shape();
    foodShape.graphics.beginFill(FOOD_COLOR);
    foodShape.graphics.drawCircle(OX + this.food.x * CELL + CELL / 2, OY + this.food.y * CELL + CELL / 2, CELL / 2 - 2);
    foodShape.graphics.endFill();
    this.gameLayer.addChild(foodShape);
  }

  private endGame(): void {
    this.gameOver = true;
    const over = new egret.TextField();
    over.text = `Game Over\nScore: ${this.score}\nPress Space to Retry`;
    over.size = 24; over.textColor = 0xef4444; over.textAlign = egret.HorizontalAlign.CENTER;
    over.x = 0; over.y = 350; over.width = 480;
    this.addChild(over);
  }

  private restart(): void {
    this.snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    this.dir = { x: 1, y: 0 }; this.nextDir = { x: 1, y: 0 };
    this.score = 0; this.tick = 0; this.gameOver = false; this.running = true;
    this.scoreText.text = 'Score: 0';
    this.spawnFood(); this.draw();
    while (this.numChildren > 3) this.removeChildAt(this.numChildren - 1);
  }
}

(window as any).Main = Main;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => egret.runEgret({ renderMode: 'webgl' }));
} else {
  egret.runEgret({ renderMode: 'webgl' });
}

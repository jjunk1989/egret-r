/**
 * Mini-Game Demos — complete playable games
 */
import { egret } from '@egret-r/core';
import { eui } from '@egret-r/eui';
import { Tween, Ease } from '@egret-r/tween';
import type { TestCaseDefinition } from './types';

// ─── Flappy Bird ───────────────────────────────────────────────

function flappyBird({ root, stage }: { root: egret.DisplayObjectContainer; stage: egret.Stage }): () => void {
  const objects: egret.DisplayObject[] = [];
  const W = stage.stageWidth;
  const H = stage.stageHeight;
  const GRAVITY = 0.5;
  const FLAP = -7;
  const PIPE_W = 60;
  const PIPE_GAP = 140;
  const PIPE_SPEED = 2.5;

  let birdY = H / 2;
  let birdVY = 0;
  let score = 0;
  let running = true;

  // Sky
  const sky = new egret.Shape();
  sky.graphics.beginFill(0x87ceeb);
  sky.graphics.drawRect(0, 0, W, H);
  sky.graphics.endFill();
  root.addChild(sky); objects.push(sky);

  // Ground
  const ground = new egret.Shape();
  ground.graphics.beginFill(0x8b7355);
  ground.graphics.drawRect(0, H - 40, W, 40);
  ground.graphics.endFill();
  root.addChild(ground); objects.push(ground);

  // Bird
  const bird = new egret.Shape();
  const drawBird = () => {
    const g = bird.graphics;
    g.clear();
    g.beginFill(0xf59e0b);
    g.drawCircle(0, 0, 16);
    g.endFill();
    g.beginFill(0xffffff);
    g.drawCircle(-3, -5, 5);
    g.endFill();
    g.beginFill(0x000000);
    g.drawCircle(-4, -6, 2);
    g.endFill();
    g.beginFill(0xff6600);
    g.moveTo(10, -2); g.lineTo(22, 0); g.lineTo(10, 2);
    g.endFill();
  };
  drawBird();
  bird.x = 80; bird.y = birdY;
  root.addChild(bird); objects.push(bird);

  // Pipes
  const pipes: { x: number; topH: number; scored: boolean }[] = [];
  let pipeTimer = 0;
  const pipeContainer = new egret.DisplayObjectContainer();
  root.addChild(pipeContainer); objects.push(pipeContainer);

  // Score
  const scoreLabel = new eui.Label();
  scoreLabel.text = '0';
  scoreLabel.size = 48;
  scoreLabel.textColor = 0xffffff;
  scoreLabel.strokeColor = 0x333333;
  scoreLabel.stroke = 3;
  scoreLabel.x = W / 2 - 20;
  scoreLabel.y = 40;
  root.addChild(scoreLabel); objects.push(scoreLabel);

  // Tap to start
  const startTip = new eui.Label();
  startTip.text = 'Click to Flap!';
  startTip.size = 24;
  startTip.textColor = 0xffffff;
  startTip.strokeColor = 0x333333;
  startTip.stroke = 2;
  startTip.x = W / 2 - 80;
  startTip.y = H / 2 - 30;
  root.addChild(startTip); objects.push(startTip);

  const onTap = () => {
    if (!running) return;
    birdVY = FLAP;
    if (startTip.parent) { startTip.parent.removeChild(startTip); }
  };
  stage.addEventListener(egret.TouchEvent.TOUCH_TAP, onTap, root);

  const tick = () => {
    if (!running) return false;
    birdVY += GRAVITY;
    birdY += birdVY;
    bird.y = birdY;

    // Ground collision
    if (birdY > H - 56) {
      running = false;
      const over = new eui.Label();
      over.text = `Game Over\nScore: ${score}\nClick to restart`;
      over.size = 28; over.textColor = 0xdc2626; over.strokeColor = 0xffffff; over.stroke = 2;
      over.lineSpacing = 8; over.textAlign = egret.HorizontalAlign.CENTER;
      over.x = W / 2 - 100; over.y = H / 2 - 60; over.width = 200;
      root.addChild(over); objects.push(over);
      stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, onTap, root);
      stage.addEventListener(egret.TouchEvent.TOUCH_TAP, () => location.reload(), root);
    }
    if (birdY < 0) birdY = 0;

    // Pipes
    pipeTimer++;
    if (pipeTimer > 80) {
      pipeTimer = 0;
      const topH = 60 + Math.random() * (H - PIPE_GAP - 160);
      pipes.push({ x: W + 20, topH, scored: false });
    }
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].x -= PIPE_SPEED;
      if (pipes[i].x < -PIPE_W) { pipes.splice(i, 1); continue; }
      if (!pipes[i].scored && pipes[i].x + PIPE_W < bird.x) {
        pipes[i].scored = true;
        score++;
        scoreLabel.text = String(score);
      }
      // Collision
      const px = pipes[i].x;
      const topH = pipes[i].topH;
      if (bird.x + 16 > px && bird.x - 16 < px + PIPE_W) {
        if (bird.y - 16 < topH || bird.y + 16 > topH + PIPE_GAP) {
          running = false;
          const over = new eui.Label();
          over.text = `Game Over\nScore: ${score}\nClick to restart`;
          over.size = 28; over.textColor = 0xdc2626; over.strokeColor = 0xffffff; over.stroke = 2;
          over.lineSpacing = 8; over.textAlign = egret.HorizontalAlign.CENTER;
          over.x = W / 2 - 100; over.y = H / 2 - 60; over.width = 200;
          root.addChild(over); objects.push(over);
          stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, onTap, root);
          stage.addEventListener(egret.TouchEvent.TOUCH_TAP, () => location.reload(), root);
        }
      }
    }
    // Re-draw pipes
    pipeContainer.removeChildren();
    pipes.forEach(p => {
      const s = new egret.Shape();
      s.graphics.beginFill(0x22c55e); s.graphics.drawRect(p.x, 0, PIPE_W, p.topH); s.graphics.endFill();
      s.graphics.beginFill(0x16a34a); s.graphics.drawRect(p.x - 4, p.topH - 30, PIPE_W + 8, 30); s.graphics.endFill();
      s.graphics.beginFill(0x22c55e); s.graphics.drawRect(p.x, p.topH + PIPE_GAP, PIPE_W, H - p.topH - PIPE_GAP); s.graphics.endFill();
      s.graphics.beginFill(0x16a34a); s.graphics.drawRect(p.x - 4, p.topH + PIPE_GAP, PIPE_W + 8, 30); s.graphics.endFill();
      pipeContainer.addChild(s);
    });

    return false;
  };
  egret.startTick(tick, root);

  return () => {
    egret.stopTick(tick, root);
    stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, onTap, root);
    objects.forEach(o => { try { root.removeChild(o); } catch (_) {} });
  };
}

// ─── Breakout ──────────────────────────────────────────────────

function breakoutGame({ root, stage }: { root: egret.DisplayObjectContainer; stage: egret.Stage }): () => void {
  const objects: egret.DisplayObject[] = [];
  const W = stage.stageWidth;
  const H = stage.stageHeight;
  const PADDLE_W = 80; const PADDLE_H = 14;
  const BALL_R = 6;
  const ROWS = 5; const COLS = 8;
  const BRICK_W = (W - 40) / COLS - 4; const BRICK_H = 22;

  let paddleX = W / 2;
  let ballX = W / 2, ballY = H - 80;
  let ballVX = 3, ballVY = -3;
  let score = 0, lives = 3;
  let running = false;
  const bricks: boolean[][] = [];

  // Bricks
  for (let r = 0; r < ROWS; r++) {
    bricks[r] = [];
    for (let c = 0; c < COLS; c++) bricks[r][c] = true;
  }
  const brickColors = [0xdc2626, 0xf59e0b, 0x22c55e, 0x2563eb, 0x7c3aed];

  // Score
  const scoreLabel = new eui.Label();
  scoreLabel.text = 'Score: 0  Lives: 3';
  scoreLabel.size = 18; scoreLabel.textColor = 0x1e293b;
  scoreLabel.x = 20; scoreLabel.y = 90;
  root.addChild(scoreLabel); objects.push(scoreLabel);

  // Paddle
  const paddle = new egret.Shape();
  const drawPaddle = () => { const g = paddle.graphics; g.clear(); g.beginFill(0x1e293b); g.drawRoundRect(-PADDLE_W/2, -PADDLE_H/2, PADDLE_W, PADDLE_H, 6, 6); g.endFill(); };
  drawPaddle();
  paddle.x = paddleX; paddle.y = H - 50;
  root.addChild(paddle); objects.push(paddle);

  // Ball
  const ball = new egret.Shape();
  ball.graphics.beginFill(0xdc2626); ball.graphics.drawCircle(0, 0, BALL_R); ball.graphics.endFill();
  ball.x = ballX; ball.y = ballY;
  root.addChild(ball); objects.push(ball);

  // Brick container
  const brickContainer = new egret.DisplayObjectContainer();
  root.addChild(brickContainer); objects.push(brickContainer);

  const drawBricks = () => {
    brickContainer.removeChildren();
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        if (!bricks[r][c]) continue;
        const s = new egret.Shape();
        s.graphics.beginFill(brickColors[r]); s.graphics.drawRoundRect(c * (BRICK_W + 4) + 20, r * (BRICK_H + 4) + 118, BRICK_W, BRICK_H, 3, 3); s.graphics.endFill();
        brickContainer.addChild(s);
      }
  };
  drawBricks();

  // Start tip
  const tip = new eui.Label();
  tip.text = '← → Arrow keys or move mouse\nClick to start';
  tip.size = 14; tip.textColor = 0x64748b; tip.lineSpacing = 4; tip.textAlign = egret.HorizontalAlign.CENTER;
  tip.x = W / 2 - 130; tip.y = H / 2 + 40; tip.width = 260;
  root.addChild(tip); objects.push(tip);

  let mouseActive = false;
  const onMouse = (e: egret.TouchEvent) => { mouseActive = true; paddleX = e.stageX; };
  stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, onMouse, root);
  document.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') { mouseActive = false; paddleX -= 8; } if (e.key === 'ArrowRight') { mouseActive = false; paddleX += 8; } });
  stage.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { if (!running) { running = true; if (tip.parent) tip.parent.removeChild(tip); } }, root);

  const tick = () => {
    if (!running) return false;
    paddleX = Math.max(PADDLE_W / 2, Math.min(W - PADDLE_W / 2, paddleX));
    paddle.x = paddleX;
    ballX += ballVX; ballY += ballVY;
    ball.x = ballX; ball.y = ballY;

    // Wall bounces
    if (ballX - BALL_R < 0 || ballX + BALL_R > W) ballVX *= -1;
    if (ballY - BALL_R < 0) ballVY *= -1;

    // Paddle bounce
    if (ballY + BALL_R > paddle.y - PADDLE_H / 2 && ballY - BALL_R < paddle.y + PADDLE_H / 2 &&
      ballX > paddleX - PADDLE_W / 2 && ballX < paddleX + PADDLE_W / 2 && ballVY > 0) {
      ballVY *= -1;
      ballVX += (ballX - paddleX) * 0.1;
    }

    // Miss
    if (ballY > H) {
      lives--;
      scoreLabel.text = `Score: ${score}  Lives: ${lives}`;
      if (lives <= 0) {
        running = false;
        const over = new eui.Label();
        over.text = `Game Over\nScore: ${score}\nClick to restart`;
        over.size = 28; over.textColor = 0xdc2626; over.textAlign = egret.HorizontalAlign.CENTER;
        over.x = W / 2 - 100; over.y = H / 2 - 40; over.width = 200;
        root.addChild(over); objects.push(over);
        stage.addEventListener(egret.TouchEvent.TOUCH_TAP, () => location.reload(), root);
      }
      ballX = W / 2; ballY = H - 80; ballVX = 3; ballVY = -3;
    }

    // Brick collision
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        if (!bricks[r][c]) continue;
        const bx = c * (BRICK_W + 4) + 20, by = r * (BRICK_H + 4) + 118;
        if (ballX + BALL_R > bx && ballX - BALL_R < bx + BRICK_W &&
          ballY + BALL_R > by && ballY - BALL_R < by + BRICK_H) {
          bricks[r][c] = false; ballVY *= -1; score += 10;
          scoreLabel.text = `Score: ${score}  Lives: ${lives}`;
          drawBricks();
          const allGone = bricks.every(row => row.every(b => !b));
          if (allGone) {
            running = false;
            const win = new eui.Label();
            win.text = `You Win!\nScore: ${score}\nClick to restart`;
            win.size = 28; win.textColor = 0x059669; win.textAlign = egret.HorizontalAlign.CENTER;
            win.x = W / 2 - 100; win.y = H / 2 - 40; win.width = 200;
            root.addChild(win); objects.push(win);
            stage.addEventListener(egret.TouchEvent.TOUCH_TAP, () => location.reload(), root);
          }
          break;
        }
      }

    return false;
  };
  egret.startTick(tick, root);

  return () => {
    egret.stopTick(tick, root);
    stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, onMouse, root);
    objects.forEach(o => { try { root.removeChild(o); } catch (_) {} });
  };
}

// ─── 2048 ──────────────────────────────────────────────────────

function game2048({ root, stage }: { root: egret.DisplayObjectContainer; stage: egret.Stage }): () => void {
  const objects: egret.DisplayObject[] = [];
  const W = stage.stageWidth;
  const SIZE = 4;
  const CELL = 80; const GAP = 8;
  const OX = (W - SIZE * (CELL + GAP)) / 2;
  const OY = 130;
  const tileColors: Record<number, number> = { 0: 0xcdc1b4, 2: 0xeee4da, 4: 0xede0c8, 8: 0xf2b179, 16: 0xf59563, 32: 0xf67c5f, 64: 0xf65e3b, 128: 0xedcf72, 256: 0xedcc61, 512: 0xedc850, 1024: 0xedc53f, 2048: 0xedc22e };

  let grid: number[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  let score = 0;
  let gameOver = false;

  const drawGrid = () => {
    const c = new egret.DisplayObjectContainer();
    c.name = 'grid';
    const old = root.getChildByName('grid');
    if (old && old.parent) old.parent.removeChild(old);
    root.addChildAt(c, 0); objects.push(c);

    for (let r = 0; r < SIZE; r++)
      for (let col = 0; col < SIZE; col++) {
        const v = grid[r][col];
        const x = OX + col * (CELL + GAP), y = OY + r * (CELL + GAP);
        const bg = new egret.Shape();
        bg.graphics.beginFill(tileColors[v] || tileColors[0]);
        bg.graphics.drawRoundRect(x, y, CELL, CELL, 6, 6);
        bg.graphics.endFill();
        c.addChild(bg);
        if (v > 0) {
          const label = new egret.TextField();
          label.text = String(v);
          label.size = v < 128 ? 32 : v < 1024 ? 26 : 22;
          label.textColor = v <= 4 ? 0x776e65 : 0xffffff;
          label.bold = true;
          label.textAlign = egret.HorizontalAlign.CENTER;
          label.verticalAlign = egret.VerticalAlign.MIDDLE;
          label.x = x; label.y = y; label.width = CELL; label.height = CELL;
          c.addChild(label);
        }
      }
  };

  const scoreLabel = new eui.Label();
  scoreLabel.text = 'Score: 0';
  scoreLabel.size = 22; scoreLabel.textColor = 0x1e293b;
  scoreLabel.x = OX; scoreLabel.y = 96;
  root.addChild(scoreLabel); objects.push(scoreLabel);

  let moved = false;
  const addRandom = () => {
    const empty: [number, number][] = [];
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (grid[r][c] === 0) empty.push([r, c]);
    if (empty.length > 0) {
      const [r, c] = empty[Math.floor(Math.random() * empty.length)];
      grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const slide = (line: number[]): number[] => {
    const filtered = line.filter(v => v !== 0);
    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2; score += filtered[i]; moved = true;
        filtered.splice(i + 1, 1);
      }
    }
    while (filtered.length < SIZE) filtered.push(0);
    return filtered;
  };

  const move = (dir: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;
    moved = false;
    const old = grid.map(r => [...r]);
    for (let i = 0; i < SIZE; i++) {
      let line: number[];
      if (dir === 'left') line = slide(grid[i]);
      else if (dir === 'right') line = slide([...grid[i]].reverse()).reverse();
      else if (dir === 'up') line = slide([grid[0][i], grid[1][i], grid[2][i], grid[3][i]]);
      else line = slide([grid[3][i], grid[2][i], grid[1][i], grid[0][i]]).reverse();

      if (dir === 'left') grid[i] = line;
      else if (dir === 'right') grid[i] = line;
      else if (dir === 'up') { for (let r = 0; r < SIZE; r++) grid[r][i] = line[r]; }
      else { for (let r = 0; r < SIZE; r++) grid[3 - r][i] = line[r]; }
    }
    if (moved) { addRandom(); drawGrid(); scoreLabel.text = `Score: ${score}`; }
    // Check game over
    const hasEmpty = grid.some(r => r.some(v => v === 0));
    let canMerge = false;
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE - 1; c++) if (grid[r][c] === grid[r][c + 1] || (r < SIZE - 1 && grid[r][c] === grid[r + 1][c])) canMerge = true;
    if (!hasEmpty && !canMerge) {
      gameOver = true;
      const over = new eui.Label();
      over.text = `Game Over\nScore: ${score}\nClick to restart`;
      over.size = 28; over.textColor = 0xdc2626; over.textAlign = egret.HorizontalAlign.CENTER;
      over.x = W / 2 - 100; over.y = H / 2 + 40; over.width = 200;
      root.addChild(over); objects.push(over);
      stage.addEventListener(egret.TouchEvent.TOUCH_TAP, () => location.reload(), root);
    }
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') move('left');
    else if (e.key === 'ArrowRight') move('right');
    else if (e.key === 'ArrowUp') move('up');
    else if (e.key === 'ArrowDown') move('down');
  };
  document.addEventListener('keydown', onKey);

  // Touch swipe
  let sx = 0, sy = 0;
  stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (e) => { sx = e.stageX; sy = e.stageY; }, root);
  stage.addEventListener(egret.TouchEvent.TOUCH_END, (e) => {
    const dx = e.stageX - sx, dy = e.stageY - sy;
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 20 ? 'right' : dx < -20 ? 'left' : 'up');
    else move(dy > 20 ? 'down' : dy < -20 ? 'up' : 'right');
  }, root);

  addRandom(); addRandom();
  drawGrid();

  return () => {
    document.removeEventListener('keydown', onKey);
    objects.forEach(o => { try { root.removeChild(o); } catch (_) {} });
  };
}

// ─── Export ────────────────────────────────────────────────────

export const gameDemos: TestCaseDefinition[] = [
  {
    id: 'game-flappy',
    title: '🎮 Flappy Bird — Tap to fly',
    module: 'game-demo',
    run: flappyBird,
  },
  {
    id: 'game-breakout',
    title: '🎮 Breakout — Brick breaker',
    module: 'game-demo',
    run: breakoutGame,
  },
  {
    id: 'game-2048',
    title: '🎮 2048 — Merge tiles',
    module: 'game-demo',
    run: game2048,
  },
];

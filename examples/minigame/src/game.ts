// Flappy Bird — Egret Engine R Mini Game (Multi-Platform)
import { egret } from '@egret-r/core';
import '@egret-r/game';

// ── Game Constants ──────────────────────────────────
const GAME_W = 480;
const GAME_H = 700;
const BIRD_W = 34;
const BIRD_H = 26;
const GRAVITY = 0.35;
const FLAP_VEL = -6.5;
const PIPE_W = 60;
const PIPE_GAP = 180;
const PIPE_SPEED = 3;
const PIPE_SPAWN_INTERVAL = 120;
const GROUND_H = 80;

// ── Pipe Data Type ──────────────────────────────────
interface PipePair {
    x: number; topH: number; bottomY: number;
    topPipe: egret.Shape; bottomPipe: egret.Shape;
    scored: boolean; disposed: boolean;
}

// ── Main Game Class ─────────────────────────────────
class Main extends egret.DisplayObjectContainer {
    private bird!: egret.Shape;
    private birdVy = 0;
    private birdY = 250;
    private pipes: PipePair[] = [];
    private pipeTimer = 0;
    private score = 0;
    private scoreText!: egret.TextField;
    private gameState: 'idle' | 'playing' | 'over' = 'idle';
    private gameLayer!: egret.DisplayObjectContainer;
    private uiLayer!: egret.DisplayObjectContainer;
    private startBtn!: egret.TextField;
    private groundStrip!: egret.Shape;
    private clouds: egret.Shape[] = [];
    private frameCount = 0;
    private _uiBaseCount = 0;

    constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, () => {
            const stage = this.stage!;
            const sw = stage.$stageWidth, sh = stage.$stageHeight;
            // Full-screen background (fills letterbox area)
            const stageBg = new egret.Shape();
            stageBg.graphics.beginFill(0x1a2a3a);
            stageBg.graphics.drawRect(0, 0, sw, sh);
            stageBg.graphics.endFill();
            stage.addChildAt(stageBg, 0);
            // Scale game to fill screen
            const scale = Math.min(sw / GAME_W, sh / GAME_H);
            this.scaleX = this.scaleY = scale;
            this.x = (sw - GAME_W * scale) / 2;
            this.y = (sh - GAME_H * scale) / 2;
            this.createScene();
            this.createBird();
            this.createStartButton();
            this.createScore();
            this.touchEnabled = true;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTap, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this.update, this);
            this._uiBaseCount = this.uiLayer.numChildren;
        }, this);
    }

    private createScene(): void {
        const sky = new egret.Shape();
        sky.graphics.beginFill(0x4ec0ca);
        sky.graphics.drawRect(0, 0, GAME_W, GAME_H);
        sky.graphics.endFill();
        this.addChild(sky);
        this.createClouds();
        this.gameLayer = new egret.DisplayObjectContainer(); this.addChild(this.gameLayer);
        this.uiLayer = new egret.DisplayObjectContainer(); this.addChild(this.uiLayer);
        const ground = new egret.Shape();
        ground.graphics.beginFill(0xded895);
        ground.graphics.drawRect(0, GAME_H - GROUND_H, GAME_W, GROUND_H);
        ground.graphics.endFill();
        this.gameLayer.addChild(ground);
        this.groundStrip = new egret.Shape();
        this.drawGroundStrip(0);
        this.gameLayer.addChild(this.groundStrip);
    }

    private createClouds(): void {
        for (let i = 0; i < 3; i++) {
            const cloud = new egret.Shape();
            const cx = Math.random() * GAME_W, cy = 30 + Math.random() * 120, cw = 50 + Math.random() * 50;
            cloud.graphics.beginFill(0xffffff, 0.6);
            cloud.graphics.drawEllipse(0, 0, cw, 25);
            cloud.graphics.endFill();
            cloud.graphics.beginFill(0xffffff, 0.5);
            cloud.graphics.drawEllipse(cw * 0.3, -10, cw * 0.5, 20);
            cloud.graphics.endFill();
            cloud.x = cx; cloud.y = cy;
            this.addChild(cloud); this.clouds.push(cloud);
        }
    }

    private drawGroundStrip(offset: number): void {
        const g = this.groundStrip.graphics; g.clear();
        const y = GAME_H - GROUND_H;
        g.beginFill(0x7ec850);
        for (let x = -offset % 24; x < GAME_W + 24; x += 24) g.drawRect(x, y, 12, 3);
        g.endFill();
        g.beginFill(0x5a8f30); g.drawRect(0, y + 3, GAME_W, 2); g.endFill();
    }

    private createBird(): void {
        this.bird = new egret.Shape();
        this.drawBird(0);
        this.bird.x = 80; this.bird.y = this.birdY;
        this.gameLayer.addChild(this.bird);
    }

    private drawBird(rotation: number): void {
        const g = this.bird.graphics; g.clear();
        g.beginFill(0xf5c842); g.drawRoundRect(0, 0, BIRD_W, BIRD_H, 6, 6); g.endFill();
        g.beginFill(0xffffff); g.drawCircle(BIRD_W - 8, 8, 5); g.endFill();
        g.beginFill(0x000000); g.drawCircle(BIRD_W - 6, 8, 2.5); g.endFill();
        g.beginFill(0xff6b35);
        g.moveTo(BIRD_W, 11); g.lineTo(BIRD_W + 8, 13); g.lineTo(BIRD_W, 16);
        g.endFill();
        this.bird.rotation = rotation;
    }

    private createStartButton(): void {
        this.startBtn = new egret.TextField();
        this.startBtn.text = '▶ TAP TO START';
        this.startBtn.size = 22; this.startBtn.textColor = 0xffffff; this.startBtn.bold = true;
        this.startBtn.strokeColor = 0x333333; this.startBtn.stroke = 2;
        this.startBtn.textAlign = egret.HorizontalAlign.CENTER;
        this.startBtn.width = GAME_W; this.startBtn.y = GAME_H * 0.45;
        this.uiLayer.addChild(this.startBtn);
        const hint = new egret.TextField();
        hint.text = 'Tap anywhere to flap'; hint.size = 16; hint.textColor = 0xdddddd;
        hint.textAlign = egret.HorizontalAlign.CENTER; hint.width = GAME_W; hint.y = GAME_H * 0.52;
        this.uiLayer.addChild(hint);
        setTimeout(() => { hint.visible = false; }, 3000);
    }

    private createScore(): void {
        this.scoreText = new egret.TextField();
        this.scoreText.size = 48; this.scoreText.textColor = 0xffffff;
        this.scoreText.strokeColor = 0x000000; this.scoreText.stroke = 3; this.scoreText.bold = true;
        this.scoreText.textAlign = egret.HorizontalAlign.CENTER;
        this.scoreText.width = GAME_W; this.scoreText.y = 60;
        this.scoreText.text = '0'; this.scoreText.visible = false;
        this.uiLayer.addChild(this.scoreText);
    }

    private update(): void {
        this.frameCount++;
        for (const cloud of this.clouds) {
            cloud.x -= 0.8;
            if (cloud.x < -120) { cloud.x = GAME_W + 20; cloud.y = 30 + Math.random() * 120; }
        }
        const bobX = Math.sin(this.frameCount * 0.1) * 4;
        const bobY = Math.sin(this.frameCount * 0.08) * 2;
        this.bird.x = 80 + bobX;
        if (this.gameState === 'idle') {
            this.bird.y = this.birdY + bobY;
            this.bird.rotation = Math.sin(this.frameCount * 0.06) * 8;
        }
        if (this.gameState !== 'playing') return;

        this.drawGroundStrip((this.frameCount * PIPE_SPEED) % 24);
        this.birdVy += GRAVITY; this.birdY += this.birdVy; this.bird.y = this.birdY;
        this.bird.rotation = Math.max(-30, Math.min(60, this.birdVy * 6));

        if (this.birdY < -BIRD_H || this.birdY > GAME_H - GROUND_H - BIRD_H) { this.gameOver(); return; }

        this.pipeTimer++;
        if (this.pipeTimer >= PIPE_SPAWN_INTERVAL) { this.pipeTimer = 0; this.spawnPipe(); }

        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const p = this.pipes[i];
            p.x -= PIPE_SPEED; p.topPipe.x = p.x; p.bottomPipe.x = p.x;
            if (!p.scored && p.x + PIPE_W < this.bird.x) {
                p.scored = true; this.score++;
                this.scoreText.text = String(this.score);
                egret.playTone(600, 80); setTimeout(() => egret.playTone(900, 80), 80);
            }
            if (this.checkCollision(p)) { this.gameOver(); return; }
            if (p.x < -PIPE_W) {
                this.gameLayer.removeChild(p.topPipe); this.gameLayer.removeChild(p.bottomPipe);
                p.disposed = true; this.pipes.splice(i, 1);
            }
        }
    }

    private spawnPipe(): void {
        const screenMid = (GAME_H - GROUND_H) / 2;
        const gapCenter = screenMid + (Math.random() - 0.5) * 200;
        const topH = Math.max(30, Math.min(GAME_H - GROUND_H - PIPE_GAP - 30, gapCenter - PIPE_GAP / 2));

        const topPipe = new egret.Shape();
        topPipe.graphics.beginFill(0xe67e22); topPipe.graphics.drawRect(0, 0, PIPE_W, topH); topPipe.graphics.endFill();
        topPipe.graphics.beginFill(0xf39c12); topPipe.graphics.drawRect(PIPE_W - 5, 0, 5, topH); topPipe.graphics.endFill();
        topPipe.graphics.beginFill(0xd35400); topPipe.graphics.drawRect(-4, topH - 24, PIPE_W + 8, 24); topPipe.graphics.endFill();
        topPipe.graphics.beginFill(0xe67e22); topPipe.graphics.drawRect(-4, topH - 24, PIPE_W + 8, 5); topPipe.graphics.endFill();
        topPipe.x = GAME_W; topPipe.y = 0; this.gameLayer.addChild(topPipe);

        const bottomY = topH + PIPE_GAP;
        const bottomH = GAME_H - GROUND_H - bottomY;
        const bottomPipe = new egret.Shape();
        bottomPipe.graphics.beginFill(0xe67e22); bottomPipe.graphics.drawRect(0, 0, PIPE_W, bottomH); bottomPipe.graphics.endFill();
        bottomPipe.graphics.beginFill(0xf39c12); bottomPipe.graphics.drawRect(PIPE_W - 5, 0, 5, bottomH); bottomPipe.graphics.endFill();
        bottomPipe.graphics.beginFill(0xd35400); bottomPipe.graphics.drawRect(-4, 0, PIPE_W + 8, 24); bottomPipe.graphics.endFill();
        bottomPipe.graphics.beginFill(0xe67e22); bottomPipe.graphics.drawRect(-4, 19, PIPE_W + 8, 5); bottomPipe.graphics.endFill();
        bottomPipe.x = GAME_W; bottomPipe.y = bottomY; this.gameLayer.addChild(bottomPipe);

        this.pipes.push({ x: GAME_W, topH, bottomY, topPipe, bottomPipe, scored: false, disposed: false });
    }

    private checkCollision(p: PipePair): boolean {
        if (p.disposed) return false;
        const bx = this.bird.x, by = this.bird.y;
        return (
            bx + BIRD_W > p.x && bx < p.x + PIPE_W &&
            (by + BIRD_H > 0 && by < p.topH || by + BIRD_H > p.bottomY && by < GAME_H - GROUND_H)
        );
    }

    private onTap(): void {
        if (this.gameState === 'idle') { this.startGame(); return; }
        if (this.gameState === 'over') { this.restart(); return; }
        egret.playTone(400, 80);
        this.birdVy = FLAP_VEL;
    }

    private startGame(): void {
        this.gameState = 'playing'; this.startBtn.visible = false;
        this.scoreText.visible = true; this.scoreText.text = '0'; this.score = 0;
        this.birdVy = FLAP_VEL;
    }

    private gameOver(): void {
        egret.playTone(300, 150); setTimeout(() => egret.playTone(200, 150), 150);
        this.gameState = 'over';
        for (const p of this.pipes) {
            if (!p.disposed) { this.gameLayer.removeChild(p.topPipe); this.gameLayer.removeChild(p.bottomPipe); p.disposed = true; }
        }
        this.pipes = []; this.pipeTimer = 0;

        const overlay = new egret.Shape();
        overlay.graphics.beginFill(0x000000, 0.4); overlay.graphics.drawRect(0, 0, GAME_W, GAME_H); overlay.graphics.endFill();
        this.uiLayer.addChild(overlay);

        const goText = new egret.TextField();
        goText.text = 'GAME OVER'; goText.size = 40; goText.textColor = 0xff4444; goText.bold = true;
        goText.strokeColor = 0x000000; goText.stroke = 3;
        goText.textAlign = egret.HorizontalAlign.CENTER; goText.width = GAME_W; goText.y = GAME_H * 0.3;
        this.uiLayer.addChild(goText);

        const scoreLabel = new egret.TextField();
        scoreLabel.text = `Score: ${this.score}`; scoreLabel.size = 28; scoreLabel.textColor = 0xffffff;
        scoreLabel.strokeColor = 0x000000; scoreLabel.stroke = 2;
        scoreLabel.textAlign = egret.HorizontalAlign.CENTER; scoreLabel.width = GAME_W; scoreLabel.y = GAME_H * 0.42;
        this.uiLayer.addChild(scoreLabel);

        const retryText = new egret.TextField();
        retryText.text = 'TAP TO RETRY'; retryText.size = 20; retryText.textColor = 0xffcc00; retryText.bold = true;
        retryText.textAlign = egret.HorizontalAlign.CENTER; retryText.width = GAME_W; retryText.y = GAME_H * 0.55;
        this.uiLayer.addChild(retryText);
    }

    private restart(): void {
        while (this.uiLayer.numChildren > this._uiBaseCount) this.uiLayer.removeChildAt(this.uiLayer.numChildren - 1);
        this.scoreText.visible = true; this.scoreText.text = '0'; this.score = 0;
        this.birdY = 250; this.bird.y = this.birdY; this.bird.x = 80;
        this.birdVy = 0; this.bird.rotation = 0;
        this.frameCount = 0; this.pipes = []; this.pipeTimer = 0;
        this.startGame();
    }
}

// ── Entry ───────────────────────────────────────────
(globalThis as any).Main = Main;
egret.startMiniGame({ entryClass: 'Main' });

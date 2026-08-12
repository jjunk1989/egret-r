// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

/**
 * Mini-game platform entry point.
 * Sets up rendering, touch, lifecycle and starts the engine.
 *
 * Usage in mini-game project:
 *   import { runMiniGame } from "@egret-r/core/wx";
 *   runMiniGame({ entryClass: "Main" });
 *
 * Or access via namespace:
 *   egret.runMiniGame({ entryClass: "Main" });
 */

import { registerPlatform } from "../platform/PlatformRegistry";
import { WxAdapter } from "../platform/WxAdapter";
import { TtAdapter, KsAdapter, QqAdapter } from "../platform/OtherAdapters";
import { getPlatform } from "../platform/PlatformRegistry";
import { Stage } from "../display/Stage";
import { Player } from "../player/Player";
import { DisplayList } from "../player/DisplayList";
import { TouchHandler } from "../player/TouchHandler";
import { customHitTestBuffer, canvasHitTestBuffer, setCustomHitTestBuffer, setCanvasHitTestBuffer } from "../player/RenderBuffer";
import { systemRenderer, canvasRenderer, setSystemRenderer, setCanvasRenderer } from "../player/SystemRenderer";

/**
 * Options for running a mini-game.
 */
export interface MiniGameOptions {
  /** 入口类构造器引用（推荐）或类名字符串（向后兼容） */
  entryClass?: string | (new (...args: any[]) => any);
  /** Render mode: "webgl" | "canvas" */
  renderMode?: "webgl" | "canvas";
  /** Content width (default: screen width) */
  contentWidth?: number;
  /** Content height (default: screen height) */
  contentHeight?: number;
}

/**
 * Initialize and run a mini-game.
 * Must be called once at startup.
 */
export function runMiniGame(options: MiniGameOptions = {}): void {
  const adapter = getPlatform();

  // --- Setup sys hooks for mini-game canvas ---
  // Ensure egret namespace is initialized (IIFE header does this, but be safe)
  const g = globalThis as any;
  if (!g.egret) g.egret = {};
  if (!g.egret.sys) g.egret.sys = {};
  const sys = g.egret.sys;

  // Hook canvas creation (used by CanvasRenderBuffer and engine internals)
  const sharedCanvas = adapter.createCanvas();
  (globalThis as any).canvas = sharedCanvas;

  sys.createCanvas = function (_width?: number, _height?: number) {
    // Create a new canvas for 2D operations (not the WebGL main canvas)
    return adapter.createCanvas();
  };

  // mainCanvas is used by WebGLRenderContext to get the main surface
  sys.mainCanvas = function (_width?: number, _height?: number) {
    if (!sharedCanvas.addEventListener) {
      sharedCanvas.addEventListener = function () { /* no-op */ };
      sharedCanvas.removeEventListener = function () { /* no-op */ };
    }
    // ★ Fix A: 真机按传入物理尺寸设置 canvas；devtools 模拟器保持逻辑尺寸
    const __plat = (adapter as any).platformId || '';
    const __isDev = __plat === 'devtools';
    if (!__isDev && _width && _width !== sharedCanvas.width) sharedCanvas.width = _width;
    if (!__isDev && _height && _height !== sharedCanvas.height) sharedCanvas.height = _height;
    return sharedCanvas;
  };

  // WebGL context getter for mini-games
  sys.getContextWebGL = function (canvas: any) {
    return canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  };

  sys.createCanvasRenderBufferSurface = function (
    createCanvasFn: any,
    width: number | undefined,
    height: number | undefined,
    _root: boolean | undefined
  ) {
    const canvas = typeof createCanvasFn === "function"
      ? createCanvasFn(width, height)
      : sharedCanvas;
    if (width) canvas.width = width;
    if (height) canvas.height = height;
    return canvas;
  };

  // === Text measurement: mini-games need a 2D context ===
  const measureCanvas = adapter.createCanvas();
  const measureCtx = measureCanvas.getContext('2d');
  sys.measureTextWith = function (ctx: any, text: string): number {
    if (ctx && ctx.measureText) return ctx.measureText(text).width;
    if (measureCtx) {
      measureCtx.font = ctx?.font || '16px sans-serif';
      return measureCtx.measureText(text).width;
    }
    return text.length * 8; // fallback estimate
  };

  // === Storage: override localStorage with mini-game storage ===
  // ★ Fix D: 有平台存储 API 就强制覆盖（即使 localStorage 已定义）
  // iOS 微信沙箱提供真实 localStorage 但其 getItem 同步挂起
  const _hasStorageApi = typeof adapter.getStorageSync === 'function';
  if (_hasStorageApi) {
    (globalThis as any).localStorage = {
      getItem: (key: string) => adapter.getStorageSync(key),
      setItem: (key: string, value: string) => { try { adapter.setStorageSync(key, value); } catch (_) {} },
      removeItem: (key: string) => { try { adapter.removeStorageSync(key); } catch (_) {} },
      clear: () => { /* no-op */ },
      get length() { return 0; },
      key: (_index: number) => null,
    };
  }

  // === Network: override XMLHttpRequest with mini-game HTTP ===
  if (typeof XMLHttpRequest === "undefined") {
    (globalThis as any).XMLHttpRequest = createMiniGameXHR(adapter);
  }

  // === Audio: set up mini-game sound system ===
  setupMiniGameAudio(adapter, sys);

  // === Renderer ===
  // systemRenderer: real WebGL for display
  // canvasRenderer: mock for hit-test (avoids WebGL issues)
  if (!systemRenderer && (globalThis as any).egret?.WebGLRenderer) {
    const RendererClass = (globalThis as any).egret.WebGLRenderer;
    setSystemRenderer(new RendererClass());
  }
  if (!canvasRenderer) {
    const dummy: any = {
      render() {}, drawNodeToBuffer() {},
    };
    setCanvasRenderer(dummy);
  }

  // --- Get screen info ---
  const info = adapter.getSystemInfo();
  const dpr = info.pixelRatio || 1;
  // ★ Fix B: 真机渲染放大 dpr 倍（devtools 保持 1x）
  const __plat2 = (adapter as any).platformId || info.platform || '';
  const __isDev2 = __plat2 === 'devtools';
  if (!__isDev2) {
    try {
      DisplayList.$canvasScaleFactor = dpr;
      DisplayList.$setCanvasScale(dpr, dpr);
    } catch (_) {}
  }
  const cw = options.contentWidth || sharedCanvas.width || info.screenWidth;
  const ch = options.contentHeight || sharedCanvas.height || info.screenHeight;
  // ★ Fix C: 物理尺寸（RenderBuffer 用）
  const pw = __isDev2 ? cw : Math.ceil(cw * dpr);
  const ph = __isDev2 ? ch : Math.ceil(ch * dpr);

  // --- Create Stage ---
  const stage = new Stage();
  stage.$screen = {
    updateScreenSize() {},
    updateMaxTouches() {},
    setContentSize() {},
    screenWidth: info.screenWidth,
    screenHeight: info.screenHeight,
    pixelRatio: info.pixelRatio,
  } as any;
  stage.$stageWidth = cw;
  stage.$stageHeight = ch;
  stage.frameRate = 60;

  // --- Create RenderBuffer using engine's WebGL pipeline ---
  const RenderBufferClass = (globalThis as any).egret?.WebGLRenderBuffer || (globalThis as any).egret?.CanvasRenderBuffer;

  let buffer: any;
  if (RenderBufferClass) {
    sys.RenderBuffer = RenderBufferClass;
    buffer = new RenderBufferClass(pw, ph, true);  // ★ Fix C: 物理尺寸
  } else {
    // Fallback: minimal buffer
    const gl = sharedCanvas.getContext('webgl') || sharedCanvas.getContext('experimental-webgl');
    if (!gl) throw new Error('WebGL not available');
    buffer = {
      surface: sharedCanvas, context: gl, width: cw, height: ch,
      resize(w: number, h: number) { this.width = w; this.height = h; },
      getPixels() { return []; }, toDataURL() { return ''; },
      clear() { gl.clear(gl.COLOR_BUFFER_BIT); }, destroy() {},
    };
  }

  // Set up hit-test buffer — MUST be separate from main buffer!
  // Hit-testing calls resize(3,3) which would shrink the main canvas.
  const hitTestCanvas = adapter.createCanvas();
  const hitTestGl = hitTestCanvas.getContext('webgl') || hitTestCanvas.getContext('experimental-webgl');
  const hitBuffer: any = {
    surface: hitTestCanvas, context: hitTestGl, width: 3, height: 3,
    resize(w: number, h: number) { this.width = w; this.height = h; },
    getPixels() { return []; }, toDataURL() { return ''; },
    clear() { hitTestGl?.clear(hitTestGl.COLOR_BUFFER_BIT); }, destroy() {},
  };
  setCustomHitTestBuffer(hitBuffer);
  setCanvasHitTestBuffer(hitBuffer);

  // --- Create Player ---
  const player = new Player(buffer, stage, options.entryClass || 'Main');
  (stage as any).$player = player;
  player.start();

  // --- Touch Handler ---
  const touchHandler = new TouchHandler(stage);
  touchHandler.$initMaxTouches();

const handleTouchEvent = (type: string) => (e: any) => {
    // Use changedTouches only — contains just the touches that triggered this event
    const touches = e.changedTouches || e.touches || [];
    for (let i = 0; i < touches.length; i++) {
      const t = touches[i];
      const tx = t.clientX ?? t.x ?? t.pageX ?? 0;
      const ty = t.clientY ?? t.y ?? t.pageY ?? 0;
      const id = t.identifier ?? i;
      if (type === 'begin') touchHandler.onTouchBegin(tx, ty, id);
      else if (type === 'move') touchHandler.onTouchMove(tx, ty, id);
      else if (type === 'end') touchHandler.onTouchEnd(tx, ty, id);
    }
  };

  adapter.onTouchStart(handleTouchEvent('begin'));
  adapter.onTouchMove(handleTouchEvent('move'));
  adapter.onTouchEnd(handleTouchEvent('end'));
  adapter.onTouchCancel(handleTouchEvent('end'));

  // --- Lifecycle ---
  adapter.onShow?.(() => {
    const s = (globalThis as any).egret?.sys;
    if (s?.$ticker) s.$ticker.resume();
  });
  adapter.onHide?.(() => {
    const s = (globalThis as any).egret?.sys;
    if (s?.$ticker) s.$ticker.pause();
  });

  // --- Entry Class ---
  // Player.initialize() will create the entry class via egret.getDefinitionByName()
  // Don't add it here — let the engine handle it.

  // --- Frame Loop ---
  function loop(): void {
    adapter.requestAnimationFrame(loop);
    const s = (globalThis as any).egret?.sys;
    if (s?.$ticker) s.$ticker.update();
  }
  loop();

  adapter.log("Mini-game started (" + adapter.platformId + ") "
    + cw + "x" + ch);
}

// === Mini-Game XMLHttpRequest Polyfill ===
function createMiniGameXHR(adapter: any): any {
  return class MiniGameXHR {
    private _url = "";
    private _method = "GET";
    private _headers: Record<string, string> = {};
    private _data: any = null;
    private _responseType = "";
    private _readyState = 0;
    private _status = 0;
    private _response: any = null;

    public onload: (() => void) | null = null;
    public onerror: (() => void) | null = null;
    public onprogress: ((e: any) => void) | null = null;
    public onreadystatechange: (() => void) | null = null;

    public UNSENT = 0; public OPENED = 1;
    public HEADERS_RECEIVED = 2; public LOADING = 3; public DONE = 4;

    get readyState() { return this._readyState; }
    get status() { return this._status; }
    get response(): any { return this._response; }
    get responseText(): string {
      return typeof this._response === "string" ? this._response : "";
    }
    get responseURL(): string { return this._url; }

    open(method: string, url: string) {
      this._method = method;
      this._url = url;
      this._readyState = 1;
      this.onreadystatechange?.();
    }

    setRequestHeader(key: string, value: string) {
      this._headers[key] = value;
    }

    set responseType(type: string) { this._responseType = type; }
    get responseType() { return this._responseType; }

    send(data?: any) {
      this._data = data;
      this._readyState = 2;
      this.onreadystatechange?.();

      const requestTask = (globalThis as any).wx?.request?.({
        url: this._url,
        method: this._method as any,
        header: this._headers,
        data: this._data,
        responseType: this._responseType || "text",
        success: (res: any) => {
          this._status = res.statusCode || 200;
          this._response = this._responseType === "arraybuffer"
            ? res.data
            : (typeof res.data === "string" ? res.data : JSON.stringify(res.data));
          this._readyState = 4;
          this.onreadystatechange?.();
          this.onload?.();
        },
        fail: (_err: any) => {
          this._status = 0;
          this._readyState = 4;
          this.onreadystatechange?.();
          this.onerror?.();
        },
      });
    }

    abort() { this._readyState = 4; }
    getAllResponseHeaders() { return ""; }
    getResponseHeader(_key: string) { return null; }
    overrideMimeType(_mime: string) { /* no-op */ }
    addEventListener(_type: string, _handler: any) { /* no-op */ }
    removeEventListener(_type: string, _handler: any) { /* no-op */ }
  };
}

// === Mini-Game Audio System ===
function setupMiniGameAudio(adapter: any, sys: any): void {
  // Override the sound creation hook
  sys.createSound = function (url: string) {
    const audio = adapter.createInnerAudioContext();
    audio.src = url;
    audio.autoplay = false;
    return {
      _audio: audio,
      _url: url,
      _loaded: false,

      load(url: string) {
        this._url = url;
        this._audio.src = url;
        this._loaded = false;
        return this;
      },

      play(startTime?: number, loops?: number) {
        const a = this._audio;
        if (startTime !== undefined) a.seek(startTime);
        a.loop = loops === 0; // 0 = infinite loop
        a.play();
      },

      stop() { this._audio.stop(); },
      pause() { this._audio.pause(); },

      get volume(): number { return this._audio.volume; },
      set volume(v: number) { this._audio.volume = v; },

      get position(): number { return this._audio.currentTime || 0; },

      addEventListener(type: string, handler: any) {
        if (type === "canplaythrough") this._audio.onCanplay(() => { this._loaded = true; handler(); });
        else if (type === "error") this._audio.onError(handler);
        else if (type === "ended") this._audio.onEnded(handler);
      },

      removeEventListener(_type: string, _handler: any) { /* no-op */ },
    };
  };
}

/**
 * Shortcut: register platform + run in one call.
 */
export function startMiniGame(options: MiniGameOptions = {}): void {
  const g = globalThis as any;
  if (g.wx) registerPlatform(new WxAdapter());
  else if (g.tt) registerPlatform(new TtAdapter());
  else if (g.ks) registerPlatform(new KsAdapter());
  else if (g.qq) registerPlatform(new QqAdapter());
  else throw new Error("No mini-game platform detected (wx/tt/ks/qq global not found)");
  runMiniGame(options);
}

/**
 * Play a simple tone (beep) across all platforms.
 * Uses Web Audio API on browser, file-based WAV playback on mini-games.
 * @param frequency Tone frequency in Hz (e.g. 440 = A4)
 * @param duration Duration in milliseconds (e.g. 100)
 */
export function playTone(frequency: number, duration: number): void {
  getPlatform().playTone(frequency, duration);
}

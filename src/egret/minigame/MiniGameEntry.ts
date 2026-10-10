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
import { AlipayAdapter } from "../platform/AlipayAdapter";
import { getPlatform } from "../platform/PlatformRegistry";
import { Stage } from "../display/Stage";
import { Player } from "../player/Player";
import { DisplayList } from "../player/DisplayList";
import { TouchHandler } from "../player/TouchHandler";
import { customHitTestBuffer, canvasHitTestBuffer, setCustomHitTestBuffer, setCanvasHitTestBuffer } from "../player/RenderBuffer";
import { systemRenderer, canvasRenderer, setSystemRenderer, setCanvasRenderer } from "../player/SystemRenderer";
import { WebGLRenderer } from "../web/rendering/webgl/WebGLRenderer";

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
  /**
   * 开发者工具（模拟器）里的渲染倍率，默认 2；设成 1 可关掉。
   *
   * 模拟器没有 dpr 概念 —— getSystemInfoSync() 报的是 pixelRatio 1，引擎照它按
   * 1x 渲染；但模拟器最后一定还要把这块画布缩放显示（实测抖音工具把 393px 的逻辑屏
   * 显示成 359px，缩放 0.913）。1x 的画面再被缩放，小字和 1px 描边就会明显发虚，
   * 而真机（dpr 2~3）是清楚的 —— 结果就是"模拟器看着糊、真机正常"。
   *
   * 这里在模拟器上按 devRenderScale 超采样：画布背板按放大后的物理尺寸绘制，
   * CSS 尺寸钉回逻辑像素，由浏览器降采样显示，预览清晰度就和真机一致。
   * 真机不受影响，仍然用 dpr。
   */
  devRenderScale?: number;
}

/** 模拟器默认超采样倍率（真机按 dpr 渲染，与这个值无关） */
const DEFAULT_DEV_RENDER_SCALE = 2;
/** 超采样上限：再高对预览没有收益，只会拖慢模拟器 */
const MAX_DEV_RENDER_SCALE = 3;

/**
 * Initialize and run a mini-game.
 * Must be called once at startup.
 */
export function runMiniGame(options: MiniGameOptions = {}): void {
  const adapter = getPlatform();

  // === Mini-game Image polyfill ===
  // Mini-game devices have no global Image constructor, but the engine's Web
  // ImageLoader hard-codes `new Image()`.
  // Alipay's Image fires onload WITHOUT an event argument (e=undefined), which
  // crashes the engine's e.target read — wrap its onload/onerror to always
  // provide { target: img }. Other platforms (wx/tt/ks/qq) manage the onload
  // property internally: redefining it there would BREAK their event pipeline
  // (images never report loaded), so they get the raw platform Image.
  // NOTE: use instanceof instead of platformId check — on the Alipay simulator
  // the adapter reports platformId='devtools', not 'my'.
  if (
    typeof (globalThis as any).Image === "undefined" &&
    typeof adapter.createImage === "function"
  ) {
    const createImage = adapter.createImage.bind(adapter);
    const wrapEvents = adapter instanceof AlipayAdapter;
    (globalThis as any).Image = function ImagePolyfill() {
      const img = createImage();
      if (wrapEvents) {
        wrapMiniImageEvent(img, "onload");
        wrapMiniImageEvent(img, "onerror");
      }
      return img;
    };
  }

  // --- Setup sys hooks for mini-game canvas ---
  // Ensure egret namespace is initialized (IIFE header does this, but be safe)
  const g = globalThis as any;
  if (!g.egret) g.egret = {};
  if (!g.egret.sys) g.egret.sys = {};
  const sys = g.egret.sys;

  // Hook canvas creation (used by CanvasRenderBuffer and engine internals)
  const sharedCanvas = adapter.createCanvas();
  (globalThis as any).canvas = sharedCanvas;

  // --- 屏幕信息 / 渲染倍率 ---
  // 真机：dpr 就是物理像素比，按 dpr 放大渲染。
  // 模拟器：getSystemInfoSync() 报 pixelRatio 1，但画布最终会被开发者工具缩放显示，
  //         1x 的画面被缩放后小字和细描边会发虚，所以按 devRenderScale 超采样
  //         （见 MiniGameOptions.devRenderScale 的说明）。
  // 只有"能钉 CSS 尺寸"的画布才敢超采样：背板放大后如果没人把 CSS 尺寸钉回逻辑像素，
  // canvas 元素会按背板尺寸撑开显示 —— 画面变大，触摸坐标（CSS px）也会和舞台坐标对不上。
  const info = adapter.getSystemInfo();
  const dpr = info.pixelRatio || 1;
  const devtoolsPlatform =
    (adapter as any).platformId === "devtools" || info.platform === "devtools";
  const canPinCssSize = !!(sharedCanvas as any).style;
  const supersampleDevtools = devtoolsPlatform && canPinCssSize;
  const renderScale = supersampleDevtools
    ? Math.min(
        MAX_DEV_RENDER_SCALE,
        Math.max(dpr, options.devRenderScale ?? DEFAULT_DEV_RENDER_SCALE)
      )
    : dpr;

  const cw = options.contentWidth || sharedCanvas.width || info.screenWidth;
  const ch = options.contentHeight || sharedCanvas.height || info.screenHeight;
  const pw = Math.ceil(cw * renderScale);
  const ph = Math.ceil(ch * renderScale);

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
    // 按传入的物理尺寸设置画布背板（真机 = 逻辑尺寸 × dpr；模拟器 = 逻辑尺寸 × 渲染倍率）
    if (_width && _width !== sharedCanvas.width) sharedCanvas.width = _width;
    if (_height && _height !== sharedCanvas.height) sharedCanvas.height = _height;
    // 超采样时把 CSS 尺寸钉回逻辑像素，让浏览器把放大的背板缩回来显示。
    // 这同时保证触摸坐标（CSS px）能对上舞台坐标：CSS 尺寸 == 舞台尺寸。
    if (renderScale !== 1 && (sharedCanvas as any).style) {
      (sharedCanvas as any).style.width = cw + "px";
      (sharedCanvas as any).style.height = ch + "px";
    }
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
  // WebGLRenderer is statically imported (not looked up via globalThis.egret)
  // so tree-shaking can keep it in the bundle.
  if (!systemRenderer) {
    setSystemRenderer(new WebGLRenderer());
  }
  if (!canvasRenderer) {
    const dummy: any = {
      render() {}, drawNodeToBuffer() {},
    };
    setCanvasRenderer(dummy);
  }

  // --- 渲染倍率落到引擎（屏幕信息 / cw / ch / pw / ph 在上面已经算好）---
  // 真机 = dpr（和改动前一致）；模拟器 = devRenderScale，用来抵消"画布还要被缩放显示"。
  try {
    DisplayList.$canvasScaleFactor = renderScale;
    DisplayList.$setCanvasScale(renderScale, renderScale);
  } catch (_) {}

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
/** Wrap mini-game Image onload/onerror: missing event argument gets a fake { target } */
function wrapMiniImageEvent(img: any, prop: "onload" | "onerror"): void {
  let handler: ((e?: any) => void) | null = null;
  try {
    Object.defineProperty(img, prop, {
      configurable: true,
      enumerable: true,
      get: () => handler,
      set: (fn: any) => {
        handler = typeof fn === "function"
          ? (e?: any) => fn(e ?? { target: img, type: prop === "onload" ? "load" : "error" })
          : fn;
      },
    });
  } catch (_) {
    /* some platforms may not allow redefining Image event props — keep native behavior */
  }
}

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

      const g: any = globalThis;
      const api = (adapter as any)?.api || g.wx || g.tt || g.ks || g.qq || g.my;
      const isAlipay = (adapter as any)?.platformId === "my" || api === g.my;
      const requestOptions: any = {
        url: this._url,
        method: this._method as any,
        data: this._data,
        success: (res: any) => {
          this._status = isAlipay ? (res.status ?? 200) : (res.statusCode ?? 200);
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
      };
      if (isAlipay) {
        // my.request: `headers` (not `header`), `dataType` (not `responseType`)
        requestOptions.headers = this._headers;
        requestOptions.dataType = this._responseType === "arraybuffer" ? "arraybuffer" : "text";
      } else {
        requestOptions.header = this._headers;
        requestOptions.responseType = this._responseType || "text";
      }
      const requestTask = api?.request?.(requestOptions);
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
  else if (g.my) registerPlatform(new AlipayAdapter());
  else throw new Error("No mini-game platform detected (wx/tt/ks/qq/my global not found)");
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

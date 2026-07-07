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
import { ticker, SystemTicker } from "../player/SystemTicker";
import { TouchHandler } from "../player/TouchHandler";

/**
 * Options for running a mini-game.
 */
export interface MiniGameOptions {
  /** Entry class name (e.g. "Main", "Game") */
  entryClass?: string;
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
  // Override canvas creation to use platform adapter
  if (!(globalThis as any).sys) (globalThis as any).sys = {};
  const sys = (globalThis as any).sys;

  // Hook canvas creation (used by CanvasRenderBuffer and engine internals)
  const sharedCanvas = adapter.createCanvas();
  (globalThis as any).canvas = sharedCanvas;

  sys.createCanvas = function (_width?: number, _height?: number) {
    // Mini-game: always return the shared main canvas
    // Width/height are managed via resize
    return sharedCanvas;
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

  // === Storage: override localStorage with mini-game storage ===
  if (typeof localStorage === "undefined") {
    (globalThis as any).localStorage = {
      getItem: (key: string) => adapter.getStorageSync(key),
      setItem: (key: string, value: string) => { adapter.setStorageSync(key, value); },
      removeItem: (key: string) => { adapter.removeStorageSync(key); },
      clear: () => { /* no-op: mini-game storage can't be cleared */ },
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

  // --- Get screen info ---
  const info = adapter.getSystemInfo();
  const cw = options.contentWidth || info.screenWidth;
  const ch = options.contentHeight || info.screenHeight;

  // --- Create Stage ---
  const stage = new Stage();
  stage.$screen = {
    screenWidth: info.screenWidth,
    screenHeight: info.screenHeight,
    pixelRatio: info.pixelRatio,
  };
  stage.stageWidth = cw;
  stage.stageHeight = ch;
  stage.frameRate = 60;

  // --- Create Player ---
  if (!sys.RenderBuffer) {
    // Default: use WebGL render buffer (assumes webgl context is available)
    sys.RenderBuffer = (globalThis as any).egret?.WebGLRenderBuffer;
  }

  const player = new Player(stage);
  (stage as any).$player = player;

  // --- Touch Handler ---
  const touchHandler = new TouchHandler(stage, sharedCanvas);
  adapter.onTouchStart((e: any) => touchHandler.onTouchStart(e));
  adapter.onTouchMove((e: any) => touchHandler.onTouchMove(e));
  adapter.onTouchEnd((e: any) => touchHandler.onTouchEnd(e));
  adapter.onTouchCancel((e: any) => touchHandler.onTouchCancel(e));

  // --- Lifecycle ---
  adapter.onShow?.(() => {
    ticker.$startTick();
  });
  adapter.onHide?.(() => {
    ticker.$stopTick();
  });

  // --- Entry Class ---
  if (options.entryClass) {
    const clazz = (globalThis as any)[options.entryClass];
    if (clazz) {
      const instance = new clazz();
      stage.addChild(instance);
    } else {
      adapter.warn("Entry class not found: " + options.entryClass);
    }
  }

  // --- Frame Loop ---
  function loop(): void {
    adapter.requestAnimationFrame(loop);
    ticker.$tick();
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

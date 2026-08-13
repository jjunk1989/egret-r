// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { GenericMiniGameAdapter } from "./GenericMiniGameAdapter";
import { SystemInfo } from "./MiniGameAdapter";

/**
 * Alipay (Zhi Fu Bao) Mini Game platform adapter.
 * Uses `my.*` global API namespace.
 *
 * Platform quirks handled here (so game projects don't need their own fixes):
 * - `my.createCanvas()` returns a canvas with PHYSICAL initial size
 *   (logical * pixelRatio); the engine reads canvas.width as logical width,
 *   which made stage 3x / RenderBuffer 9x. Normalized to logical size here.
 * - Alipay devtools masquerades as an iPhone (platform='iOS', pixelRatio=3)
 *   and cannot be told apart from real devices via getSystemInfoSync.
 *   A native `window` global exists only in the simulator (browser worker),
 *   so we report platform='devtools' + pixelRatio=1 there to make the engine
 *   take the 1x hi-dpi path (same as WeChat devtools).
 *
 * Usage:
 *   import { AlipayAdapter } from "@egret-r/core/platform";
 *   registerPlatform(new AlipayAdapter());
 */
export class AlipayAdapter extends GenericMiniGameAdapter {
  private _simulator: boolean;
  private _logicalW: number;
  private _logicalH: number;

  constructor() {
    const api = (globalThis as any).my;
    if (!api) {
      throw new Error(
        "my global not found. AlipayAdapter requires Alipay Mini Game runtime."
      );
    }
    // NOTE: a derived class must NOT touch `this` before super() — compute
    // everything in locals first, then assign fields after super().
    // Simulator detection must happen before any window fallback is installed
    // (a real device worker has no window at all).
    const simulator = typeof (globalThis as any).window !== "undefined";
    let platformId = "my";
    let w = 390, h = 844;
    try {
      const info = api.getSystemInfoSync?.();
      w = info?.windowWidth || info?.screenWidth || 390;
      h = info?.windowHeight || info?.screenHeight || 844;
      if (simulator) platformId = "devtools";
    } catch (_) {
      /* keep defaults */
    }
    super(api, platformId);
    this._simulator = simulator;
    this._logicalW = w;
    this._logicalH = h;
  }

  // === Canvas ===
  // Normalize the initial canvas size to LOGICAL dimensions; the engine
  // manages physical sizing itself via sys.mainCanvas + $setCanvasScale.
  override createCanvas(): any {
    const c = super.createCanvas();
    try {
      c.width = this._logicalW;
      c.height = this._logicalH;
    } catch (_) {
      /* ignore */
    }
    return c;
  }

  // === System Info ===
  // On the simulator, report devtools + pixelRatio 1 so runMiniGame uses the
  // 1x path (no physical canvas resize, no $setCanvasScale, stage = logical).
  override getSystemInfo(): SystemInfo {
    const info = super.getSystemInfo();
    if (this._simulator) {
      info.platform = "devtools";
      info.pixelRatio = 1;
    }
    return info;
  }

  // === Storage ===
  // Alipay storage APIs take object params ({key}/{key,data}) and
  // getStorageSync returns { success, data } instead of the raw value.
  override getStorageSync(key: string): string | null {
    try {
      const r = this.api.getStorageSync({ key });
      if (r == null) return null;
      if (typeof r === "object") {
        return r.data != null ? r.data : null;
      }
      return r;
    } catch (_) {
      return null;
    }
  }

  override setStorageSync(key: string, value: string): void {
    try {
      this.api.setStorageSync({ key, data: value });
    } catch (_) {
      /* ignore */
    }
  }

  override removeStorageSync(key: string): void {
    try {
      this.api.removeStorageSync({ key });
    } catch (_) {
      /* ignore */
    }
  }

  // === Network ===
  // my.request differs from wx.request:
  //   - request param: `headers` (not `header`), `dataType` (not `responseType`)
  //   - response: `res.status` / `res.headers` (not `res.statusCode` / `res.header`)
  override createHttpRequest(): any {
    const api = this.api;
    const self: any = {
      _url: "",
      _method: "GET",
      _headers: {} as Record<string, string>,
      _data: null as any,
      _responseType: "",
      _readyState: 0,
      _status: 0,
      _response: null as any,
      onload: null as (() => void) | null,
      onerror: null as (() => void) | null,
      onprogress: null as ((e: any) => void) | null,

      get response(): any { return self._response; },
      get status(): number { return self._status; },
      get readyState(): number { return self._readyState; },
      get responseText(): string {
        return typeof self._response === "string" ? self._response : "";
      },
      get responseURL(): string { return self._url; },

      open(method: string, url: string) {
        self._method = method;
        self._url = url;
        self._readyState = 1;
      },

      setRequestHeader(key: string, value: string) {
        self._headers[key] = value;
      },

      set responseType(type: string) { self._responseType = type; },
      get responseType(): string { return self._responseType; },

      send(data?: any) {
        self._data = data;
        self._readyState = 2;
        api.request({
          url: self._url,
          method: self._method,
          headers: self._headers,
          data: self._data,
          dataType: self._responseType === "arraybuffer" ? "arraybuffer" : "text",
          success(res: any) {
            self._status = res.status || 200;
            self._response = self._responseType === "arraybuffer"
              ? res.data
              : (typeof res.data === "string" ? res.data : JSON.stringify(res.data));
            self._readyState = 4;
            if (self.onload) self.onload();
          },
          fail(_err: any) {
            self._status = 0;
            self._readyState = 4;
            if (self.onerror) self.onerror();
          },
        });
      },

      abort() {
        // Mini game requests can't be aborted easily
        self._readyState = 4;
      },
      getAllResponseHeaders(): string { return ""; },
      getResponseHeader(_key: string): string | null { return null; },
      overrideMimeType(_mime: string) { /* no-op */ },
      addEventListener(_type: string, _handler: any) { /* no-op */ },
      removeEventListener(_type: string, _handler: any) { /* no-op */ },
    };
    return self;
  }
}

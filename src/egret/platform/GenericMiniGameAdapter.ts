// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { MiniGameAdapter, SystemInfo } from "./MiniGameAdapter";

/**
 * Base adapter for mini-game platforms that share similar API patterns.
 * Works with WeChat(wx), Douyin(tt), Kuaishou(ks), QQ(qq), etc.
 *
 * Usage:
 *   new GenericMiniGameAdapter(wx);   // WeChat
 *   new GenericMiniGameAdapter(tt);   // Douyin
 */
export class GenericMiniGameAdapter implements MiniGameAdapter {
  readonly platformId: string;

  /** The platform API namespace (wx, tt, ks, etc.) */
  protected api: any;

  constructor(api: any, platformId?: string) {
    this.api = api;
    this.platformId = platformId || api?.getSystemInfoSync?.()?.platform || "unknown";
  }

  // === System Info ===
  getSystemInfo(): SystemInfo {
    const info = this.api.getSystemInfoSync();
    return {
      screenWidth: info.screenWidth,
      screenHeight: info.screenHeight,
      pixelRatio: info.pixelRatio || 1,
      platform: info.platform || this.platformId,
      version: info.version || info.SDKVersion || "",
      model: info.model || "",
      orientation: info.deviceOrientation || "portrait",
    };
  }

  // === Canvas ===
  createCanvas(): any {
    return this.api.createCanvas();
  }

  createOffscreenCanvas(width: number, height: number): any {
    // Most mini-game platforms don't support OffscreenCanvas natively
    const canvas = this.api.createCanvas();
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  // === Frame Loop ===
  requestAnimationFrame(callback: () => void): number {
    return this.api.requestAnimationFrame
      ? this.api.requestAnimationFrame(callback)
      : (this.createCanvas() as any).requestAnimationFrame(callback);
  }

  cancelAnimationFrame(handle: number): void {
    if (this.api.cancelAnimationFrame) {
      this.api.cancelAnimationFrame(handle);
    }
  }

  // === Touch Input ===
  onTouchStart(callback: (e: any) => void): void {
    this.api.onTouchStart?.(callback);
  }

  onTouchMove(callback: (e: any) => void): void {
    this.api.onTouchMove?.(callback);
  }

  onTouchEnd(callback: (e: any) => void): void {
    this.api.onTouchEnd?.(callback);
  }

  onTouchCancel(callback: (e: any) => void): void {
    this.api.onTouchCancel?.(callback);
  }

  // === Audio ===
  createInnerAudioContext(): any {
    return this.api.createInnerAudioContext();
  }

  // === Network ===
  createHttpRequest(): any {
    // Mini games use wx.request-style API, not XMLHttpRequest
    // Return a wrapper that provides XMLHttpRequest-like interface
    return this.createMiniGameHttpRequest();
  }

  private createMiniGameHttpRequest(): any {
    const api = this.api;
    return {
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

      get response(): any { return this._response; },
      get status(): number { return this._status; },
      get readyState(): number { return this._readyState; },

      open(method: string, url: string) {
        this._method = method;
        this._url = url;
        this._readyState = 1;
      },

      setRequestHeader(key: string, value: string) {
        this._headers[key] = value;
      },

      set responseType(type: string) { this._responseType = type; },

      send(data?: any) {
        this._data = data;
        this._readyState = 2;

        const self = this;
        api.request({
          url: this._url,
          method: this._method,
          header: this._headers,
          data: this._data,
          responseType: this._responseType || "text",
          success(res: any) {
            self._status = res.statusCode || 200;
            self._response = self._responseType === "arraybuffer"
              ? res.data
              : (typeof res.data === "string" ? res.data : JSON.stringify(res.data));
            self._readyState = 4;
            if (self.onload) self.onload();
          },
          fail(err: any) {
            self._status = 0;
            self._readyState = 4;
            if (self.onerror) self.onerror();
          },
        });
      },

      abort() {
        // Mini game requests can't be aborted easily
        this._readyState = 4;
      },
    };
  }

  // === Image Loading ===
  createImage(): any {
    return this.api.createImage();
  }

  // === Storage ===
  getStorageSync(key: string): string | null {
    try {
      return this.api.getStorageSync(key) || null;
    } catch (_) {
      return null;
    }
  }

  setStorageSync(key: string, value: string): void {
    try {
      this.api.setStorageSync(key, value);
    } catch (_) { /* ignore */ }
  }

  removeStorageSync(key: string): void {
    try {
      this.api.removeStorageSync(key);
    } catch (_) { /* ignore */ }
  }

  // === File System ===
  getUserDataPath(): string {
    return this.api.env?.USER_DATA_PATH || "";
  }

  // === Lifecycle ===
  onShow(callback: () => void): void {
    this.api.onShow?.(callback);
  }

  onHide(callback: () => void): void {
    this.api.onHide?.(callback);
  }

  // === Logging ===
  log(message: string): void {
    if (this.api.getLogManager) {
      const logger = this.api.getLogManager();
      logger.log("[egret]", message);
    } else {
      console.log("[egret]", message);
    }
  }

  warn(message: string): void {
    if (this.api.getLogManager) {
      const logger = this.api.getLogManager();
      logger.warn("[egret]", message);
    } else {
      console.warn("[egret]", message);
    }
  }

  error(message: string): void {
    if (this.api.getLogManager) {
      const logger = this.api.getLogManager();
      logger.warn("[egret]", message);
    } else {
      console.error("[egret]", message);
    }
  }
}

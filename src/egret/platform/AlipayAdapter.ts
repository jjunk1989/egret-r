// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { GenericMiniGameAdapter } from "./GenericMiniGameAdapter";

/**
 * Alipay (Zhi Fu Bao) Mini Game platform adapter.
 * Uses `my.*` global API namespace.
 *
 * Usage:
 *   import { AlipayAdapter } from "@egret-r/core/platform";
 *   registerPlatform(new AlipayAdapter());
 */
export class AlipayAdapter extends GenericMiniGameAdapter {
  constructor() {
    const api = (globalThis as any).my;
    if (!api) {
      throw new Error(
        "my global not found. AlipayAdapter requires Alipay Mini Game runtime."
      );
    }
    super(api, "my");
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

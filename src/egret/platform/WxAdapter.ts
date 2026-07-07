// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { GenericMiniGameAdapter } from "./GenericMiniGameAdapter";

/**
 * WeChat Mini Game platform adapter.
 * Uses `wx.*` global API namespace.
 *
 * Usage:
 *   import { WxAdapter } from "@egret-r/core/platform";
 *   registerPlatform(new WxAdapter());
 */
export class WxAdapter extends GenericMiniGameAdapter {
  constructor() {
    // In WeChat Mini Game, `wx` is injected as a global by the runtime.
    // TypeScript users: declare const wx: any; or use @types/wechat-minigame
    const api = (globalThis as any).wx;
    if (!api) {
      throw new Error(
        "wx global not found. WxAdapter requires WeChat Mini Game runtime."
      );
    }
    super(api, "wx");
  }
}

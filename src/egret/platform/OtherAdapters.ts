// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { GenericMiniGameAdapter } from "./GenericMiniGameAdapter";

/**
 * Douyin (TikTok) Mini Game platform adapter.
 * Uses `tt.*` global API namespace.
 */
export class TtAdapter extends GenericMiniGameAdapter {
  constructor() {
    const api = (globalThis as any).tt;
    if (!api) throw new Error("tt global not found. TtAdapter requires Douyin Mini Game runtime.");
    super(api, "tt");
  }
}

/**
 * Kuaishou Mini Game platform adapter.
 * Uses `ks.*` global API namespace.
 */
export class KsAdapter extends GenericMiniGameAdapter {
  constructor() {
    const api = (globalThis as any).ks;
    if (!api) throw new Error("ks global not found. KsAdapter requires Kuaishou Mini Game runtime.");
    super(api, "ks");
  }
}

/**
 * QQ Mini Game platform adapter.
 * Uses `qq.*` global API namespace.
 */
export class QqAdapter extends GenericMiniGameAdapter {
  constructor() {
    const api = (globalThis as any).qq;
    if (!api) throw new Error("qq global not found. QqAdapter requires QQ Mini Game runtime.");
    super(api, "qq");
  }
}

// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

/**
 * Platform abstraction layer for multi-platform support.
 * 
 * Usage:
 *   import { registerPlatform, WebAdapter } from "./platform";
 *   registerPlatform(new WebAdapter());
 *   // ... engine picks up the adapter automatically
 */
export type { MiniGameAdapter, SystemInfo } from "./MiniGameAdapter";
export { WebAdapter } from "./WebAdapter";
export { GenericMiniGameAdapter } from "./GenericMiniGameAdapter";
export { WxAdapter } from "./WxAdapter";
export { TtAdapter, KsAdapter, QqAdapter } from "./OtherAdapters";
export { registerPlatform, getPlatform, hasPlatform, getPlatformId } from "./PlatformRegistry";

// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { MiniGameAdapter } from "./MiniGameAdapter";

/**
 * Global platform adapter registry.
 * Call `registerPlatform()` during engine initialization,
 * then use `getPlatform()` anywhere in engine code.
 */
let _platform: MiniGameAdapter | null = null;

/**
 * Register the platform adapter. Must be called before engine startup.
 * @param adapter The platform adapter instance
 */
export function registerPlatform(adapter: MiniGameAdapter): void {
  if (_platform) {
    // Silently overwrite — common when WebAdapter auto-registers first,
    // then mini-game adapter replaces it.
  }
  _platform = adapter;
}

/**
 * Get the current platform adapter.
 * @throws If no adapter has been registered
 */
export function getPlatform(): MiniGameAdapter {
  if (!_platform) {
    throw new Error(
      "No platform adapter registered. Call registerPlatform() before using engine APIs."
    );
  }
  return _platform;
}

/**
 * Check if a platform adapter has been registered.
 */
export function hasPlatform(): boolean {
  return _platform !== null;
}

/**
 * Get the current platform ID, or "unknown" if not registered.
 */
export function getPlatformId(): string {
  return _platform ? _platform.platformId : "unknown";
}

// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

/**
 * Platform adapter interface for multi-platform support.
 * Each mini-game platform (WeChat, Douyin, etc.) provides its own implementation.
 * The Web platform also implements this interface via WebAdapter.
 */
export interface MiniGameAdapter {
  /** Platform identifier: "web" | "wx" | "tt" | "ks" | "qq" | "my" | "fb" */
  readonly platformId: string;

  // === System Info ===
  /** Get device/system information */
  getSystemInfo(): SystemInfo;

  // === Canvas ===
  /** Create a main canvas element */
  createCanvas(): any;
  /** Create an offscreen canvas */
  createOffscreenCanvas(width: number, height: number): any;

  // === Frame Loop ===
  /** Request animation frame. Returns a handle for cancellation. */
  requestAnimationFrame(callback: () => void): number;
  /** Cancel a scheduled animation frame */
  cancelAnimationFrame(handle: number): void;

  // === Touch Input ===
  /** Register touch start handler */
  onTouchStart(callback: (e: any) => void): void;
  /** Register touch move handler */
  onTouchMove(callback: (e: any) => void): void;
  /** Register touch end handler */
  onTouchEnd(callback: (e: any) => void): void;
  /** Register touch cancel handler */
  onTouchCancel(callback: (e: any) => void): void;

  // === Audio ===
  /** Create an inner audio context for sound playback */
  createInnerAudioContext(): any;
  /** Play a simple tone (beep) at given frequency and duration in ms */
  playTone(frequency: number, duration: number): void;

  // === Network ===
  /** Send an HTTP request (XMLHttpRequest-like API) */
  createHttpRequest(): any;

  // === Image Loading ===
  /** Create a platform-native image object */
  createImage(): any;

  // === Storage ===
  /** Synchronous read from local storage */
  getStorageSync(key: string): string | null;
  /** Synchronous write to local storage */
  setStorageSync(key: string, value: string): void;
  /** Synchronous remove from local storage */
  removeStorageSync(key: string): void;

  // === File System ===
  /** Get user data path for file storage */
  getUserDataPath?(): string;

  // === Lifecycle ===
  /** Register on-show callback */
  onShow?(callback: () => void): void;
  /** Register on-hide callback */
  onHide?(callback: () => void): void;

  // === Logging ===
  /** Log a message (platform-appropriate) */
  log(message: string): void;
  /** Log a warning */
  warn(message: string): void;
  /** Log an error */
  error(message: string): void;
}

/**
 * System information returned by the platform.
 */
export interface SystemInfo {
  /** Screen width in logical pixels */
  screenWidth: number;
  /** Screen height in logical pixels */
  screenHeight: number;
  /** Device pixel ratio */
  pixelRatio: number;
  /** Platform name */
  platform: string;
  /** SDK/browser version */
  version: string;
  /** Device model (on mobile) */
  model?: string;
  /** Device orientation: "portrait" | "landscape" */
  orientation?: string;
}

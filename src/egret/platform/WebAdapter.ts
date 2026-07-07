// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

import { MiniGameAdapter, SystemInfo } from "./MiniGameAdapter";

/**
 * Browser platform adapter — wraps standard Web APIs.
 * This is the default adapter for all browser-based deployments.
 */
export class WebAdapter implements MiniGameAdapter {
  readonly platformId = "web";

  // === System Info ===
  getSystemInfo(): SystemInfo {
    return {
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      pixelRatio: window.devicePixelRatio || 1,
      platform: navigator.platform || "web",
      version: navigator.userAgent || "",
    };
  }

  // === Canvas ===
  createCanvas(): HTMLCanvasElement {
    return document.createElement("canvas");
  }

  createOffscreenCanvas(width: number, height: number): HTMLCanvasElement | OffscreenCanvas {
    if (typeof OffscreenCanvas !== "undefined") {
      return new OffscreenCanvas(width, height);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  // === Frame Loop ===
  requestAnimationFrame(callback: () => void): number {
    return window.requestAnimationFrame(callback);
  }

  cancelAnimationFrame(handle: number): void {
    window.cancelAnimationFrame(handle);
  }

  // === Touch Input ===
  onTouchStart(callback: (e: TouchEvent) => void): void {
    document.addEventListener("touchstart", callback as EventListener, { passive: false });
  }

  onTouchMove(callback: (e: TouchEvent) => void): void {
    document.addEventListener("touchmove", callback as EventListener, { passive: false });
  }

  onTouchEnd(callback: (e: TouchEvent) => void): void {
    document.addEventListener("touchend", callback as EventListener);
  }

  onTouchCancel(callback: (e: TouchEvent) => void): void {
    document.addEventListener("touchcancel", callback as EventListener);
  }

  // === Audio ===
  createInnerAudioContext(): HTMLAudioElement {
    return new Audio();
  }

  // === Network ===
  createHttpRequest(): XMLHttpRequest {
    return new XMLHttpRequest();
  }

  // === Image Loading ===
  createImage(): HTMLImageElement {
    return new Image();
  }

  // === Storage ===
  getStorageSync(key: string): string | null {
    return localStorage.getItem(key);
  }

  setStorageSync(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeStorageSync(key: string): void {
    localStorage.removeItem(key);
  }

  // === Lifecycle ===
  onShow(callback: () => void): void {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") callback();
    });
  }

  onHide(callback: () => void): void {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") callback();
    });
  }

  // === Logging ===
  log(message: string): void {
    console.log("[egret]", message);
  }

  warn(message: string): void {
    console.warn("[egret]", message);
  }

  error(message: string): void {
    console.error("[egret]", message);
  }
}

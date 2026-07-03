// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

/**
 * Ambient declarations for global runtime objects used across the engine.
 * These were originally accessible via the egret namespace scope.
 *
 * As files are migrated to use proper ESM imports, declarations here
 * can be removed. This file is a bridge during the namespace->ESM migration.
 */

// -- Namespaces (used as value + type containers) --

declare namespace egret {
  const sys: any;
}
declare namespace eui {}
declare namespace RES {}
declare namespace processor {}
declare namespace egret_native {}

// -- Runtime globals --

declare const sys: Record<string, any>;
declare const DEBUG: boolean;
declare const RELEASE: boolean;
declare const __global: typeof globalThis;

// -- Engine helper globals (from Defines.debug.ts) --

declare const $error: (code: number, ...params: any[]) => void;
declare const $warn: (code: number, ...params: any[]) => void;
declare const $TempMatrix: any;
declare const $TextureScaleFactor: number;
declare const $getVirtualUrl: (url: string) => string;

declare function tr(code: number, ...params: any[]): string;
declare function warn(message?: any, ...optionalParams: any[]): void;
declare function getQualifiedClassName(o: any): string;

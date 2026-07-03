// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

/**
 * Ambient declarations for global runtime objects used across the engine.
 * These were originally accessible via the egret namespace scope.
 *
 * As imports are added file by file, declarations here can be replaced
 * with proper ESM imports. This file serves as a bridge during migration.
 */

/** Native render bridge. Only defined in native runtime, undefined on web. */
declare const egret_native: any;

/** Global sys object shorthand (equals egret.sys). */
declare const sys: Record<string, any>;

/** Global egret namespace (fully populated at runtime). */
declare const egret: Record<string, any> & {
  sys: Record<string, any>;
  getString: (code: number, ...params: any[]) => string;
  $error: (code: number, ...params: any[]) => void;
};

/** Global eui namespace. */
declare const eui: Record<string, any>;

/** Debug flags set by build system. */
declare const DEBUG: boolean;
declare const RELEASE: boolean;

/** Runtime helpers (defined in Defines.debug.ts / Defines.release.ts). */
declare function tr(code: number, ...params: any[]): string;
declare function warn(message?: any, ...optionalParams: any[]): void;
declare function getQualifiedClassName(o: any): string;

// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

/**
 * Ambient declarations for global runtime objects used across the engine.
 */

/** Native render bridge. Only defined in native runtime, undefined on web. */
declare const egret_native: any;

/** Global sys object shorthand (equals egret.sys). */
declare const sys: Record<string, any>;

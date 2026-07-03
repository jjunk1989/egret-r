// SPDX-License-Identifier: BSD-2-Clause
// Copyright (c) 2014-present, Egret Technology.

/**
 * Provides type-safe access to the global sys object (egret.sys).
 * Used by modules that need to access sys properties without
 * relying on bare namespace references.
 */
export const sys: Record<string, any> = globalThis.egret?.sys || {};

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

// -- Global aliases (no proper export in source) --

/** Alias for egret.is, set at runtime. */
declare const _is: (instance: any, typeName: string) => boolean;

// -- EXMLParser private helpers (not exported from EXMLParser.ts) --

declare function toXMLString(node: any): string;
declare function getPropertyStr(child: any): string;

// -- Node.js globals (used by assetsmanager build tools) --

declare const path: any;
declare const host: any;
declare const queue: any;
declare const global: any;

// -- Extension-internal symbols (assetsmanager/resource, not yet imported) --

declare const BinAnalyzer: any;
declare const checkNull: any;
declare const FEATURE_FLAG: any;
declare const FontAnalyzer: any;
declare const getFontString: any;
declare const ImageAnalyzer: any;
declare const JsonAnalyzer: any;
declare const ResourceEvent: any;
declare const setConfigURL: any;
declare const SheetAnalyzer: any;
declare const SoundAnalyzer: any;
declare const SupportedCompressedTexture: any;
declare const TextAnalyzer: any;
declare const VersionController: any;
declare const XMLAnalyzer: any;

// -- Egret core symbols (used bare in assetsmanager, to be imported properly) --

declare const _Event: any;
declare const CanvasRenderBuffer: any;
declare const CapsStyle: any;
declare const EgretShaderLib: any;
declare const getDefinitionByName: any;
declare const getPrefixStyleName: any;
declare const glContext: any;
declare const GlowFilter: any;
declare const log: any;
declare const Matrix: any;
declare const NumberUtils: any;
declare const property_drawLabel: any;
declare const StageText: any;
declare const TextAtlasRender: any;
declare const toColorString: any;
declare const VerticalAlign: any;
declare const WebGLUtils: any;

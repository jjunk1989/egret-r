// Runtime shim for @egret-r/core.
//
// When bundling extension packages (game/eui/tween/socket/assetsmanager/
// resource), `@egret-r/core` is aliased to this module instead of being
// bundled again. The real core package executes first in consumer bundles
// and populates globalThis.egret, so the extension IIFE can resolve the
// namespace from here. This removes the ~800KB duplicated copy of core
// that used to be embedded inside every extension package.
export const egret = globalThis.egret || { sys: {}, pro: {} };

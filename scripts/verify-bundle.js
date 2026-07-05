"use strict";

// Post-build verification: check that esbuild bundles don't have
// undefined bare global references that would cause runtime errors.
//
// Run: node scripts/verify-bundle.js
//
// This script focuses on the symbols known to cause issues:
// symbols from global.d.ts that are used bare (without import)
// and are renamed by esbuild (X -> X2, _X conflicts).

var fs = require("fs");
var path = require("path");

var ROOT = path.join(__dirname, "..");
var PACKAGES = ["core", "eui", "game", "tween", "socket"];

// Known risky symbols from global.d.ts that often appear bare in engine code.
// These should either have explicit ESM imports or be handled by the build script.
var RISKY_SYMBOLS = [
  // Event-related
  "Event",
  // Utility functions  
  "toColorString", "getFontString", "getPrefixStyleName",
  "getDefinitionByName", "getQualifiedClassName",
  "tr",
  // Engine internals
  "_is", "EgretShaderLib", "WebGLUtils", "glContext",
  "CapsStyle", "GlowFilter", "NumberUtils",
  "TextField", "TextAtlasRender", "property_drawLabel",
  "renderBufferPool",
];

// Symbols defined in the bundle header (before IIFE) — OK to reference
var HEADER_SYMBOLS = {
  egret: true, eui: true, sys: true, global: true, __global: true,
  DEBUG: true, RELEASE: true, window: true, globalThis: true,
};

// Collect all variable/function/class declarations inside the IIFE
function collectDefs(src) {
  var defs = {};
  var re = /\b(?:var|let|const)\s+(\w+)\b/g, m;
  while ((m = re.exec(src)) !== null) defs[m[1]] = true;
  re = /\bfunction\s+(\w+)\s*\(/g;
  while ((m = re.exec(src)) !== null) defs[m[1]] = true;
  re = /\bclass\s+(\w+)\b/g;
  while ((m = re.exec(src)) !== null) defs[m[1]] = true;
  // Also count renamed symbols: var X2 = ...
  re = /\bvar\s+(\w+2)\s*=/g;
  while ((m = re.exec(src)) !== null) defs[m[1]] = true;
  return defs;
}

// Check if a risky symbol appears bare in the IIFE body (not as .method, not as definition)
function findBareRisky(iiFeBody, defs) {
  var findings = {};
  for (var si = 0; si < RISKY_SYMBOLS.length; si++) {
    var sym = RISKY_SYMBOLS[si];
    if (defs[sym]) continue; // Defined locally — OK
    if (HEADER_SYMBOLS[sym]) continue;

    // Match bare usage of the symbol (not as property access .sym, not in strings)
    // Look for: (sym(, = sym, sym., new sym(, ;sym, etc.)
    var re = new RegExp('(?:^|[^\\w$.])(' + sym.replace(/\$/g, '\\$') + ')(?=\\s*[(\\.\\[;,\\)])', 'gm');
    var count = 0, m;
    while ((m = re.exec(iiFeBody)) !== null) {
      // Skip if it's part of a larger identifier
      var before = iiFeBody[m.index - 1] || '';
      if (/[\w$]/.test(before)) continue;
      count++;
    }
    if (count > 0) {
      findings[sym] = count;
    }
  }
  return findings;
}

var allOk = true;

for (var pi = 0; pi < PACKAGES.length; pi++) {
  var pkg = PACKAGES[pi];
  var indexPath = path.join(ROOT, "packages", pkg, "dist", "index.js");
  if (!fs.existsSync(indexPath)) {
    console.log("  " + pkg + ": SKIP (no dist)");
    continue;
  }

  var src = fs.readFileSync(indexPath, "utf8");
  
  // Extract IIFE body
  var iifeMatch = src.match(/\(function\s*\(\)\s*\{([\s\S]*)\}\s*\)\.call\(window\)/);
  if (!iifeMatch) {
    console.log("  " + pkg + ": WARN (no IIFE found)");
    continue;
  }
  var body = iifeMatch[1];
  
  var defs = collectDefs(body);
  var findings = findBareRisky(body, defs);
  
  var keys = Object.keys(findings);
  if (keys.length === 0) {
    console.log("  " + pkg + ": OK");
  } else {
    allOk = false;
    console.log("  " + pkg + ": " + keys.length + " risky bare ref(s):");
    for (var ki = 0; ki < keys.length; ki++) {
      console.log("    " + keys[ki] + " (" + findings[keys[ki]] + " uses)");
    }
  }
}

if (allOk) {
  console.log("\nAll bundles clean.");
} else {
  console.log("\nERROR: Undefined bare references found in bundles.");
  console.log("Fix: add explicit imports to source files, or");
  console.log("add the symbol to build-esm-direct.js auto-rename list.");
  process.exit(1);
}

"use strict";

// Post-build verification: check that esbuild bundles don't have
// undefined bare global references that would cause runtime errors.
//
// Run: node scripts/verify-bundle.js

var fs = require("fs");
var path = require("path");

var ROOT = path.join(__dirname, "..");
var PACKAGES = ["core", "eui", "game", "tween", "socket"];

// Symbols that are defined in the header (before the IIFE) or
// in the global scope — these are OK to reference bare.
var SAFE_HEADER_SYMBOLS = {
  egret: true, eui: true, sys: true, global: true, __global: true,
  DEBUG: true, RELEASE: true, window: true, globalThis: true,
};

// Collect all variable/function declarations inside the IIFE
function collectDefs(src) {
  var defs = {};
  // var X = / let X = / const X =
  var re = /\b(?:var|let|const)\s+(\w+)\b/g;
  var m;
  while ((m = re.exec(src)) !== null) defs[m[1]] = true;
  // function X(
  re = /\bfunction\s+(\w+)\s*\(/g;
  while ((m = re.exec(src)) !== null) defs[m[1]] = true;
  // class X /
  re = /\bclass\s+(\w+)\b/g;
  while ((m = re.exec(src)) !== null) defs[m[1]] = true;
  return defs;
}

// Find bare symbol references that are NOT in the defs set and
// NOT in the safe header symbols. Look for symbols used as:
//   X(  - function call
//   X.  - property access on a bare symbol
//   new X( - constructor call
//   X extends Y - but only check Y (the base class)
function findBareRefs(bundleSrc, iiFeBody, defs) {
  var bare = {};
  
  // Pattern: bare identifier used as a value (in expressions)
  // Match: ; X( or = X( or ( X( or , X( or : X( or [ X( or new X(
  // Also: X.Y (like Event.ADDED) — but Event. was already handled
  var re = /(?:^|[^\w$])(\w+)(?=\()/gm;
  var m;
  while ((m = re.exec(iiFeBody)) !== null) {
    var sym = m[1];
    if (SAFE_HEADER_SYMBOLS[sym]) continue;
    if (defs[sym]) continue;
    // Skip JS builtins
    if (["if","else","for","while","do","switch","case","return",
         "throw","typeof","instanceof","new","delete","void","in",
         "catch","finally","try","break","continue","function",
         "var","let","const","class","import","export","default",
         "extends","super","this","true","false","null","undefined"].indexOf(sym) >= 0) continue;
    // Skip common browser APIs
    if (["console","document","navigator","location","history",
         "setTimeout","setInterval","clearTimeout","clearInterval",
         "requestAnimationFrame","cancelAnimationFrame",
         "JSON","Math","Date","RegExp","Array","Object","String",
         "Number","Boolean","Error","Promise","Map","Set",
         "parseInt","parseFloat","isNaN","isFinite",
         "alert","confirm","prompt","fetch","Image","Audio",
         "WebSocket","XMLHttpRequest","FormData","Blob","File",
         "Worker","URL","encodeURIComponent","decodeURIComponent",
         "Float32Array","Uint8Array","Uint16Array","Int32Array",
         "ArrayBuffer","DataView","TextDecoder","TextEncoder",
         "WebGLRenderingContext","HTMLCanvasElement","CanvasRenderingContext2D",
         "OffscreenCanvas","performance"].indexOf(sym) >= 0) continue;
    // Skip symbols that start with $ (engine internal)
    if (sym[0] === "$") continue;
    bare[sym] = (bare[sym] || 0) + 1;
  }

  return bare;
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
  
  // Extract IIFE body (everything inside (function() { ... }))
  var iifeMatch = src.match(/\(function\s*\(\)\s*\{([\s\S]*)\}\s*\)\.call\(window\)/);
  if (!iifeMatch) {
    console.log("  " + pkg + ": WARN (no IIFE found)");
    continue;
  }
  var body = iifeMatch[1];
  
  var defs = collectDefs(body);
  var bare = findBareRefs(src, body, defs);
  
  var keys = Object.keys(bare);
  if (keys.length === 0) {
    console.log("  " + pkg + ": OK");
  } else {
    allOk = false;
    console.log("  " + pkg + ": " + keys.length + " potential bare refs:");
    for (var ki = 0; ki < keys.length; ki++) {
      console.log("    " + keys[ki] + " (" + bare[keys[ki]] + " uses)");
    }
  }
}

if (allOk) {
  console.log("\nAll bundles clean.");
} else {
  console.log("\nWARNING: Potential undefined references found.");
  console.log("Check the build script post-processing for missing fixes.");
  process.exit(1);
}

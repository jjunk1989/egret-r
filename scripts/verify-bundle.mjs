// Post-build verification: check that esbuild bundles don't have
// undefined bare global references that would cause runtime errors.
//
// Run: node scripts/verify-bundle.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT = path.join(__dirname, '..');
const PACKAGES = ['core', 'eui', 'game', 'tween', 'socket'];

// Known risky symbols from global.d.ts that often appear bare in engine code.
const RISKY_SYMBOLS = [
  'Event',
  'toColorString', 'getFontString', 'getPrefixStyleName',
  'getDefinitionByName', 'getQualifiedClassName',
  'tr',
  '_is', 'EgretShaderLib', 'WebGLUtils', 'glContext',
  'CapsStyle', 'GlowFilter', 'NumberUtils',
  'TextField', 'TextAtlasRender', 'property_drawLabel',
  'renderBufferPool',
];

// Symbols defined in the bundle header (before IIFE) — OK to reference
const HEADER_SYMBOLS = {
  egret: true, eui: true, sys: true, global: true, __global: true,
  DEBUG: true, RELEASE: true, window: true, globalThis: true,
};

// Collect all variable/function/class declarations inside the IIFE
function collectDefs(src) {
  const defs = {};
  let m;
  let re = /\b(?:var|let|const)\s+(\w+)\b/g;
  while ((m = re.exec(src)) !== null) defs[m[1]] = true;
  re = /\bfunction\s+(\w+)\s*\(/g;
  while ((m = re.exec(src)) !== null) defs[m[1]] = true;
  re = /\bclass\s+(\w+)\b/g;
  while ((m = re.exec(src)) !== null) defs[m[1]] = true;
  re = /\bvar\s+(\w+2)\s*=/g;
  while ((m = re.exec(src)) !== null) defs[m[1]] = true;
  return defs;
}

// Check if a risky symbol appears bare in the IIFE body
function findBareRisky(iiFeBody, defs) {
  const findings = {};
  for (const sym of RISKY_SYMBOLS) {
    if (defs[sym]) continue;
    if (HEADER_SYMBOLS[sym]) continue;

    const re = new RegExp('(?:^|[^\\w$.])(' + sym.replace(/\$/g, '\\$') + ')(?=\\s*[(\\.\\[;,\\)])', 'gm');
    let count = 0, m;
    while ((m = re.exec(iiFeBody)) !== null) {
      const before = iiFeBody[m.index - 1] || '';
      if (/[\w$]/.test(before)) continue;
      count++;
    }
    if (count > 0) {
      findings[sym] = count;
    }
  }
  return findings;
}

let allOk = true;

for (const pkg of PACKAGES) {
  const indexPath = path.join(ROOT, 'packages', pkg, 'dist', 'index.js');
  if (!fs.existsSync(indexPath)) {
    console.log('  ' + pkg + ': SKIP (no dist)');
    continue;
  }

  const src = fs.readFileSync(indexPath, 'utf8');

  // Extract IIFE body
  const iifeMatch = src.match(/\(function\s*\(\)\s*\{([\s\S]*)\}\s*\)\.call\(window\)/);
  if (!iifeMatch) {
    console.log('  ' + pkg + ': WARN (no IIFE found)');
    continue;
  }
  const body = iifeMatch[1];

  const defs = collectDefs(body);
  const findings = findBareRisky(body, defs);

  const keys = Object.keys(findings);
  if (keys.length === 0) {
    console.log('  ' + pkg + ': OK');
  } else {
    allOk = false;
    console.log('  ' + pkg + ': ' + keys.length + ' risky bare ref(s):');
    for (const k of keys) {
      console.log('    ' + k + ' (' + findings[k] + ' uses)');
    }
  }
}

if (allOk) {
  console.log('\nAll bundles clean.');
} else {
  console.log('\nERROR: Undefined bare references found in bundles.');
  console.log('Fix: add explicit imports to source files, or');
  console.log('add the symbol to build-esm-direct.mjs auto-rename list.');
  process.exit(1);
}

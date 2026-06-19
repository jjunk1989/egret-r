"use strict";

var fs = require('fs');
var path = require('path');

var ROOT = path.join(__dirname, '..');

// TypeScript keywords that should NEVER be in import {} blocks
var KEYWORDS = [
  'enum', 'class', 'interface', 'function', 'const', 'let', 'var',
  'import', 'export', 'extends', 'implements', 'type', 'typeof',
  'new', 'delete', 'return', 'if', 'else', 'for', 'while', 'do',
  'switch', 'case', 'break', 'continue', 'default', 'throw', 'try',
  'catch', 'finally', 'async', 'await', 'yield', 'of', 'in',
  'this', 'super', 'static', 'public', 'private', 'protected',
  'get', 'set', 'as', 'from', 'module', 'namespace', 'declare',
  'abstract', 'any', 'boolean', 'number', 'string', 'void', 'null',
  'undefined', 'never', 'object', 'symbol', 'true', 'false',
  'keyof', 'infer', 'readonly', 'instanceof',
  // Common global names that shouldn't be imported
  'addEventListener', 'removeEventListener', 'dispatchEvent',
  'dispatch', 'toString', 'valueOf', 'hasOwnProperty',
  'isPrototypeOf', 'propertyIsEnumerable', 'constructor',
  'window', 'document', 'console', 'Math', 'JSON', 'parseInt',
  'parseFloat', 'isNaN', 'isFinite', 'eval', 'Error', 'ErrorCode',
  'Array', 'Object', 'Function', 'String', 'Number', 'Boolean',
  'Date', 'RegExp', 'Map', 'Set', 'WeakMap', 'WeakSet', 'Promise',
  'Symbol', 'Intl', 'Reflect', 'Proxy', 'Buffer',
  'require', 'process', 'global', 'globalThis',
  'Uint8Array', 'Int8Array', 'Uint16Array', 'Int16Array',
  'Uint32Array', 'Int32Array', 'Float32Array', 'Float64Array',
  'ArrayBuffer', 'DataView', 'TextEncoder', 'TextDecoder',
  'requestAnimationFrame', 'cancelAnimationFrame',
  'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
  'encodeURI', 'encodeURIComponent', 'decodeURI', 'decodeURIComponent',
  'atob', 'btoa', 'Blob', 'File', 'FileReader', 'URL',
  'Image', 'Audio', 'HTMLCanvasElement', 'CanvasRenderingContext2D',
  'WebGLRenderingContext', 'HTMLElement', 'HTMLDivElement',
  'XMLHttpRequest', 'WebSocket', 'EventSource', 'Worker',
  'navigator', 'location', 'history', 'localStorage', 'sessionStorage',
];

function walkTs(dir) {
  var results = [];
  var entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return results; }
  for (var i = 0; i < entries.length; i++) {
    var fp = path.join(dir, entries[i].name).replace(/\\/g, '/');
    if (entries[i].isDirectory() && entries[i].name !== 'node_modules') {
      results = results.concat(walkTs(fp));
    } else if (entries[i].name.endsWith('.ts') && !entries[i].name.endsWith('.d.ts')) {
      results.push(fp);
    }
  }
  return results;
}

function fixImports(content) {
  var modified = false;

  // Fix import { enum, ... } or import { ..., enum, ... }
  for (var k = 0; k < KEYWORDS.length; k++) {
    var kw = KEYWORDS[k];
    var regex1 = new RegExp('import\\s*\\{\\s*' + kw + '\\s*,\\s*', 'g');
    var regex2 = new RegExp('import\\s*\\{\\s*([^}]*),\\s*' + kw + '\\s*\\}\\s*from', 'g');
    var regex3 = new RegExp('import\\s*\\{\\s*' + kw + '\\s*\\}\\s*from', 'g');

    if (regex1.test(content) || regex2.test(content) || regex3.test(content)) {
      content = content.replace(regex1, 'import { ');
      content = content.replace(regex2, function(m, before) { return 'import { ' + before + ' } from'; });
      content = content.replace(regex3, 'import { } from');
      modified = true;
    }
  }

  // Clean up empty import blocks
  content = content.replace(/import\s*\{\s*\}\s*from\s*'[^']+';?\s*\n/g, '');

  return modified ? content : null;
}

// Main
var pkgDirs = ['core', 'eui', 'game', 'tween', 'socket'];
var fixed = 0;

console.log('Fixing keyword imports...\n');

for (var p = 0; p < pkgDirs.length; p++) {
  var srcDir = path.join(ROOT, 'packages', pkgDirs[p], 'src');
  if (!fs.existsSync(srcDir)) continue;

  var files = walkTs(srcDir);
  var pkgFixed = 0;

  for (var f = 0; f < files.length; f++) {
    var content = fs.readFileSync(files[f], 'utf8');
    var rel = path.relative(srcDir, files[f]);
    if (rel === 'Defines.ts' || rel === 'ClassRegistry.ts' || rel === 'index.ts') continue;

    var fixedContent = fixImports(content);
    if (fixedContent) {
      fs.writeFileSync(files[f], fixedContent, 'utf8');
      pkgFixed++;
    }
  }

  if (pkgFixed > 0) {
    console.log('  @egret-r/' + pkgDirs[p] + ': ' + pkgFixed + ' files fixed');
    fixed += pkgFixed;
  }
}

console.log('\nTotal: ' + fixed + ' files fixed.\n');

// Now restore TextField.ts from original
console.log('Restoring corrupted TextField.ts...');
var srcOriginal = path.join(ROOT, 'src', 'egret', 'text', 'TextField.ts');
var dstFile = path.join(ROOT, 'packages', 'core', 'src', 'text', 'TextField.ts');

if (fs.existsSync(srcOriginal)) {
  // Read original
  var original = fs.readFileSync(srcOriginal, 'utf8');
  
  // Check if current has corruption
  var current = fs.readFileSync(dstFile, 'utf8');
  if (current.indexOf('defaultRegex') !== -1 && current.indexOf('\\u00BF') !== -1) {
    fs.copyFileSync(srcOriginal, dstFile);
    console.log('  Restored from src/egret/text/TextField.ts');
    console.log('  (Will need re-running modernize + generate-imports on this file)');
  } else {
    console.log('  Already correct');
  }
} else {
  console.log('  Original source not found!');
}
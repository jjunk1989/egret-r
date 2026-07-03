// Generate .d.ts from ESM source files
// Reads ESM source, strips implementations, wraps in namespace blocks
var fs = require('fs');
var path = require('path');

var ROOT = __dirname + '/..';

// Packages configuration
var PACKAGES = [
  { name: 'core', srcDirs: ['src/egret'], ns: ['egret'] },
  { name: 'eui', srcDirs: ['src/egret', 'src/extension/eui'], ns: ['egret', 'eui'] },
  { name: 'game', srcDirs: ['src/egret', 'src/extension/game'], ns: ['egret', 'game'] },
  { name: 'tween', srcDirs: ['src/egret', 'src/extension/tween'], ns: ['egret'] },
  { name: 'socket', srcDirs: ['src/egret', 'src/extension/socket'], ns: ['egret'] },
];

function walkTs(dir) {
  var results = [];
  if (!fs.existsSync(dir)) return results;
  var entries = fs.readdirSync(dir, { withFileTypes: true });
  for (var i = 0; i < entries.length; i++) {
    var p = path.join(dir, entries[i].name);
    if (entries[i].isDirectory()) {
      results = results.concat(walkTs(p));
    } else if (entries[i].isFile() && p.endsWith('.ts') && !p.endsWith('.d.ts')) {
      results.push(p);
    }
  }
  return results;
}

// Strip function bodies: replace { ... } after function/method signatures
// Works for: function foo() { ... }, get x() { ... }, set x(v) { ... }, constructor() { ... }
function stripBodies(content) {
  // Remove /// <reference> directives
  content = content.replace(/\/\/\/\s*<reference\s+path\s*=\s*["'][^"']+["']\s*\/>\s*\n?/g, '');
  // Remove import statements (they'll be resolved at the namespace level)
  content = content.replace(/^import\s+.*?from\s+["'][^"']+["'];?\s*$/gm, '');
  content = content.replace(/^import\s+["'][^"']+["'];?\s*$/gm, '');
  // Remove export keyword from declarations (we use namespace export)
  content = content.replace(/^export\s+(default\s+)?/gm, '');
  // Remove type-only imports
  content = content.replace(/^import\s+type\s+.*$/gm, '');

  // Strip implementation bodies - handle nested braces
  // Match function/constructor/get/set and replace body with ;
  var result = '';
  var i = 0;
  while (i < content.length) {
    // Find next function-like declaration
    var match = content.slice(i).match(/(?:function|constructor|get\s+\w+|set\s+\w+)\s*\([^)]*\)\s*(:\s*\w+(\.\w+)*(\[\])?)?\s*\{/);
    if (!match) {
      result += content.slice(i);
      break;
    }
    var matchIdx = i + match.index;
    result += content.slice(i, matchIdx);
    // Find the matching closing brace
    var braceStart = matchIdx + match[0].length - 1; // position of opening {
    var depth = 1;
    var pos = braceStart + 1;
    while (pos < content.length && depth > 0) {
      if (content[pos] === '{') depth++;
      else if (content[pos] === '}') depth--;
      pos++;
    }
    // Replace body with ;
    result += match[0].slice(0, -1) + ';'; // Remove { and add ;
    i = pos;
  }

  return result;
}

// Remove declaration implementations (after = in class property declarations)
function stripPropertyDefaults(content) {
  return content.replace(/^(\s*(?:public\s+|private\s+|protected\s+|static\s+|readonly\s+)*)(\w+)\s*:\s*([^=;]+)\s*=\s*[^;]+;/gm, '$1$2: $3;');
}

function generateDts(pkg) {
  var files = [];
  for (var d = 0; d < pkg.srcDirs.length; d++) {
    var srcDir = path.join(ROOT, pkg.srcDirs[d]);
    files = files.concat(walkTs(srcDir));
  }

  // Deduplicate by filename
  var seen = {};
  var uniqueFiles = [];
  for (var i = 0; i < files.length; i++) {
    var basename = path.basename(files[i]);
    if (!seen[basename]) {
      seen[basename] = true;
      uniqueFiles.push(files[i]);
    }
  }

  // Skip native files
  uniqueFiles = uniqueFiles.filter(function(f) {
    return !/[\\\/]native[\\\/]/.test(f) && !/NativeContext\.ts$/.test(f);
  });

  // Process each file
  var nsBlocks = {};
  for (var i = 0; i < uniqueFiles.length; i++) {
    var content = fs.readFileSync(uniqueFiles[i], 'utf8');
    var rel = path.relative(ROOT, uniqueFiles[i]);

    // Determine which namespace this file belongs to
    var ns = 'egret'; // default
    if (rel.includes('extension\\eui') || rel.includes('extension/eui')) ns = 'eui';
    else if (rel.includes('extension\\game') || rel.includes('extension/game')) ns = 'game';
    else if (rel.includes('extension\\tween') || rel.includes('extension/tween')) ns = 'tween';
    else if (rel.includes('extension\\socket') || rel.includes('extension/socket')) ns = 'socket';

    var stripped = stripBodies(content);
    stripped = stripPropertyDefaults(stripped);

    // Remove empty lines and copyright headers
    stripped = stripped.replace(/^\/\/\s*SPDX[\s\S]*?\n\n/gm, '');
    stripped = stripped.replace(/^\/\/\s*Copyright[\s\S]*?\n\n/gm, '');
    stripped = stripped.replace(/^\s*\n/gm, '');

    if (stripped.trim()) {
      if (!nsBlocks[ns]) nsBlocks[ns] = [];
      nsBlocks[ns].push('// ' + rel + '\n' + stripped.trim());
    }
  }

  // Build final d.ts
  var dts = '// Type definitions for @egret-r\n';
  dts += '// Auto-generated from ESM source. Do not edit.\n\n';

  if (pkg.name !== 'core') {
    dts += "import { egret } from '@egret-r/core';\n\n";
  }

  // Write namespace blocks
  var nsOrder = pkg.ns;
  for (var n = 0; n < nsOrder.length; n++) {
    var ns = nsOrder[n];
    if (nsBlocks[ns] && nsBlocks[ns].length > 0) {
      dts += 'namespace ' + ns + ' {\n';
      dts += nsBlocks[ns].join('\n\n');
      dts += '\n}\n\n';
    }
  }

  dts += 'export as namespace egret;\n';
  
  // Export all namespaces present in this package
  var exportNs = [];
  for (var n = 0; n < nsOrder.length; n++) {
    if (nsBlocks[nsOrder[n]]) exportNs.push(nsOrder[n]);
  }
  if (exportNs.length > 0) {
    dts += '\nexport { ' + exportNs.join(', ') + ' };\n';
  }

  var outPath = path.join(ROOT, 'packages', pkg.name, 'dist', 'index.d.ts');
  fs.writeFileSync(outPath, dts, 'utf8');
  var size = fs.statSync(outPath).size;
  console.log('  ' + pkg.name + ': ' + size.toLocaleString() + ' bytes');
}

console.log('Generating .d.ts from ESM source...\n');

for (var i = 0; i < PACKAGES.length; i++) {
  generateDts(PACKAGES[i]);
}

console.log('\nDone!');

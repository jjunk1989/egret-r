"use strict";
var fs = require('fs');
var path = require('path');

var srcRoot = path.join(__dirname, '..', 'packages', 'core', 'src');
var origSrc = path.join(__dirname, '..', 'src', 'egret', 'text', 'TextField.ts');
var dstFile = path.join(srcRoot, 'text', 'TextField.ts');

// Always start from original
fs.copyFileSync(origSrc, dstFile);

var content = fs.readFileSync(dstFile, 'utf8');

// Parse /// <reference> directives
var refRegex = /\/\/\/\s*<reference\s+path\s*=\s*["']([^"']+)["']\s*\/>/g;
var refs = [];
var m;
while ((m = refRegex.exec(content)) !== null) refs.push(m[1]);

// Only remove /// <reference> lines - do NOT touch //if lines
content = content.replace(/\/\/\/\s*<reference\s+path\s*=\s*["'][^"']+["']\s*\/>\s*\n?/g, '');

// Unwrap namespace egret { ... } - careful with 2400+ line file
var nsStart = content.indexOf('namespace egret {');
if (nsStart === -1) nsStart = content.indexOf('namespace egret{');
var braceIdx = content.indexOf('{', nsStart);
var depth = 0, foundNsStart = false, nsEnd = -1;
for (var k = nsStart; k < content.length; k++) {
  if (content[k] === '{') { depth++; if (!foundNsStart) foundNsStart = true; }
  if (content[k] === '}') { depth--; if (depth === 0 && foundNsStart) { nsEnd = k; break; } }
}

if (nsEnd === -1) {
  console.error('Could not find namespace end');
  process.exit(1);
}

var before = content.substring(0, nsStart);
var after = content.substring(nsEnd + 1);

// Extract namespace body using byte preservation
// Read as buffer to avoid encoding issues
var buf = fs.readFileSync(dstFile);
var insideStart = content.indexOf('{', nsStart) + 1;
var insideBuf = buf.slice(Buffer.byteLength(content.substring(0, insideStart), 'utf8'), 
                          Buffer.byteLength(content.substring(0, nsEnd), 'utf8'));
var inside = insideBuf.toString('utf8');

// Remove duplicated copyright header inside namespace
inside = inside.replace(/^[\s\S]*?\/{79}\s*$[\s]*/m, '').trimStart();

// Build output
var result = before.trimEnd() + '\n';

// Add imports from references
var rel = 'text/TextField.ts';
for (var i = 0; i < refs.length; i++) {
  var refPath = refs[i];
  var currentDir = path.dirname(rel);
  var resolved = path.resolve(path.join(srcRoot, currentDir), refPath).replace(/\\/g, '/');
  var resolvedRel = resolved.replace(srcRoot.replace(/\\/g, '/') + '/', '');
  var importDir = path.relative(currentDir, path.dirname(resolvedRel));
  if (importDir === '') importDir = '.';
  if (!importDir.startsWith('.')) importDir = './' + importDir;
  var basename = path.basename(resolvedRel, '.ts');
  var importPath = (importDir + '/' + basename).replace(/\\/g, '/');
  result += "import '" + importPath + "';\n";
}

if (refs.length > 0) {
  result += '\n';
  result += "import { DEBUG, RELEASE } from '../Defines';\n";
  result += '\n';
}

result += inside.trimEnd() + '\n';
if (after.trim()) result += '\n' + after.trim() + '\n';
if (result.indexOf('export ') === -1 && result.indexOf('import ') === -1) {
  result += '\nexport {};\n';
}

fs.writeFileSync(dstFile, result, 'utf8');
console.log('TextField.ts fixed (byte-safe)');

// Now run import generator only for TextField.ts
console.log('Running import generation on TextField.ts...');
var genScript = require('./generate-imports.js');
// The generate-imports script processes all files; let it run
"use strict";
var fs = require('fs');
var path = require('path');

var srcRoot = path.join(__dirname, '..', 'packages', 'core', 'src');
var file = path.join(srcRoot, 'text', 'TextField.ts');

var content = fs.readFileSync(file, 'utf8');

// Parse and remove /// <reference> directives
var refRegex = /\/\/\/\s*<reference\s+path\s*=\s*["']([^"']+)["']\s*\/>/g;
var refs = [];
var m;
while ((m = refRegex.exec(content)) !== null) refs.push(m[1]);
content = content.replace(refRegex, '');

// Unwrap namespace egret { ... }
var nsStart = content.indexOf('namespace egret {');
if (nsStart === -1) nsStart = content.indexOf('namespace egret{');
var braceIdx = content.indexOf('{', nsStart);
var depth = 0, foundNsStart = false, nsEnd = -1;
for (var k = nsStart; k < content.length; k++) {
  if (content[k] === '{') { depth++; if (!foundNsStart) foundNsStart = true; }
  if (content[k] === '}') { depth--; if (depth === 0 && foundNsStart) { nsEnd = k; break; } }
}
var before = content.substring(0, nsStart);
var inside = content.substring(braceIdx + 1, nsEnd);
var after = content.substring(nsEnd + 1);

// Build output
var result = before.trimEnd() + '\n';

// Convert references to imports
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

if (refs.length > 0) result += '\n';
result += inside.trimEnd() + '\n';
if (after.trim()) result += '\n' + after.trim() + '\n';
if (result.indexOf('export ') === -1 && result.indexOf('import ') === -1) result += '\nexport {};\n';

fs.writeFileSync(file, result, 'utf8');
console.log('TextField.ts modernized successfully');
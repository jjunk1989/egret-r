"use strict";

/**
 * Unwrap sub-namespace blocks like:
 *   namespace egret.sys { export class Foo {} }
 *   namespace eui.sys { export class Bar {} }
 *   namespace egret_native { ... } (non-declare only)
 * 
 * Strategy: extract the inner content and prefix exports with the namespace.
 * Actually simpler: just unwrap like the main namespace — keep all exports top level.
 */

var fs = require('fs');
var path = require('path');

var ROOT = path.join(__dirname, '..');

var TARGETS = [
  { outerNs: 'egret', innerNs: 'sys' },
  { outerNs: 'eui', innerNs: 'sys' },
  { outerNs: 'egret', innerNs: 'native' },  // egret_native (non-declare)
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

function unwrapSubNamespace(content, outerNs, innerNs, fullNs) {
  var pattern = outerNs + '\\.' + innerNs;
  var nsRegex = new RegExp('namespace\\s+' + pattern + '\\s*\\{', 'g');
  var matches = content.match(nsRegex);
  if (!matches) return null;

  var newContent = content;

  // Process each occurrence
  for (var matchIdx = 0; matchIdx < matches.length; matchIdx++) {
    // Find the position of this namespace block
    var searchFrom = 0;
    for (var s = 0; s <= matchIdx; s++) {
      var re = new RegExp('namespace\\s+' + pattern + '\\s*\\{');
      var m = re.exec(newContent.substring(searchFrom));
      if (!m) break;
      var nsStart = searchFrom + m.index;
      var nsBraceIdx = nsStart + m[0].length - 1; // position of '{'

      // Find matching closing brace
      var depth = 0;
      var nsEnd = -1;
      var foundStart = false;
      for (var k = nsBraceIdx; k < newContent.length; k++) {
        if (newContent[k] === '{') { depth++; foundStart = true; }
        if (newContent[k] === '}') {
          depth--;
          if (depth === 0 && foundStart) { nsEnd = k; break; }
        }
      }

      if (nsEnd === -1) { searchFrom = nsBraceIdx + 1; continue; }

      // Extract parts
      var before = newContent.substring(0, nsStart);
      var inside = newContent.substring(nsBraceIdx + 1, nsEnd);
      var after = newContent.substring(nsEnd + 1);

      // Build replacement: keep inside, remove namespace wrapper
      newContent = before + '\n' + inside + '\n' + after;
      searchFrom = before.length + 1;
    }
  }

  return newContent;
}

// ===== Main =====

var pkgDirs = ['core', 'eui', 'game', 'tween', 'socket'];
var totalUnwrapped = 0;

console.log('Unwrapping sub-namespaces...\n');

for (var p = 0; p < pkgDirs.length; p++) {
  var pkgName = pkgDirs[p];
  var srcDir = path.join(ROOT, 'packages', pkgName, 'src');
  if (!fs.existsSync(srcDir)) continue;

  var files = walkTs(srcDir);
  var unwrapped = 0;

  for (var f = 0; f < files.length; f++) {
    var content = fs.readFileSync(files[f], 'utf8');
    var modified = false;

    for (var t = 0; t < TARGETS.length; t++) {
      var target = TARGETS[t];
      if (target.outerNs === 'egret' && pkgName !== 'core') continue;
      if (target.outerNs === 'eui' && pkgName !== 'eui') continue;

      var fullNs = target.outerNs + '.' + target.innerNs;

      // Check if file contains this sub-namespace (dotted form: egret.sys)
      var nsRegex = new RegExp('namespace\\s+' + target.outerNs + '\\.' + target.innerNs + '\\s*\\{', 'g');
      if (!nsRegex.test(content)) continue;

      var newContent = unwrapSubNamespace(content, target.outerNs, target.innerNs, fullNs);
      if (newContent && newContent !== content) {
        content = newContent;
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(files[f], content, 'utf8');
      unwrapped++;
    }
  }

  if (unwrapped > 0) {
    console.log('  @egret-r/' + pkgName + ': ' + unwrapped + ' files unwrapped');
    totalUnwrapped += unwrapped;
  }
}

console.log('\nTotal: ' + totalUnwrapped + ' files unwrapped.\n');

// Verification
console.log('--- Verification ---');
var sample = path.join(ROOT, 'packages', 'core', 'src', 'player', 'nodes', 'NormalBitmapNode.ts');
if (fs.existsSync(sample)) {
  var lines = fs.readFileSync(sample, 'utf8').split('\n');
  console.log('NormalBitmapNode.ts (first 10 lines after header):');
  var headerEnd = 0;
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '//////////////////////////////////////////////////////////////////////////////////////') headerEnd = i;
  }
  for (var i = headerEnd + 1; i < Math.min(headerEnd + 15, lines.length); i++) {
    console.log('  ' + i + '| ' + lines[i]);
  }
}
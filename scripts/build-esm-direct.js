"use strict";
var fs = require('fs'), path = require('path'), esbuild = require('esbuild');
var ROOT = path.join(__dirname, '..');

var PACKAGES = [
  { name: 'core', srcDirs: ['src/egret'], nss: ['egret'] },
  { name: 'eui', srcDirs: ['src/extension/eui'], nss: ['eui'] },
  { name: 'game', srcDirs: ['src/extension/game'], nss: ['egret'] },
  { name: 'tween', srcDirs: ['src/extension/tween'], nss: ['egret'] },
  { name: 'socket', srcDirs: ['src/extension/socket'], nss: ['egret'] },
];

function walkTs(dir) {
  var r = []; try {
    var ents = fs.readdirSync(dir, { withFileTypes: true });
    for (var i = 0; i < ents.length; i++) {
      var p = path.join(dir, ents[i].name).replace(/\\/g, '/');
      if (ents[i].isDirectory() && ents[i].name !== 'node_modules') r = r.concat(walkTs(p));
      else if (ents[i].isFile() && p.endsWith('.ts') && !p.endsWith('.d.ts')) r.push(p);
    }
  } catch (e) {}
  return r;
}

function extractExports(filePath) {
  var content = fs.readFileSync(filePath, 'utf8');
  var symbols = [];
  var reserved = { 'enum': true, 'implements': true, 'package': true, 'protected': true,
    'static': true, 'interface': true, 'private': true, 'public': true, 'yield': true,
    'let': true, 'const': true, 'var': true, 'class': true, 'function': true,
    'export': true, 'import': true, 'default': true, 'extends': true, 'super': true,
    'this': true, 'new': true, 'delete': true, 'typeof': true, 'void': true,
    'instanceof': true, 'in': true, 'return': true, 'if': true, 'else': true,
    'switch': true, 'case': true, 'break': true, 'continue': true, 'for': true,
    'while': true, 'do': true, 'try': true, 'catch': true, 'finally': true,
    'throw': true, 'debugger': true, 'with': true, 'null': true, 'true': true,
    'false': true, 'async': true, 'await': true };
  var re = /export\s+(?:const|let|var|function)\s+(?!enum\b)(\$?\w+)/g;
  var m;
  while ((m = re.exec(content)) !== null) { if (!reserved[m[1]]) symbols.push(m[1]); }
  var re2 = /export\s+(?:abstract\s+)?class\s+(\$?\w+)/g;
  while ((m = re2.exec(content)) !== null) { if (!reserved[m[1]]) symbols.push(m[1]); }
  var re3 = /export\s+enum\s+(\$?\w+)/g;
  while ((m = re3.exec(content)) !== null) { if (!reserved[m[1]]) symbols.push(m[1]); }
  var re4 = /export\s*\{\s*([^}]+)\}/g;
  while ((m = re4.exec(content)) !== null) {
    var names = m[1].split(',').map(function(s) { return s.trim().split(/\s+/)[0]; });
    for (var ni = 0; ni < names.length; ni++) { if (!reserved[names[ni]]) symbols.push(names[ni]); }
  }
  return symbols;
}

async function buildPkg(pkg) {
  var distDir = path.join(ROOT, 'packages', pkg.name, 'dist');
  fs.mkdirSync(distDir, { recursive: true });

  console.log('  Bundling ' + pkg.name + '...');
  var entryPath = path.join(ROOT, 'packages', pkg.name, '_esm_entry.ts');

  var files = [];
  for (var d = 0; d < pkg.srcDirs.length; d++) {
    var srcDir = path.join(ROOT, pkg.srcDirs[d]);
    if (!fs.existsSync(srcDir)) continue;
    files = files.concat(walkTs(srcDir));
  }
  files = files.filter(function(f) {
    return !/[\\\/]native[\\\/]/.test(f) && !/NativeContext\.ts$/.test(f);
  });

  // For non-core packages, also include core egret files for proper ordering
  var hasEgret = pkg.srcDirs.some(function(d) { return d === 'src/egret'; });
  if (!hasEgret) {
    var coreDir = path.join(ROOT, 'src/egret');
    if (fs.existsSync(coreDir)) {
      var coreFiles = walkTs(coreDir).filter(function(f) {
        return !/[\\\/]native[\\\/]/.test(f) && !/NativeContext\.ts$/.test(f);
      });
      var existingSet = {};
      for (var ei = 0; ei < files.length; ei++) existingSet[files[ei]] = true;
      for (var ci = 0; ci < coreFiles.length; ci++) {
        if (!existingSet[coreFiles[ci]]) {
          existingSet[coreFiles[ci]] = true;
          files.push(coreFiles[ci]);
        }
      }
    }
  }

  var nsAssignments = [];
  var globalSeen = {};

  function getNsForFile(filePath) {
    var rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
    if (rel.startsWith('src/extension/eui/')) return 'eui';
    return 'egret';
  }

  for (var j = 0; j < files.length; j++) {
    var syms = extractExports(files[j]);
    var ns = getNsForFile(files[j]);
    for (var k = 0; k < syms.length; k++) {
      if (!globalSeen[syms[k]]) {
        globalSeen[syms[k]] = true;
        nsAssignments.push(ns + '.' + syms[k] + ' = ' + syms[k] + ';');
      }
    }
  }

  // Generate entry with inline namespace assignments
  var entry = '// Auto-generated ESM entry\n';
  if (hasEgret || files.some(function(f) { return f.indexOf('/egret/') >= 0; })) {
    var defRel = path.relative(path.dirname(entryPath), path.join(ROOT, 'src/Defines.debug')).replace(/\\/g, '/');
    entry += 'import "' + defRel + '";\n';
  }

  // Topological sort: files with fewer dependencies first
  // Read imports from each file to determine dependency order
  var fileDeps = {}; // relPath -> [relPaths it imports]
  for (var j = 0; j < files.length; j++) {
    var rel = path.relative(path.dirname(entryPath), files[j]).replace(/\\/g, '/').replace(/\.ts$/, '');
    if (!rel.startsWith('.')) rel = './' + rel;
    var content = fs.readFileSync(files[j], 'utf8');
    var importRe = /import\s+(?!type\b)(?:[\s\S]*?\s+from\s+)?['\"]([^'\"]+)['\"]/g;
    var deps = [];
    var im;
    while ((im = importRe.exec(content)) !== null) {
      var dep = im[1];
      if (dep.startsWith('.')) {
        var resolved = path.relative(path.dirname(entryPath), path.resolve(path.dirname(files[j]), dep)).replace(/\\/g, '/').replace(/\.ts$/, '');
        if (!resolved.startsWith('.')) resolved = './' + resolved;
        deps.push(resolved);
      }
    }
    fileDeps[rel] = deps;
  }

  // Simple topological sort: files that don't depend on other package files come first
  var sortedFiles = [];
  var remaining = files.slice();
  var fileRelToPath = {};
  for (var fj = 0; fj < files.length; fj++) {
    var relj = path.relative(path.dirname(entryPath), files[fj]).replace(/\\/g, '/').replace(/\.ts$/, '');
    if (!relj.startsWith('.')) relj = './' + relj;
    fileRelToPath[relj] = files[fj];
  }

  // Kahn's algorithm for topological sort
  // Build in-degree map
  var inDegree = {};
  var adjList = {}; // file -> [files that depend on it]
  for (var fi2 = 0; fi2 < files.length; fi2++) {
    var r2 = path.relative(path.dirname(entryPath), files[fi2]).replace(/\\/g, '/').replace(/\.ts$/, '');
    if (!r2.startsWith('.')) r2 = './' + r2;
    if (!(r2 in inDegree)) inDegree[r2] = 0;
    if (!adjList[r2]) adjList[r2] = [];
  }
  for (var fi3 = 0; fi3 < files.length; fi3++) {
    var r3 = path.relative(path.dirname(entryPath), files[fi3]).replace(/\\/g, '/').replace(/\.ts$/, '');
    if (!r3.startsWith('.')) r3 = './' + r3;
    var deps = fileDeps[r3] || [];
    for (var di = 0; di < deps.length; di++) {
      if (deps[di] in inDegree) {
        if (!adjList[deps[di]]) adjList[deps[di]] = [];
        adjList[deps[di]].push(r3);
        inDegree[r3] = (inDegree[r3] || 0) + 1;
      }
    }
  }

  // Kahn's: start with nodes that have 0 in-degree
  var queue = [];
  for (var r4 in inDegree) {
    if (inDegree[r4] === 0) queue.push(r4);
  }
  var sorted = [];
  while (queue.length > 0) {
    var node = queue.shift();
    sorted.push(node);
    var neighbors = adjList[node] || [];
    for (var ni = 0; ni < neighbors.length; ni++) {
      inDegree[neighbors[ni]]--;
      if (inDegree[neighbors[ni]] === 0) queue.push(neighbors[ni]);
    }
  }

  // Build new files array in sorted order
  var sortedFiles = [];
  var fileByRel = {};
  for (var fi4 = 0; fi4 < files.length; fi4++) {
    var r5 = path.relative(path.dirname(entryPath), files[fi4]).replace(/\\/g, '/').replace(/\.ts$/, '');
    if (!r5.startsWith('.')) r5 = './' + r5;
    fileByRel[r5] = files[fi4];
  }
  for (var si = 0; si < sorted.length; si++) {
    if (fileByRel[sorted[si]]) sortedFiles.push(fileByRel[sorted[si]]);
  }
  // Add any remaining files not in sorted (e.g., part of cycles)
  for (var fi5 = 0; fi5 < files.length; fi5++) {
    var r6 = path.relative(path.dirname(entryPath), files[fi5]).replace(/\\/g, '/').replace(/\.ts$/, '');
    if (!r6.startsWith('.')) r6 = './' + r6;
    if (sorted.indexOf(r6) < 0) sortedFiles.push(files[fi5]);
  }

  // CRITICAL: For non-core packages, ensure all core files come BEFORE extension files
  // This prevents "Class extends undefined" from extension classes extending core classes
  if (!hasEgret) {
    var coreFirst = [];
    var extLast = [];
    for (var cf = 0; cf < sortedFiles.length; cf++) {
      var relCf = path.relative(ROOT, sortedFiles[cf]).replace(/\\/g, '/');
      if (relCf.startsWith('src/egret/') || relCf.startsWith('src/Defines.')) {
        coreFirst.push(sortedFiles[cf]);
      } else {
        extLast.push(sortedFiles[cf]);
      }
    }
    sortedFiles = coreFirst.concat(extLast);
  }
  files = sortedFiles;
  // Reset for fileExportMap
  var exportSeen = {};
  var fileExportMap = {}; // relPath -> { ns, syms: [] }
  var exportedFiles = {};
  // Note: const enum members are stripped by esbuild, skip those
  // They appear after "export const enum Name {"
  function isConstEnumMember(filePath, symbol) {
    var content = fs.readFileSync(filePath, 'utf8');
    var re = /export\s+const\s+enum\s+\w+\s*\{([^}]*)\}/g;
    var m;
    while ((m = re.exec(content)) !== null) {
      var body = m[1];
      if (body.indexOf(symbol) >= 0) return true;
    }
    return false;
  }

  for (var j = 0; j < files.length; j++) {
    var syms = extractExports(files[j]);
    var rel = path.relative(path.dirname(entryPath), files[j]).replace(/\\/g, '/').replace(/\.ts$/, '');
    if (!rel.startsWith('.')) rel = './' + rel;
    var ns = getNsForFile(files[j]);
    if (syms.length > 0) {
      if (!fileExportMap[rel]) fileExportMap[rel] = { ns: ns, syms: [] };
      for (var k = 0; k < syms.length; k++) {
        if (!exportSeen[syms[k]] && !isConstEnumMember(files[j], syms[k])) {
          exportSeen[syms[k]] = true;
          fileExportMap[rel].syms.push(syms[k]);
        }
      }
    }
    exportedFiles[rel] = true;
  }

  var modIdx = 0;
  var fileKeys = Object.keys(fileExportMap);
  // Helper to avoid esbuild rename: use _ns(ns, "name", value)
  // instead of ns.name = value (which makes esbuild see name as both
  // a function def and a property, triggering rename).
  entry += 'function _ns(ns, k, v) { ns[k] = v; }\n';
  for (var fi = 0; fi < fileKeys.length; fi++) {
    var fe = fileExportMap[fileKeys[fi]];
    var modName = '$m' + (modIdx++);
    entry += 'import * as ' + modName + ' from "' + fileKeys[fi] + '";\n';
    for (var si = 0; si < fe.syms.length; si++) {
      entry += '_ns(' + fe.ns + ', "' + fe.syms[si] + '", ' + modName + '.' + fe.syms[si] + ');\n';
    }
  }

  // Add side-effect imports for files with no exports
  for (var fi2 = 0; fi2 < files.length; fi2++) {
    var rel2 = path.relative(path.dirname(entryPath), files[fi2]).replace(/\\/g, '/').replace(/\.ts$/, '');
    if (!rel2.startsWith('.')) rel2 = './' + rel2;
    if (!fileExportMap[rel2]) {
      entry += 'import "' + rel2 + '";\n';
    }
  }

  fs.writeFileSync(entryPath, entry, 'utf8');

  try {
    await esbuild.build({
      entryPoints: [entryPath],
      bundle: true, format: 'esm',
      outfile: path.join(distDir, 'index_tmp.js'),
      platform: 'neutral', target: 'es2020',
      keepNames: true,
      logLevel: 'error',
      banner: { js: '' },
      tsconfigRaw: { compilerOptions: { preserveConstEnums: false, useDefineForClassFields: false } },
    });

    // Post-process: wrap in IIFE for hoisting, then re-export
    var bundled = fs.readFileSync(path.join(distDir, 'index_tmp.js'), 'utf8');
    
    // Fix: esbuild renames $TextureScaleFactor -> $TextureScaleFactor2.
    // esbuild renames the declaration but NOT all cross-module usages.
    var lines = bundled.split('\n');
    for (var li = 0; li < lines.length; li++) {
      if (lines[li].indexOf('_ns(') >= 0 && lines[li].indexOf('"$TextureScaleFactor"') >= 0) continue;
      if (lines[li].indexOf('"$TextureScaleFactor"') >= 0) continue;
      lines[li] = lines[li].replace(/(?<!\w)\$TextureScaleFactor(?!\w)/g, '$TextureScaleFactor2');
    }
    bundled = lines.join('\n');

    // Fix: esbuild renames $TempMatrix -> $TempMatrix2.
    lines = bundled.split('\n');
    for (var li3 = 0; li3 < lines.length; li3++) {
      if (lines[li3].indexOf('_ns(') >= 0 && lines[li3].indexOf('"$TempMatrix"') >= 0) continue;
      if (lines[li3].indexOf('"$TempMatrix"') >= 0) continue;
      if (lines[li3].indexOf('var $TempMatrix2') >= 0) continue;
      lines[li3] = lines[li3].replace(/(?<!\w)\$TempMatrix(?!\w)/g, '$TempMatrix2');
    }
    bundled = lines.join('\n');

    // Fix: const enum members accessed via sys.*Keys — esbuild can't inline
    // These through namespace lookups. Replace with numeric values.
    // ListBaseKeys (extension/eui/components/supportClasses/ListBase.ts)
    bundled = bundled.replace(/sys\.ListBaseKeys\.requireSelection\b/g, '0');
    bundled = bundled.replace(/sys\.ListBaseKeys\.requireSelectionChanged\b/g, '1');
    bundled = bundled.replace(/sys\.ListBaseKeys\.proposedSelectedIndex\b/g, '2');
    bundled = bundled.replace(/sys\.ListBaseKeys\.selectedIndex\b/g, '3');
    bundled = bundled.replace(/sys\.ListBaseKeys\.dispatchChangeAfterSelection\b/g, '4');
    bundled = bundled.replace(/sys\.ListBaseKeys\.pendingSelectedItem\b/g, '5');
    bundled = bundled.replace(/sys\.ListBaseKeys\.selectedIndexAdjusted\b/g, '6');
    bundled = bundled.replace(/sys\.ListBaseKeys\.touchDownItemRenderer\b/g, '7');
    bundled = bundled.replace(/sys\.ListBaseKeys\.touchCancle\b/g, '8');

    // Fix: esbuild renames Event -> _Event but code still references Event.XXX
    // as a bare global (e.g. Event.ADDED, Event.ADDED_TO_STAGE). Replace all
    // Event. property accesses with _Event.
    lines = bundled.split('\n');
    for (var li4 = 0; li4 < lines.length; li4++) {
      if (lines[li4].indexOf('_ns(') >= 0) continue;
      if (lines[li4].indexOf('__name(') >= 0) continue;
      lines[li4] = lines[li4].replace(/\bEvent\./g, '_Event.');
    }
    bundled = lines.join('\n');

    // Fix: esbuild renames functions with a 2-suffix when there are naming
    // conflicts in the IIFE scope. The original unqualified name is still
    // used as a bare global in other modules.
    lines = bundled.split('\n');
    for (var li5 = 0; li5 < lines.length; li5++) {
      if (lines[li5].indexOf('_ns(') >= 0) continue;
      if (lines[li5].indexOf('__name(') >= 0) continue;
      if (lines[li5].indexOf('var toColorString2') >= 0) continue;
      if (lines[li5].indexOf('var EgretShaderLib2') >= 0) continue;
      if (lines[li5].indexOf('function tr2') >= 0) continue;
      if (lines[li5].indexOf('function toColorString2') >= 0) continue;
      if (lines[li5].indexOf('function getFontString2') >= 0) continue;
      if (lines[li5].indexOf('function getPrefixStyleName2') >= 0) continue;
      if (lines[li5].indexOf('function getDefinitionByName2') >= 0) continue;
      if (lines[li5].indexOf('function getQualifiedClassName2') >= 0) continue;
      lines[li5] = lines[li5].replace(/\btoColorString\b/g, 'toColorString2');
      lines[li5] = lines[li5].replace(/\bgetFontString\b/g, 'getFontString2');
      lines[li5] = lines[li5].replace(/\bgetPrefixStyleName\b/g, 'getPrefixStyleName2');
      lines[li5] = lines[li5].replace(/\bgetDefinitionByName\b(?!2)/g, 'getDefinitionByName2');
      lines[li5] = lines[li5].replace(/\bgetQualifiedClassName\b(?!2)/g, 'getQualifiedClassName2');
      lines[li5] = lines[li5].replace(/\btr(?=\()/g, 'tr2');
      lines[li5] = lines[li5].replace(/\bEgretShaderLib\b(?!2)/g, 'EgretShaderLib2');
    }
    bundled = lines.join('\n');

    var header = 'var egret = globalThis.egret || {sys:{}, pro:{}}, eui = globalThis.eui || {}, sys = egret.sys;\n';
    header += 'var __global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};\n';
    header += 'var global = __global;\n';
    header += 'var DEBUG = true, RELEASE = false;\n';
    var wrapped = header + '(function() {\n' + bundled + '\n}).call(window);\n';
    wrapped += 'if (typeof globalThis !== "undefined") { globalThis.egret = egret; globalThis.eui = eui; }\n';
    wrapped += 'export { egret, eui };\n';
    fs.writeFileSync(path.join(distDir, 'index.js'), wrapped, 'utf8');
    fs.unlinkSync(path.join(distDir, 'index_tmp.js'));

    console.log('    OK: index.js (' + files.length + ' files, ' + nsAssignments.length + ' ns assignments)');
  } catch (e) {
    console.error('    FAILED');
    console.error(e.message);
  }

  // Fix .d.ts: make it a proper ES module
  var dtsPath = path.join(distDir, 'index.d.ts');
  if (fs.existsSync(dtsPath)) {
    var dts = fs.readFileSync(dtsPath, 'utf8');
    // Extract all declared namespaces (e.g., "namespace egret {", "namespace eui {")
    var nsMatch = dts.match(/^namespace\s+(\w+)\s*\{/gm);
    var namespaces = [];
    if (nsMatch) {
      nsMatch.forEach(function(m) {
        var name = m.replace(/^namespace\s+/, '').replace(/\s*\{$/, '');
        if (namespaces.indexOf(name) === -1) namespaces.push(name);
      });
    }
    // Don't re-apply if already fixed (check for our tsc-generated pattern)
    if (dts.match(/^import\s+\{\s*egret\s*\}\s+from\s+'@egret-r\/core';/m) ||
        dts.match(/^import\s+'@egret-r\/core';/m) ||
        dts.indexOf('Auto-generated by tsc') >= 0) {
      console.log('    .d.ts already fixed, skipping');
    } else if (namespaces.length > 0) {
      // Fix esbuild renamed symbols referenced in .d.ts
      dts = dts.replace(/(?<![_a-zA-Z])Event\.([A-Z])/g, '_Event.$1');
      // Non-core packages need to import egret from core for type resolution
      // (e.g., eui.Label extends egret.TextField needs egret in scope)
      if (pkg.name !== 'core') {
        dts = "import { egret } from '@egret-r/core';\n" + dts;
      }
      // Export all declared namespaces
      dts = dts + '\nexport { ' + namespaces.join(', ') + ' };\n';
      fs.writeFileSync(dtsPath, dts, 'utf8');
    }
  }
}

async function main() {
  var watchMode = process.argv.includes('--watch');

  if (watchMode) {
    console.log('Building ESM packages (direct, watch mode)...\n');
    await buildAll();

    var srcDirs = PACKAGES.reduce(function(arr, p) {
      return arr.concat(p.srcDirs.map(function(d) { return path.join(ROOT, d); }));
    }, []);
    srcDirs.push(path.join(ROOT, 'src/Defines.debug.ts'));
    srcDirs.push(path.join(ROOT, 'src/Defines.release.ts'));

    console.log('\nWatching ' + watchPaths.length + ' source paths for changes...\n');

    // Use chokidar for reliable cross-platform file watching
    var chokidar = require('chokidar');
    var watchPaths = [];
    for (var si = 0; si < PACKAGES.length; si++) {
      for (var di = 0; di < PACKAGES[si].srcDirs.length; di++) {
        watchPaths.push(path.join(ROOT, PACKAGES[si].srcDirs[di]));
      }
    }
    watchPaths.push(path.join(ROOT, 'src/Defines.debug.ts'));
    watchPaths.push(path.join(ROOT, 'src/Defines.release.ts'));

    var watcher = chokidar.watch(watchPaths, {
      ignored: /[\\/](node_modules|native|packages\/\*\/dist)[\\/]/,
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: { stabilityThreshold: 300, pollInterval: 100 }
    });

    watcher.on('change', function(filePath) {
      if (filePath.endsWith('.ts')) {
        console.log('Changed: ' + path.relative(ROOT, filePath));
        scheduleRebuild();
      }
    });

    // Debounced rebuild
    var timer = null;
    var rebuilding = false;
    function scheduleRebuild() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(async function() {
        if (rebuilding) return;
        rebuilding = true;
        try {
          console.log('Rebuilding...\n');
          await buildAll();
          console.log('Build complete.\n');
        } catch (e) {
          console.error('Build error:', e.message);
        }
        rebuilding = false;
      }, 300);
    }
  } else {
    console.log('Building ESM packages (direct)...\n');
    await buildAll();
    console.log('\nDone.');
  }
}

async function buildAll() {
  for (var i = 0; i < PACKAGES.length; i++) {
    console.log('@egret-r/' + PACKAGES[i].name + ':');
    await buildPkg(PACKAGES[i]);
  }
}
main().catch(function(e) { console.error(e); process.exit(1); });

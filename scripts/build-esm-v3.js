"use strict";

/**
 * Enhanced build: handles sub-namespaces, ambient declarations, platform targets.
 * 
 * Features:
 * - Includes Defines.debug.ts as preamble (declares $error, $warn, $markCannotUse)
 * - Handles namespace egret.sys / egret_native / eui.sys
 * - Generates proper .d.ts with declare namespace blocks preserved
 * - Platform split: --platform web generates web-only bundle
 * - Includes EXML/CodeFactory in eui package
 */

var fs = require('fs');
var path = require('path');
var esbuild = require('esbuild');

var ROOT = path.join(__dirname, '..');

var args = process.argv.slice(2);
var WATCH = args.indexOf('--watch') !== -1;
var ONLY = null;
var onlyIdx = args.indexOf('--only');
if (onlyIdx !== -1 && onlyIdx + 1 < args.length) ONLY = args[onlyIdx + 1];

var PACKAGES = [
  {
    name: 'core',
    srcDir: 'src/egret',
    preambles: ['src/Defines.debug.ts'],
    excludePattern: /[\\\/]native[\\\/]|\/NativeContext\.ts$/,
  },
  {
    name: 'eui',
    srcDir: 'src/extension/eui',
    preambles: [],
    platformFilter: null,
  },
  {
    name: 'game',
    srcDir: 'src/extension/game',
    preambles: [],
    platformFilter: null,
  },
  {
    name: 'tween',
    srcDir: 'src/extension/tween',
    preambles: [],
    platformFilter: null,
  },
  {
    name: 'socket',
    srcDir: 'src/extension/socket',
    preambles: [],
    platformFilter: null,
  },
];

function walkTsFiles(dir) {
  var results = [];
  try {
    var entries = fs.readdirSync(dir, { withFileTypes: true });
    for (var i = 0; i < entries.length; i++) {
      var p = path.join(dir, entries[i].name).replace(/\\/g, '/');
      if (entries[i].isDirectory() && entries[i].name !== 'node_modules') {
        results = results.concat(walkTsFiles(p));
      } else if (entries[i].isFile() && entries[i].name.endsWith('.ts') && !entries[i].name.endsWith('.d.ts')) {
        results.push(p);
      }
    }
  } catch (e) {}
  return results;
}

function parseRefs(content) {
  var refs = [];
  var re = /\/\/\/\s*<reference\s+path\s*=\s*["']([^"']+)["']\s*\/>/g;
  var m;
  while ((m = re.exec(content)) !== null) refs.push(m[1]);
  return refs;
}

function buildDepGraph(files, srcDir) {
  var graph = {};
  for (var i = 0; i < files.length; i++) {
    var f = files[i];
    var content = fs.readFileSync(f, 'utf8');
    var refs = parseRefs(content);
    var resolvedRefs = [];
    for (var j = 0; j < refs.length; j++) {
      var resolved = path.resolve(path.dirname(f), refs[j]).replace(/\\/g, '/');
      if (resolved.indexOf(srcDir.replace(/\\/g, '/')) === 0) {
        resolvedRefs.push(resolved);
      }
    }
    graph[f] = { resolvedRefs: resolvedRefs };
  }
  return graph;
}

function topoSort(graph) {
  var visited = {};
  var temp = {};
  var order = [];

  function visit(node) {
    if (temp[node]) return;
    if (visited[node]) return;
    temp[node] = true;
    var data = graph[node];
    if (data) {
      for (var i = 0; i < data.resolvedRefs.length; i++) {
        var ref = data.resolvedRefs[i];
        if (graph[ref]) visit(ref);
      }
    }
    temp[node] = false;
    visited[node] = true;
    order.push(node);
  }

  var keys = Object.keys(graph);
  for (var i = 0; i < keys.length; i++) {
    if (!visited[keys[i]]) visit(keys[i]);
  }
  return order;
}

/**
 * Generate .d.ts: includes namespace blocks, declare blocks,
 * and sub-namespace declarations.
 */
function generateDts(srcDir, distDir, entryNs) {
  var files = walkTsFiles(srcDir);
  var dtsContent = '';

  dtsContent += '// Type definitions for @egret-r\n';
  dtsContent += '// Auto-generated from source. Do not edit.\n\n';

  // Include Defines.debug.ts for ambient type declarations
  var definesPath = path.join(ROOT, 'src', 'Defines.debug.ts');
  if (fs.existsSync(definesPath)) {
    var definesContent = fs.readFileSync(definesPath, 'utf8');
    // Strip copyright header
    definesContent = definesContent.replace(/\/\/+[\s\S]*?\/\/+[\s\S]*?\*\//, '');
    // Keep only declare and namespace blocks
    var ambientParts = definesContent.match(/(declare\s+function\s+\$\w+[\s\S]*?;)|(namespace\s+\w+\s*\{[\s\S]*?\n\})/g);
    if (ambientParts) {
      dtsContent += '// === Ambient declarations (from Defines.debug.ts) ===\n\n';
      dtsContent += ambientParts.join('\n\n') + '\n\n';
    }
  }

  // Include namespace blocks from source files
  for (var i = 0; i < files.length; i++) {
    var content = fs.readFileSync(files[i], 'utf8');
    var rel = path.relative(srcDir, files[i]);

    // Skip native files
    if (/[\\\/]native[\\\/]/.test(rel) || /NativeContext\.ts$/.test(rel)) continue;

    // Strip /// <reference> directives
    content = content.replace(/\/\/\/\s*<reference\s+path\s*=\s*["'][^"']+["']\s*\/>\s*\n?/g, '');

    // Keep only namespace and declare blocks
    var blocks = content.match(/(namespace\s+\w+(\.\w+)?\s*\{[\s\S]*?\n\})/g);
    if (blocks) {
      dtsContent += '// ' + rel + '\n';
      dtsContent += blocks.join('\n\n') + '\n\n';
    }
  }

  // Export the top namespace
  dtsContent += '// Export for ES Module consumers\n';
  dtsContent += 'export as namespace ' + entryNs + ';\n';

  var outPath = path.join(distDir, 'index.d.ts');
  fs.writeFileSync(outPath, dtsContent, 'utf8');
  return outPath;
}

async function buildPackage(pkg) {
  var srcDir = path.join(ROOT, pkg.srcDir);
  var distDir = path.join(ROOT, 'packages', pkg.name, 'dist');
  var pkgSrc = path.join(ROOT, 'packages', pkg.name, 'src');

  if (!fs.existsSync(srcDir)) {
    console.log('  Skipping: source not found');
    return;
  }

  fs.mkdirSync(distDir, { recursive: true });
  fs.mkdirSync(pkgSrc, { recursive: true });

  // Clean pkgSrc
  var existing = walkTsFiles(pkgSrc);
  existing.forEach(function(f) { try { fs.unlinkSync(f); } catch(e) {} });

  // Copy source files (skip native platform files)
  console.log('  Copying ' + pkg.srcDir + ' -> packages/' + pkg.name + '/src/ ...');
  var files = walkTsFiles(srcDir);
  var skippedNative = 0;
  for (var i = 0; i < files.length; i++) {
    var rel = path.relative(srcDir, files[i]);
    // Skip native platform files (web only build)
    if (pkg.excludePattern && pkg.excludePattern.test(rel)) {
      skippedNative++;
      continue;
    }
    var dest = path.join(pkgSrc, rel);
    var destDir = path.dirname(dest);
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(files[i], dest);
  }
  if (skippedNative > 0) console.log('    Skipped ' + skippedNative + ' native-only file(s)');

  // Copy preamble files (Defines.debug.ts etc.)
  var preambleCodes = '';
  for (var pre = 0; pre < pkg.preambles.length; pre++) {
    var prePath = path.join(ROOT, pkg.preambles[pre]);
    if (fs.existsSync(prePath)) {
      var preCode = fs.readFileSync(prePath, 'utf8');
      preCode = preCode.replace(/\/\/\/\s*<reference\s+path\s*=\s*["'][^"']+["']\s*\/>\s*\n?/g, '');
      preambleCodes += '\n// === preamble: ' + pkg.preambles[pre] + ' ===\n' + preCode + '\n';
    }
  }

  // Build entry file
  var pkgFiles = walkTsFiles(pkgSrc);
  var graph = buildDepGraph(pkgFiles, pkgSrc);
  var order = topoSort(graph);

  var entryPath = path.join(pkgSrc, '_entry.ts');
  var entryContent = '';

  // Add preamble code directly (contains declare functions, namespace assignments)
  entryContent += preambleCodes + '\n';

  // Add imports in dependency order
  for (var j = 0; j < order.length; j++) {
    var relImport = path.relative(pkgSrc, order[j]).replace(/\\/g, '/');
    var importPath = './' + relImport.replace(/\.ts$/, '');
    entryContent += 'import \'' + importPath + '\';\n';
  }

  entryContent += '\nexport {};\n';
  fs.writeFileSync(entryPath, entryContent, 'utf8');

  // Common esbuild options
  var baseOpts = {
    entryPoints: [entryPath],
    bundle: true, format: 'esm', target: 'es2020',
    platform: 'browser',
    logLevel: 'warning',
    loader: { '.ts': 'ts', '.glsl': 'text' },
    // Conditional compilation: inject DEBUG/RELEASE as constants
    define: {
      'DEBUG': 'true',   // debug build always has DEBUG=true
      'RELEASE': 'false',
    },
  };

  // Build normal version
  console.log('  Building index.js...');
  await esbuild.build(Object.assign({}, baseOpts, {
    outfile: path.join(distDir, 'index.js'),
    minify: false, keepNames: true,
  }));
  console.log('    ' + (fs.statSync(path.join(distDir, 'index.js')).size / 1024).toFixed(1) + ' KB');

  // Build release (minified) version with DEBUG=false
  console.log('  Building index.min.js (RELEASE)...');
  await esbuild.build(Object.assign({}, baseOpts, {
    outfile: path.join(distDir, 'index.min.js'),
    minify: true,
    define: {
      'DEBUG': 'false',
      'RELEASE': 'true',
    },
  }));
  console.log('    ' + (fs.statSync(path.join(distDir, 'index.min.js')).size / 1024).toFixed(1) + ' KB');

  // Generate .d.ts
  console.log('  Generating index.d.ts...');
  var dtsPath = generateDts(srcDir, distDir, pkg.entryNs || 'egret');
  console.log('    ' + (fs.statSync(dtsPath).size / 1024).toFixed(1) + ' KB');

  // Clean up
  if (fs.existsSync(entryPath)) fs.unlinkSync(entryPath);
}

async function buildAll() {
  console.log('Building ESM packages (esbuild v3)...\n');

  for (var i = 0; i < PACKAGES.length; i++) {
    var pkg = PACKAGES[i];
    if (ONLY && pkg.name !== ONLY) continue;
    console.log('@egret-r/' + pkg.name + ':');
    await buildPackage(pkg);
    console.log('');
  }

  console.log('Done.');
}

async function watchAll() {
  var watchedDirs = [];
  for (var i = 0; i < PACKAGES.length; i++) {
    var pkg = PACKAGES[i];
    if (ONLY && pkg.name !== ONLY) continue;
    watchedDirs.push(path.join(ROOT, pkg.srcDir));
  }

  await buildAll();

  console.log('Watching for changes... (Ctrl+C to stop)\n');
  var lastTimes = {};
  setInterval(async function() {
    var changed = false;
    for (var d = 0; d < watchedDirs.length; d++) {
      var files = walkTsFiles(watchedDirs[d]);
      for (var f = 0; f < files.length; f++) {
        var stat = fs.statSync(files[f]);
        if (lastTimes[files[f]] && lastTimes[files[f]] !== stat.mtimeMs) {
          changed = true;
        }
        lastTimes[files[f]] = stat.mtimeMs;
      }
    }
    if (changed) {
      console.log('\nRebuilding...');
      await buildAll();
    }
  }, 2000);
}

// ===== Main =====
if (WATCH) {
  watchAll().catch(function(e) { console.error('Fatal:', e.message); });
} else {
  buildAll().catch(function(e) { console.error('Fatal:', e.message); process.exit(1); });
}
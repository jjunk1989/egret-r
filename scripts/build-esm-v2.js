"use strict";

/**
 * Build ESM packages with esbuild from namespace source files.
 * 
 * Supports: --watch, --minify, --only <pkg>
 * Generates: index.js, index.min.js, index.d.ts
 */

var fs = require('fs');
var path = require('path');
var esbuild = require('esbuild');

var ROOT = path.join(__dirname, '..');

var PACKAGES = [
  { name: 'core',  srcDir: 'src/egret',          entryNs: 'egret' },
  { name: 'eui',   srcDir: 'src/extension/eui',  entryNs: 'eui' },
  { name: 'game',  srcDir: 'src/extension/game', entryNs: 'game' },
  { name: 'tween', srcDir: 'src/extension/tween', entryNs: 'tween' },
  { name: 'socket', srcDir: 'src/extension/socket', entryNs: 'socket' },
];

// Parse CLI args
var args = process.argv.slice(2);
var WATCH = args.indexOf('--watch') !== -1;
var MINIFY = args.indexOf('--minify') !== -1;
var ONLY = null;
var onlyIdx = args.indexOf('--only');
if (onlyIdx !== -1 && onlyIdx + 1 < args.length) ONLY = args[onlyIdx + 1];

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
 * Generate .d.ts by concatenating all namespace .d.ts declarations.
 * esbuild doesn't emit .d.ts, so we generate from source.
 */
function generateDts(srcDir, distDir) {
  var files = walkTsFiles(srcDir);
  var dtsContent = '';

  // Header
  dtsContent += '// Type definitions for egret-r\n';
  dtsContent += '// Auto-generated from source. Do not edit.\n\n';

  // Extract declare declarations and namespace blocks from each file
  for (var i = 0; i < files.length; i++) {
    var content = fs.readFileSync(files[i], 'utf8');

    // Strip /// <reference> directives
    content = content.replace(/\/\/\/\s*<reference\s+path\s*=\s*["'][^"']+["']\s*\/>\s*\n?/g, '');

    // Keep declare namespace blocks and declarations
    var declareMatch = content.match(/declare\s+(namespace|class|interface|function|let|const|enum|type)\s+[\s\S]*?^}/gm);
    if (declareMatch) {
      dtsContent += declareMatch.join('\n\n') + '\n\n';
    }

    // Also include namespace blocks (they define types)
    var nsMatch = content.match(/namespace\s+\w+\s*\{[\s\S]*?^\}/gm);
    if (nsMatch) {
      dtsContent += nsMatch.join('\n\n') + '\n\n';
    }
  }

  // Export namespaces
  dtsContent += '\nexport as namespace egret;\n';
  dtsContent += 'export { egret, eui, egret_native };\n';

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

  // Ensure directories exist
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
  if (!fs.existsSync(pkgSrc)) fs.mkdirSync(pkgSrc, { recursive: true });

  // Copy source files to package src
  console.log('  Copying ' + pkg.srcDir + ' -> packages/' + pkg.name + '/src/ ...');
  var files = walkTsFiles(srcDir);

  for (var i = 0; i < files.length; i++) {
    var rel = path.relative(srcDir, files[i]);
    var dest = path.join(pkgSrc, rel);
    var destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(files[i], dest);
  }

  // Build dependency graph and topological sort
  var pkgFiles = walkTsFiles(pkgSrc);
  var graph = buildDepGraph(pkgFiles, pkgSrc);
  var order = topoSort(graph);

  // Create entry file with imports in dependency order
  var entryPath = path.join(pkgSrc, '_entry.ts');
  var entryContent = '';
  for (var j = 0; j < order.length; j++) {
    var relImport = path.relative(pkgSrc, order[j]).replace(/\\/g, '/');
    var importPath = './' + relImport.replace(/\.ts$/, '');
    entryContent += 'import \'' + importPath + '\';\n';
  }
  entryContent += '\nexport {};\n';
  fs.writeFileSync(entryPath, entryContent, 'utf8');

  var outFile = path.join(distDir, 'index.js');
  var outMinFile = path.join(distDir, 'index.min.js');

  try {
    // Build normal version
    console.log('  Building index.js...');
    await esbuild.build({
      entryPoints: [entryPath],
      bundle: true,
      format: 'esm',
      target: 'es2020',
      outfile: outFile,
      platform: 'browser',
      minify: false,
      keepNames: true,
      logLevel: 'warning',
      loader: { '.ts': 'ts', '.glsl': 'text' },
    });
    console.log('    ' + (fs.statSync(outFile).size / 1024).toFixed(1) + ' KB');

    // Build minified version
    console.log('  Building index.min.js...');
    await esbuild.build({
      entryPoints: [entryPath],
      bundle: true,
      format: 'esm',
      target: 'es2020',
      outfile: outMinFile,
      platform: 'browser',
      minify: true,
      keepNames: false,
      logLevel: 'warning',
      loader: { '.ts': 'ts', '.glsl': 'text' },
    });
    console.log('    ' + (fs.statSync(outMinFile).size / 1024).toFixed(1) + ' KB');

    // Generate .d.ts
    console.log('  Generating index.d.ts...');
    var dtsPath = generateDts(srcDir, distDir);
    var dtsStat = fs.statSync(dtsPath);
    console.log('    ' + (dtsStat.size / 1024).toFixed(1) + ' KB');

  } catch (e) {
    console.error('  Build error: ' + e.message);
  }

  // Clean up entry file
  if (fs.existsSync(entryPath)) fs.unlinkSync(entryPath);
}

async function buildAll() {
  console.log('Building ESM packages with esbuild...\n');

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
  console.log('Watching for changes...\n');

  // Watch all source directories
  var watchedDirs = [];
  for (var i = 0; i < PACKAGES.length; i++) {
    var pkg = PACKAGES[i];
    if (ONLY && pkg.name !== ONLY) continue;
    var srcDir = path.join(ROOT, pkg.srcDir);
    if (fs.existsSync(srcDir)) watchedDirs.push(srcDir);
  }

  // Initial build
  await buildAll();

  // Set up file watchers
  var chokidar;
  try { chokidar = require('chokidar'); } catch (e) {}

  if (chokidar) {
    var watcher = chokidar.watch(watchedDirs, {
      ignored: /(^|[\/\\])\../,
      persistent: true,
    });

    var rebuildTimer = null;
    watcher.on('change', function(filePath) {
      clearTimeout(rebuildTimer);
      rebuildTimer = setTimeout(function() {
        console.log('\nFile changed: ' + path.relative(ROOT, filePath));
        buildAll();
      }, 300);
    });

    console.log('Watching ' + watchedDirs.length + ' directories. Press Ctrl+C to stop.');
  } else {
    console.log('  (chokidar not available. Install with: npm i -D chokidar)');
    console.log('  Falling back to polling watch...');

    // Simple polling watch
    var lastTimes = {};
    setInterval(async function() {
      var changed = false;
      for (var d = 0; d < watchedDirs.length; d++) {
        var files = walkTsFiles(watchedDirs[d]);
        for (var f = 0; f < files.length; f++) {
          var stat = fs.statSync(files[f]);
          var mtime = stat.mtimeMs;
          if (lastTimes[files[f]] && lastTimes[files[f]] !== mtime) {
            changed = true;
          }
          lastTimes[files[f]] = mtime;
        }
      }
      if (changed) {
        console.log('\nFiles changed, rebuilding...');
        await buildAll();
      }
    }, 2000);
    console.log('Polling every 2 seconds. Press Ctrl+C to stop.');
  }
}

// ===== Main =====

if (WATCH) {
  watchAll().catch(function(e) {
    console.error('Fatal:', e.message);
  });
} else {
  buildAll().catch(function(e) {
    console.error('Fatal:', e.message);
    process.exit(1);
  });
}
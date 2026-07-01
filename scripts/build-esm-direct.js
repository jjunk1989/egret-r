"use strict";
var fs = require('fs'), path = require('path'), esbuild = require('esbuild');
var ROOT = path.join(__dirname, '..');

var PACKAGES = [
  { name: 'core', srcDir: 'src/egret' },
  { name: 'eui', srcDir: 'src/extension/eui' },
  { name: 'game', srcDir: 'src/extension/game' },
  { name: 'tween', srcDir: 'src/extension/tween' },
  { name: 'socket', srcDir: 'src/extension/socket' },
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

async function buildPkg(pkg) {
  var srcDir = path.join(ROOT, pkg.srcDir);
  var distDir = path.join(ROOT, 'packages', pkg.name, 'dist');
  if (!fs.existsSync(srcDir)) { console.log('  Skip'); return; }
  fs.mkdirSync(distDir, { recursive: true });

  console.log('  Bundling ' + pkg.name + '...');
  var entryPath = path.join(ROOT, 'packages', pkg.name, '_esm_entry.ts');
  var files = walkTs(srcDir).filter(function(f) { return !/[\\\/]native[\\\/]/.test(f) && !/NativeContext\.ts$/.test(f); });

  // Generate entry with all imports
  var imports = '// Auto-generated ESM entry\n';
  // Add Defines.debug first for core
  if (pkg.name === 'core') {
    imports += 'import "' + path.relative(path.dirname(entryPath), path.join(ROOT, 'src/Defines.debug')).replace(/\\/g, '/') + '";\n';
  }
  for (var j = 0; j < files.length; j++) {
    var rel = path.relative(path.dirname(entryPath), files[j]).replace(/\\/g, '/').replace(/\.ts$/, '');
    if (!rel.startsWith('.')) rel = './' + rel;
    imports += 'import "' + rel + '";\n';
  }
  fs.writeFileSync(entryPath, imports, 'utf8');

  try {
    await esbuild.build({
      entryPoints: [entryPath],
      bundle: true, format: 'iife', globalName: '__egret_bundle__',
      outfile: path.join(distDir, 'index.js'),
      platform: 'browser', target: 'es2020',
      logLevel: 'warning',
      banner: { js: 'var egret = {}; var eui = {};' },
      footer: { js: 'globalThis.egret = egret; globalThis.eui = eui;' },
    });
    console.log('    OK: index.js');
  } catch (e) {
    console.error('    FAILED');
  }
}

async function main() {
  console.log('Building ESM packages (direct)...\n');
  for (var i = 0; i < PACKAGES.length; i++) {
    console.log('@egret-r/' + PACKAGES[i].name + ':');
    await buildPkg(PACKAGES[i]);
  }
  console.log('\nDone.');
}
main().catch(function(e) { console.error(e); process.exit(1); });

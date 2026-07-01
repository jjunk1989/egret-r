"use strict";

var fs = require('fs');
var path = require('path');
var esbuild = require('esbuild');

var ROOT = path.join(__dirname, '..');

var PACKAGES = [
  { name: 'core', srcDir: 'src/egret', ns: 'egret' },
  { name: 'eui', srcDir: 'src/extension/eui', ns: 'eui' },
  { name: 'game', srcDir: 'src/extension/game', ns: 'egret' },
  { name: 'tween', srcDir: 'src/extension/tween', ns: 'egret' },
  { name: 'socket', srcDir: 'src/extension/socket', ns: 'egret' },
];

function walkTs(dir) {
  var r = [];
  try {
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
  var pkgSrc = path.join(ROOT, 'packages', pkg.name, 'src');

  if (!fs.existsSync(srcDir)) { console.log('  Skip: not found'); return; }
  fs.mkdirSync(distDir, { recursive: true });
  fs.mkdirSync(pkgSrc, { recursive: true });

  // Clean and copy
  walkTs(pkgSrc).forEach(function(f) { try { fs.unlinkSync(f); } catch(e) {} });
  var files = walkTs(srcDir);
  var skipped = 0;
  for (var i = 0; i < files.length; i++) {
    var rel = path.relative(srcDir, files[i]);
    // Skip native
    if (/[\\\/]native[\\\/]/.test(rel) || /NativeContext\.ts$/.test(rel)) { skipped++; continue; }
    var dest = path.join(pkgSrc, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(files[i], dest);
  }
  if (skipped) console.log('    Skipped ' + skipped + ' native file(s)');

  console.log('  Bundling ' + pkg.name + '...');

  // Create entry that glob-imports all modules
  var pkgFiles = walkTs(pkgSrc);
  var imports = '// Auto-generated entry\n';
  // Include Defines.debug first
  if (pkg.name === 'core') {
    var definesSrc = path.join(ROOT, 'src/Defines.debug.ts');
    if (fs.existsSync(definesSrc)) {
      // Place at package root so ../../Defines.debug resolves from src/events/ etc.
      fs.copyFileSync(definesSrc, path.join(ROOT, 'packages', pkg.name, 'Defines.debug.ts'));
    }
    imports += 'import "../Defines.debug";\n';
  }
  for (var j = 0; j < pkgFiles.length; j++) {
    var rel = path.relative(pkgSrc, pkgFiles[j]).replace(/\\/g, '/').replace(/\.ts$/, '');
    if (rel === '_main') continue;
    imports += 'import "./' + rel + '";\n';
  }
  var entryPath = path.join(pkgSrc, '_main.ts');
  fs.writeFileSync(entryPath, imports, 'utf8');

  try {
    await esbuild.build({
      entryPoints: [entryPath],
      bundle: true,
      format: 'iife',
      globalName: pkg.ns,
      outfile: path.join(distDir, 'index.js'),
      platform: 'browser',
      target: 'es2020',
      logLevel: 'warning',
    });
    console.log('    OK: ' + path.join(distDir, 'index.js'));
  } catch (e) {
    console.error('    FAILED: ' + e.message);
  }
}

async function main() {
  console.log('Building ESM packages (direct bundle)...\n');
  for (var i = 0; i < PACKAGES.length; i++) {
    console.log('@egret-r/' + PACKAGES[i].name + ':');
    await buildPkg(PACKAGES[i]);
  }
  console.log('\nDone.');
}

main().catch(function(e) { console.error(e); process.exit(1); });

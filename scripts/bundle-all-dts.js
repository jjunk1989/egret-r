// Bundle individual .d.ts from tsc into single index.d.ts
// Handles cross-namespace type references (e.g., eui.Label extends egret.TextField)
var fs = require('fs');
var path = require('path');
var ROOT = __dirname + '/..';

function walkDts(dir) {
  var results = [];
  if (!fs.existsSync(dir)) return results;
  var entries = fs.readdirSync(dir, { withFileTypes: true });
  for (var i = 0; i < entries.length; i++) {
    var p = path.join(dir, entries[i].name);
    if (entries[i].isDirectory()) results = results.concat(walkDts(p));
    else if (entries[i].isFile() && p.endsWith('.d.ts')) results.push(p);
  }
  return results;
}

// Build map from extension basenames
var extensionFiles = {};
['eui', 'game', 'tween', 'socket'].forEach(function(ext) {
  var extDir = path.join(ROOT, 'src', 'extension', ext);
  if (!fs.existsSync(extDir)) return;
  extensionFiles[ext] = {};
  function walkExt(dir) {
    var entries = fs.readdirSync(dir, { withFileTypes: true });
    for (var i = 0; i < entries.length; i++) {
      var p = path.join(dir, entries[i].name);
      if (entries[i].isDirectory()) walkExt(p);
      else if (entries[i].isFile() && p.endsWith('.ts')) extensionFiles[ext][path.basename(p, '.ts')] = true;
    }
  }
  walkExt(extDir);
});

function getNs(filePath, pkgName) {
  var basename = path.basename(filePath, '.d.ts');
  if (extensionFiles['eui'] && extensionFiles['eui'][basename]) return 'eui';
  if (extensionFiles['game'] && extensionFiles['game'][basename]) return 'game';
  if (extensionFiles['tween'] && extensionFiles['tween'][basename]) return 'tween';
  if (extensionFiles['socket'] && extensionFiles['socket'][basename]) return 'socket';
  return 'egret';
}

// Scan all .d.ts files to build symbol-to-namespace mapping
function buildSymbolMap(files, distDir, pkgName) {
  var map = {};
  for (var i = 0; i < files.length; i++) {
    var rel = path.relative(distDir, files[i]);
    var ns = getNs(rel, pkgName);
    var content = fs.readFileSync(files[i], 'utf8');
    var decls = content.match(/export\s+(declare\s+)?(class|function|interface|enum|type|const|let|var|namespace)\s+(\w+)/g);
    if (decls) {
      for (var d = 0; d < decls.length; d++) {
        var name = decls[d].replace(/export\s+(declare\s+)?(class|function|interface|enum|type|const|let|var|namespace)\s+/, '');
        map[name] = ns;
      }
    }
  }
  return map;
}

function convertToNamespace(content, targetNs, symbolMap) {
  // Process imports: convert cross-namespace imports to aliases
  var importRe = /^import\s+\{([^}]+)\}\s+from\s+["']([^"']+)["'];?\s*$/gm;
  var aliases = [];
  var m;
  while ((m = importRe.exec(content)) !== null) {
    var symbols = m[1].split(',').map(function(s) { return s.trim().replace(/^type\s+/, ''); });
    var fromPath = m[2];
    var sourceBasename = path.basename(fromPath, '.js');
    // Determine namespace: check if the basename matches an extension
    var sourceNs = 'egret';
    for (var ext in extensionFiles) {
      if (extensionFiles[ext] && extensionFiles[ext][sourceBasename]) {
        sourceNs = ext;
        break;
      }
    }
    
    if (sourceNs !== targetNs && sourceNs === 'egret') {
      for (var s = 0; s < symbols.length; s++) {
        var sym = symbols[s].trim();
        if (!sym) continue;
        aliases.push('    import ' + sym + ' = egret.' + sym + ';');
      }
    }
  }
  
  // Remove all import statements
  content = content.replace(/^import\s+type\s+.*$/gm, '');
  content = content.replace(/^import\s+\{.*?\}\s+from\s+["'][^"']+["'];?\s*$/gm, '');
  content = content.replace(/^import\s+\*\s+as\s+\w+\s+from\s+["'][^"']+["'];?\s*$/gm, '');
  content = content.replace(/^import\s+["'][^"']+["'];?\s*$/gm, '');
  content = content.replace(/^\/\/# sourceMappingURL.*$/gm, '');
  content = content.replace(/^export\s+(default\s+)?/gm, '');
  content = content.trim();
  
  if (aliases.length > 0) {
    content = aliases.join('\n') + '\n' + content;
  }
  
  return content;
}

function bundle(pkgName) {
  var distDir = path.join(ROOT, 'packages', pkgName, 'dist');
  var dtsFiles = walkDts(distDir).filter(function(f) {
    var basename = path.basename(f);
    return basename !== 'index.d.ts' && basename !== '_entry.d.ts';
  }).sort();

  if (dtsFiles.length === 0) {
    console.log('  ' + pkgName + ': no files found');
    return;
  }

  var symbolMap = buildSymbolMap(dtsFiles, distDir, pkgName);

  var nsBlocks = {};
  for (var i = 0; i < dtsFiles.length; i++) {
    var rel = path.relative(distDir, dtsFiles[i]);
    var ns = getNs(rel, pkgName);
    
    // For game/tween/socket packages, skip core egret files (they duplicate core)
    // Only keep extension-specific files, which augment egret globally
    if ((pkgName === 'game' || pkgName === 'tween' || pkgName === 'socket') && ns === 'egret') {
      continue;
    }
    // game/tween/socket types augment egret namespace
    if (pkgName === 'game' && ns === 'game') ns = 'egret';
    if (pkgName === 'tween' && ns === 'tween') ns = 'egret';
    if (pkgName === 'socket' && ns === 'socket') ns = 'egret';
    
    var content = fs.readFileSync(dtsFiles[i], 'utf8');
    var converted = convertToNamespace(content, ns, symbolMap);
    if (converted) {
      if (!nsBlocks[ns]) nsBlocks[ns] = [];
      nsBlocks[ns].push('// ' + rel + '\n' + converted);
    }
  }

  var dts = '// Type definitions for @egret-r\n';
  dts += '// Auto-generated by tsc --emitDeclarationOnly. Do not edit.\n\n';
  if (pkgName !== 'core' && pkgName !== 'game' && pkgName !== 'tween' && pkgName !== 'socket') {
    dts += "import { egret } from '@egret-r/core';\n\n";
  }

  var allNs = Object.keys(nsBlocks);
  // For eui, don't declare egret namespace (it comes from import and eui has own namespace)
  // For game/tween/socket, keep egret namespace (they augment it)
  if (pkgName === 'eui') {
    allNs = allNs.filter(function(ns) { return ns !== 'egret'; });
  }
  for (var n = 0; n < allNs.length; n++) {
    var ns = allNs[n];
    // game/tween/socket augment egret globally so consumers importing from core see them
    if (ns === 'egret' && pkgName !== 'core' && pkgName !== 'eui') {
      dts += 'declare global {\n';
      dts += '    namespace ' + ns + ' {\n';
      dts += nsBlocks[ns].join('\n\n');
      dts += '\n    }\n';
      dts += '}\n\n';
    } else {
      dts += 'declare namespace ' + ns + ' {\n';
      dts += nsBlocks[ns].join('\n\n');
      dts += '\n}\n\n';
    }
  }

  dts += 'export as namespace egret;\n';
  if (allNs.length > 0) {
    dts += '\nexport { ' + allNs.join(', ') + ' };\n';
  }

  var outPath = path.join(distDir, 'index.d.ts');
  fs.writeFileSync(outPath, dts, 'utf8');
  
  dtsFiles.forEach(function(f) { try { fs.unlinkSync(f); } catch(e) {} });
  try { fs.unlinkSync(path.join(distDir, '_entry.d.ts')); } catch(e) {}
  try { fs.unlinkSync(path.join(distDir, '_entry.d.ts.map')); } catch(e) {}

  console.log('  ' + pkgName + ': ' + fs.statSync(outPath).size.toLocaleString() + ' bytes, ' + dtsFiles.length + ' files');
}

console.log('Bundling .d.ts files...\n');
bundle('core');
bundle('eui');
bundle('game');
bundle('socket');
bundle('tween');
console.log('\nDone.');

// Fix broken .d.ts files by regenerating from source
var fs = require('fs');
var path = require('path');

var ROOT = __dirname + '/..';

function walkTsFiles(dir) {
  var results = [];
  if (!fs.existsSync(dir)) return results;
  var entries = fs.readdirSync(dir, { withFileTypes: true });
  for (var i = 0; i < entries.length; i++) {
    var p = path.join(dir, entries[i].name);
    if (entries[i].isDirectory()) {
      results = results.concat(walkTsFiles(p));
    } else if (entries[i].isFile() && p.endsWith('.ts') && !p.endsWith('.d.ts')) {
      results.push(p);
    }
  }
  return results;
}

function generateDts(srcDir, distDir, entryNs, pkgName) {
  var files = walkTsFiles(srcDir);
  var dtsContent = '';

  dtsContent += '// Type definitions for @egret-r\n';
  dtsContent += '// Auto-generated from source. Do not edit.\n\n';

  // Include Defines.debug.ts for ambient type declarations
  var definesPath = path.join(ROOT, 'src', 'Defines.debug.ts');
  if (fs.existsSync(definesPath)) {
    var definesContent = fs.readFileSync(definesPath, 'utf8');
    definesContent = definesContent.replace(/\/\/+[\s\S]*?\/\/+[\s\S]*?\*\//, '');
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

    if (/[\\\/]native[\\\/]/.test(rel) || /NativeContext\.ts$/.test(rel)) continue;

    content = content.replace(/\/\/\/\s*<reference\s+path\s*=\s*["'][^"']+["']\s*\/>\s*\n?/g, '');

    var blocks = content.match(/(namespace\s+\w+(\.\w+)?\s*\{[\s\S]*?\n\})/g);
    if (blocks) {
      dtsContent += '// ' + rel + '\n';
      dtsContent += blocks.join('\n\n') + '\n\n';
    }
  }

  // Export for ES Module consumers
  dtsContent += '// Export for ES Module consumers\n';
  dtsContent += 'export as namespace ' + entryNs + ';\n';

  // Add ESM module exports
  if (pkgName === 'core') {
    dtsContent += '\nexport { egret };\n';
  } else {
    dtsContent = "import { egret } from '@egret-r/core';\n" + dtsContent;
    // Find all namespace names declared in this file
    var nsMatch = dtsContent.match(/^namespace\s+(\w+)\s*\{/gm);
    var namespaces = ['egret'];
    if (nsMatch) {
      nsMatch.forEach(function(m) {
        var name = m.replace(/^namespace\s+/, '').replace(/\s*\{$/, '');
        if (name !== 'egret' && namespaces.indexOf(name) === -1) namespaces.push(name);
      });
    }
    dtsContent += '\nexport { ' + namespaces.join(', ') + ' };\n';
  }

  var outPath = path.join(distDir, 'index.d.ts');
  fs.writeFileSync(outPath, dtsContent, 'utf8');
  console.log('  Generated: ' + outPath);
  return outPath;
}

// Regenerate all .d.ts files
console.log('Regenerating .d.ts files...\n');

generateDts(path.join(ROOT, 'src/egret'), path.join(ROOT, 'packages/core/dist'), 'egret', 'core');
generateDts(path.join(ROOT, 'src/extension/eui'), path.join(ROOT, 'packages/eui/dist'), 'egret', 'eui');
generateDts(path.join(ROOT, 'src/extension/game'), path.join(ROOT, 'packages/game/dist'), 'egret', 'game');
generateDts(path.join(ROOT, 'src/extension/tween'), path.join(ROOT, 'packages/tween/dist'), 'egret', 'tween');
generateDts(path.join(ROOT, 'src/extension/socket'), path.join(ROOT, 'packages/socket/dist'), 'egret', 'socket');

console.log('\nDone!');

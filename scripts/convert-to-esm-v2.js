/**
 * V2 Converter: Two-pass conversion that builds symbol map first,
 * then generates proper named imports.
 * 
 * Pass 1: Scan all files, build symbol → file mapping
 * Pass 2: For each file, detect used symbols, generate imports
 */

const fs = require('fs');
const path = require('path');

// First pass: build symbol map
function buildSymbolMap(packageRoot) {
  const symbolMap = new Map(); // symbol → { file, type }
  const fileExports = new Map(); // file → [symbols]
  
  const files = walkDir(packageRoot, '.ts');
  
  for (const file of files) {
    const relativeFile = path.relative(packageRoot, file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf8');
    
    // Find namespace unwrapped export declarations
    const exportMatches = content.matchAll(
      /export\s+(class|interface|function|const|let|enum|type|abstract\s+class)\s+(\w+)/g
    );
    
    const symbols = [];
    for (const m of exportMatches) {
      const symbol = m[2];
      if (!symbol.startsWith('_') && !symbol.startsWith('$')) {
        // Don't add private/internal symbols
        if (symbol !== 'DEBUG' && symbol !== 'RELEASE') {
          symbols.push(symbol);
          
          // Map symbol to file (avoid duplicates by preferring shorter paths)
          const existing = symbolMap.get(symbol);
          if (!existing || relativeFile.length < existing.file.length) {
            symbolMap.set(symbol, { file: relativeFile, type: m[1] });
          }
        }
      }
    }
    
    // Also find function declarations that became top-level exports
    const funcMatches = content.matchAll(
      /^\s*export\s+function\s+(\w+)/gm
    );
    for (const m of funcMatches) {
      const symbol = m[1];
      if (!symbol.startsWith('$')) {
        symbols.push(symbol);
        const existing = symbolMap.get(symbol);
        if (!existing || relativeFile.length < existing.file.length) {
          symbolMap.set(symbol, { file: relativeFile, type: 'function' });
        }
      }
    }
    
    fileExports.set(relativeFile, symbols);
  }
  
  return { symbolMap, fileExports };
}

// Second pass: convert files with proper imports
function convertPackage(packageRoot) {
  const { symbolMap, fileExports } = buildSymbolMap(packageRoot);
  const files = walkDir(packageRoot, '.ts');
  
  let converted = 0;
  let totalImports = 0;
  
  for (const file of files) {
    const relativeFile = path.relative(packageRoot, file).replace(/\\/g, '/');
    let content = fs.readFileSync(file, 'utf8');
    
    // Skip files already converted or infrastructure files
    if (relativeFile.endsWith('Defines.ts') || 
        relativeFile.endsWith('ClassRegistry.ts')) {
      continue;
    }
    
    // Remove any side-effect imports previously generated
    content = content.replace(/^import\s+'[^']+';\s*\n/gm, '');
    // Remove import from Defines (we'll regenerate)
    content = content.replace(/^import\s+\{\s*(?:DEBUG|RELEASE)\s*(?:,\s*(?:DEBUG|RELEASE))*?\s*\}\s+from\s+'[^']+';\s*\n/gm, '');
    
    // Detect used symbols
    const usedSymbols = new Set();
    
    // Find all identifier references (excluding keywords, locals, and already-imported)
    // We look for known symbols from the symbol map
    for (const [symbol, info] of symbolMap) {
      if (info.file === relativeFile) continue; // skip self
      
      const regex = new RegExp(
        `(?<!\\.)(?<![\\w$])(?:new\\s+)?${escapeRegex(symbol)}(?![\\w$])(?!\\s*\\(?\\s*[=:])?`, 
        'g'
      );
      
      const matches = content.match(regex);
      if (matches && matches.length > 0) {
        usedSymbols.add(symbol);
      }
    }
    
    // Check DEBUG/RELEASE usage
    if (/\bDEBUG\b/.test(content) || /\bRELEASE\b/.test(content)) {
      usedSymbols.add('__DEBUG__'); // special marker
    }
    
    if (usedSymbols.size === 0) {
      converted++;
      continue;
    }
    
    // Group symbols by file for imports
    const importMap = new Map(); // file → [symbols]
    for (const symbol of usedSymbols) {
      if (symbol === '__DEBUG__') {
        const existing = importMap.get('./Defines') || [];
        existing.push('DEBUG', 'RELEASE');
        importMap.set('./Defines', existing);
        continue;
      }
      
      const info = symbolMap.get(symbol);
      if (!info) continue;
      
      // Calculate relative import path
      let importPath = path.relative(path.dirname(relativeFile), path.dirname(info.file));
      if (importPath === '') importPath = '.';
      if (!importPath.startsWith('.')) importPath = './' + importPath;
      importPath = path.join(importPath, path.basename(info.file, '.ts')).replace(/\\/g, '/');
      
      const existing = importMap.get(importPath) || [];
      existing.push(symbol);
      importMap.set(importPath, existing);
    }
    
    // Generate imports
    let importBlock = '';
    for (const [importPath, symbols] of importMap) {
      // Deduplicate symbols
      const uniqueSymbols = [...new Set(symbols)];
      importBlock += `import { ${uniqueSymbols.join(', ')} } from '${importPath}';\n`;
    }
    
    if (importBlock) {
      // Find the insertion point: after copyright header, before code
      // Copyright header typically ends with "/////" followed by a blank line
      const headerEnd = content.indexOf('//////////////////////////////////////////////////////////////////////////////////////', 0);
      let insertPos;
      if (headerEnd !== -1) {
        // Find the end of the copyright block (last ///// line)
        const lines = content.split('\n');
        let lastSeparatorLine = -1;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim() === '//////////////////////////////////////////////////////////////////////////////////////') {
            lastSeparatorLine = i;
          }
        }
        // Insert after the trailing newline
        insertPos = lines.slice(0, lastSeparatorLine + 1).join('\n').length + 1;
      } else {
        insertPos = 0;
      }
      
      const before = content.substring(0, insertPos);
      const after = content.substring(insertPos);
      
      content = before + (before.endsWith('\n') ? '\n' : '\n\n') + importBlock + '\n' + after.trimStart();
      
      totalImports += importMap.size;
    }
    
    fs.writeFileSync(file, content, 'utf8');
    converted++;
  }
  
  return { converted, totalImports };
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function walkDir(dir, ext) {
  const results = [];
  try {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory() && file !== 'node_modules') {
        results.push(...walkDir(filePath, ext));
      } else if (file.endsWith(ext)) {
        results.push(filePath);
      }
    }
  } catch (e) {
    console.error(`  Error reading ${dir}: ${e.message}`);
  }
  return results;
}

// Main
const packagesDir = path.join(__dirname, '..', 'packages');
const packages = fs.readdirSync(packagesDir).filter(d => {
  const stat = fs.statSync(path.join(packagesDir, d));
  return stat.isDirectory();
});

console.log('V2 Converter: Building symbol maps and generating imports...\n');

for (const pkg of packages) {
  const pkgPath = path.join(packagesDir, pkg);
  const srcPath = path.join(pkgPath, 'src');
  
  if (!fs.existsSync(srcPath)) continue;
  
  console.log(`Processing @egret-r/${pkg}:`);
  
  try {
    const { converted, totalImports } = convertPackage(srcPath);
    console.log(`  Converted ${converted} files, generated ${totalImports} imports`);
  } catch (e) {
    console.error(`  Error: ${e.message}`);
    console.error(e.stack);
  }
}

console.log('\nConversion complete!');
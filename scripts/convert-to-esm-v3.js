/**
 * V3 Converter: Uses /// <reference path="..." /> as import sources.
 * 
 * Strategy:
 * 1. Parse /// <reference path="X/Y.ts" /> → import './X/Y.js'
 * 2. Extract all 'export' declarations inside namespace
 * 3. Remove namespace wrapper, keep declarations at top level
 * 4. Build import for any external symbols found in references
 */

const fs = require('fs');
const path = require('path');

function parseReferences(content) {
  const refs = [];
  const regex = /\/\/\/\s*<reference\s+path\s*=\s*["']([^"']+)["']\s*\/>/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    refs.push(m[1]);
  }
  return refs;
}

function convertFile(filePath, packageRoot) {
  let content = fs.readFileSync(filePath, 'utf8');
  const relFile = filePath.replace(packageRoot + path.sep, '').replace(/\\/g, '/');
  const fileDir = path.dirname(relFile);
  
  // Step 1: Parse reference paths
  const refPaths = parseReferences(content);
  
  // Step 2: Remove /// <reference comments
  content = content.replace(/\/\/\/\s*<reference\s+path\s*=\s*["'][^"']+["']\s*\/>\s*\n?/g, '');
  
  // Step 3: Convert reference paths to import paths
  const imports = [];
  for (const ref of refPaths) {
    // Resolve the referenced file relative to current file
    const resolved = path.resolve(path.dirname(filePath), ref).replace(/\\/g, '/');
    const relativeToPkg = resolved.replace(packageRoot.replace(/\\/g, '/') + '/', '');
    
    // Calculate relative import path
    let importPath = path.relative(path.dirname(relFile), path.dirname(relativeToPkg));
    if (importPath === '') importPath = '.';
    if (!importPath.startsWith('.')) importPath = './' + importPath;
    const basename = path.basename(ref, '.ts');
    importPath = (importPath + '/' + basename).replace(/\\/g, '/');
    
    imports.push(importPath);
  }
  
  // Step 4: Check if DEBUG/RELEASE is referenced
  const hasDebug = /(?<!\w)DEBUG(?!\w)/.test(content);
  const hasRelease = /(?<!\w)RELEASE(?!\w)/.test(content);
  
  // Step 5: Find the main namespace block and unwrap it
  const nsMatch = content.match(/namespace\s+(\w+)\s*\{/);
  if (!nsMatch) {
    // No namespace - file is already converted or is a definition file
    return content;
  }
  
  const nsName = nsMatch[1];
  const nsStartIdx = content.indexOf(`namespace ${nsName} {`);
  
  // Find matching closing brace
  let depth = 0;
  let nsEndIdx = -1;
  let foundNsStart = false;
  for (let i = nsStartIdx; i < content.length; i++) {
    if (content[i] === '{') {
      depth++;
      if (!foundNsStart) foundNsStart = true;
    }
    if (content[i] === '}') {
      depth--;
      if (depth === 0 && foundNsStart) {
        nsEndIdx = i;
        break;
      }
    }
  }
  
  if (nsEndIdx === -1) return content;
  
  // Extract the three parts
  const beforeNs = content.substring(0, nsStartIdx);
  const braceIdx = content.indexOf('{', nsStartIdx);
  const insideNs = content.substring(braceIdx + 1, nsEndIdx);
  const afterNs = content.substring(nsEndIdx + 1);
  
  // Clean up inside - strip leading copyright comment if duplicated
  let inside = insideNs;
  
  // Build the final output
  let result = '';
  
  // Copyright header from before
  const beforeLines = beforeNs.split('\n');
  const copyrightLines = [];
  let inCopyright = false;
  for (const line of beforeLines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed === '') {
      copyrightLines.push(line);
    } else {
      break; // skip non-comment code before namespace (shouldn't exist)
    }
  }
  result += copyrightLines.join('\n') + '\n';
  
  // Add imports
  const importSet = new Set();
  
  // Add reference-based imports as side-effect imports
  for (const imp of imports) {
    if (!importSet.has(imp)) {
      importSet.add(imp);
      result += `import '${imp}';\n`;
    }
  }
  
  // Add DEBUG/RELEASE import
  if (hasDebug || hasRelease) {
    const debugImportPath = path.relative(fileDir, '.').replace(/\\/g, '/');
    const debugFull = (debugImportPath === '' ? './' : debugImportPath + '/') + 'Defines';
    if (!importSet.has(debugFull)) {
      importSet.add(debugFull);
      result += `import { ${hasDebug ? 'DEBUG' : ''}${hasDebug && hasRelease ? ', ' : ''}${hasRelease ? 'RELEASE' : ''} } from '${debugFull}';\n`;
    }
  }
  
  if (importSet.size > 0) {
    result += '\n';
  }
  
  // Add the unwrapped namespace content
  result += inside;
  
  // Add after-namespace code (if any)
  const afterTrimmed = afterNs.trim();
  if (afterTrimmed) {
    result += '\n' + afterTrimmed;
  }
  
  // Post-processing: handle declare functions that were in namespace
  // Handle global namespace patterns like egret.sys
  // Handle //if DEBUG → if(DEBUG)
  result = result.replace(/\/\/if\s+(\w+)/g, 'if($1)');
  result = result.replace(/\/\/endif\s*/gi, '');
  
  return result;
}

function convertPackage(packageRoot) {
  const files = walkTsFiles(packageRoot);
  let count = 0;
  for (const file of files) {
    const relFile = path.relative(packageRoot, file).replace(/\\/g, '/');
    // Skip infrastructure files
    if (relFile === 'Defines.ts' || relFile === 'ClassRegistry.ts' || relFile === 'index.ts') continue;
    
    try {
      const result = convertFile(file, packageRoot);
      fs.writeFileSync(file, result, 'utf8');
      count++;
    } catch (e) {
      console.error(`  Error in ${relFile}: ${e.message}`);
    }
  }
  return count;
}

function walkTsFiles(dir) {
  const results = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== 'node_modules') {
        results.push(...walkTsFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
        results.push(fullPath);
      }
    }
  } catch (e) {
    // skip
  }
  return results;
}

// Main
const packagesDir = path.join(__dirname, '..', 'packages');
const packages = fs.readdirSync(packagesDir).filter(d => {
  const stat = fs.statSync(path.join(packagesDir, d));
  return stat.isDirectory();
});

console.log('V3 Converter: Unwrapping namespaces, preserving reference-based imports...\n');

let total = 0;
for (const pkg of packages) {
  const srcPath = path.join(packagesDir, pkg, 'src');
  if (!fs.existsSync(srcPath)) continue;
  
  console.log(`Processing @egret-r/${pkg}:`);
  const count = convertPackage(srcPath);
  console.log(`  Converted ${count} files`);
  total += count;
}

console.log(`\nTotal: ${total} files converted.`);

// Verify a sample file
console.log('\n--- Verification ---');
const sampleFile = path.join(packagesDir, 'core', 'src', 'display', 'Bitmap.ts');
if (fs.existsSync(sampleFile)) {
  const lines = fs.readFileSync(sampleFile, 'utf8').split('\n');
  console.log(`Bitmap.ts first 10 lines:`);
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    console.log(`  ${lines[i]}`);
  }
}
/**
 * Build script: Concatenates namespace-based TypeScript files into ESM bundles.
 * 
 * Approach:
 * 1. Walk the source tree, build dependency graph from /// <reference path="..." />
 * 2. Topologically sort files
 * 3. Concatenate them, wrapping in namespace
 * 4. Add ESM export at end
 */

const fs = require('fs');
const path = require('path');

function buildDependencyGraph(srcDir) {
  const files = walkTsFiles(srcDir);
  const graph = new Map(); // fileAbsPath → { refs: [absPaths], content: string }
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const refs = [];
    
    // Parse /// <reference path="..." />
    const refRegex = /\/\/\/\s*<reference\s+path\s*=\s*["']([^"']+)["']\s*\/>/g;
    let m;
    while ((m = refRegex.exec(content)) !== null) {
      const refPath = path.resolve(path.dirname(file), m[1]).replace(/\\/g, '/');
      refs.push(refPath);
    }
    
    graph.set(file.replace(/\\/g, '/'), {
      refs,
      content,
      target: file.replace(/\\/g, '/')
    });
  }
  
  return graph;
}

function topologicalSort(graph) {
  const visited = new Set();
  const temp = new Set();
  const order = [];
  
  function visit(node) {
    if (temp.has(node)) {
      // Circular dependency - not critical for namespace code
      return;
    }
    if (visited.has(node)) return;
    
    temp.add(node);
    const data = graph.get(node);
    if (data) {
      for (const ref of data.refs) {
        if (graph.has(ref)) {
          visit(ref);
        }
      }
    }
    temp.delete(node);
    visited.add(node);
    order.push(node);
  }
  
  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      visit(node);
    }
  }
  
  return order;
}

function buildPackage(packageSrcDir, pkgName, namespaceName, outDir) {
  const graph = buildDependencyGraph(packageSrcDir);
  const order = topologicalSort(graph);
  
  console.log(`  ${order.length} files in topological order`);
  
  // Concatenate all files
  let concatenated = '';
  let hasDebugDefine = false;
  let hasReleaseDefine = false;
  
  for (const filePath of order) {
    const data = graph.get(filePath);
    if (!data) continue;
    
    let code = data.content;
    
    // Remove /// <reference> comments (already handled)
    code = code.replace(/\/\/\/\s*<reference\s+path\s*=\s*["'][^"']+["']\s*\/>\s*/g, '');
    
    // Check for Defines
    if (filePath.endsWith('/Defines.ts')) {
      hasDebugDefine = true;
    }
    
    // Handle //if DEBUG / //if RELEASE → runtime if()
    code = code.replace(/\/\/if\s+(\w+)/g, 'if($1)');
    code = code.replace(/\/\/endif\s*/gi, '');
    
    // Handle global.DEBUG/RELEASE
    if (!hasDebugDefine) {
      code = code.replace(/global\.DEBUG\s*=\s*true;?/g, 'var DEBUG = true;');
      code = code.replace(/global\.RELEASE\s*=\s*false;?/g, 'var RELEASE = false;');
    }
    
    concatenated += code + '\n';
  }
  
  // Build the output
  const outFileName = `${pkgName}.js`;
  const outFilePath = path.join(outDir, outFileName);
  
  // Wrap in IIFE with namespace export, then re-export
  const output = `/**
 * @egret-r/${pkgName} - Egret Engine R
 * Auto-generated from namespace sources. Do not edit.
 */

// Prepend declare and define statements for DEBUG/RELEASE compatibility
var DEBUG = typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production' ? true : false;
var RELEASE = !DEBUG;

// Global namespace declaration for cross-module references
var egret = egret || {};
var eui = eui || {};
var egret_native = egret_native || {};
var game = game || {};

(function(global) {
  // Source code follows
${concatenated}
})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);

export { egret, eui, egret_native, game };

// TypeScript declaration
declare namespace egret {}
declare namespace eui {}
declare namespace egret_native {}
`;

  fs.writeFileSync(outFilePath, output, 'utf8');
  
  // Also generate a .d.ts placeholder  
  const dtsContent = `export declare namespace egret {\n  // See full type definitions in @egret-r/${pkgName}/types\n}\n`;
  fs.writeFileSync(outFilePath.replace('.js', '.d.ts'), dtsContent, 'utf8');
  
  console.log(`  Output: ${outFilePath}`);
}

function walkTsFiles(dir) {
  const results = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name).replace(/\\/g, '/');
      if (entry.isDirectory() && entry.name !== 'node_modules') {
        results.push(...walkTsFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
        results.push(fullPath);
      }
    }
  } catch (e) {
    console.error(`Error reading ${dir}: ${e.message}`);
  }
  return results;
}

// Package definitions
const PACKAGES = [
  { name: 'core', namespace: 'egret', srcDir: 'src' },
  { name: 'eui', namespace: 'eui', srcDir: 'src' },
  { name: 'game', namespace: 'game', srcDir: 'src' },
  { name: 'tween', namespace: 'tween', srcDir: 'src' },
  { name: 'socket', namespace: 'socket', srcDir: 'src' },
];

const rootDir = path.join(__dirname, '..');
const packagesDir = path.join(rootDir, 'packages');

console.log('Building namespace ESM bundles...\n');

for (const pkg of PACKAGES) {
  const pkgSrc = path.join(packagesDir, pkg.name, pkg.srcDir);
  const pkgDist = path.join(packagesDir, pkg.name, 'dist');
  
  if (!fs.existsSync(pkgSrc)) {
    console.log(`Skipping ${pkg.name}: no src/ directory`);
    continue;
  }
  
  // Ensure dist directory exists
  if (!fs.existsSync(pkgDist)) {
    fs.mkdirSync(pkgDist, { recursive: true });
  }
  
  console.log(`Building @egret-r/${pkg.name}:`);
  try {
    buildPackage(pkgSrc, pkg.name, pkg.namespace, pkgDist);
  } catch (e) {
    console.error(`  Error: ${e.message}`);
    console.error(e.stack);
  }
}

console.log('\nBuild complete!');
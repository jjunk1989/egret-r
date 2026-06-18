/**
 * Script to convert Egret Engine namespace-based TypeScript to ES Modules
 * 
 * Transformations:
 * 1. Parse /// <reference path="..." /> → build import map
 * 2. Remove /// <reference ... /> comments  
 * 3. Convert `namespace egret { export class Foo }` → `export class Foo`
 * 4. Convert `namespace eui { export class Bar }` → `export class Bar`
 * 5. Generate import statements from reference paths
 * 6. Handle `declare let DEBUG/RELEASE` → import from './Defines'
 * 7. Handle `//if DEBUG` conditional blocks
 */

const fs = require('fs');
const path = require('path');

// Map of namespace prefixes to their import bases
const NAMESPACE_MAP = {
  'egret': { importBase: '', isCore: true },
  'eui': { importBase: '', isCore: false },  
  'game': { importBase: '', isCore: false },
  'tween': { importBase: '', isCore: false },
  'socket': { importBase: '', isCore: false },
};

// Known sub-namespace patterns within egret
const SUB_NAMESPACES = ['egret.sys', 'egret_native', 'eui.sys'];

function convertFile(filePath, packageRoot) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Parse /// <reference path="..." /> directives
  const referenceRegex = /\/\/\/\s*<reference\s+path\s*=\s*["']([^"']+)["']\s*\/>/g;
  const references = [];
  let match;
  while ((match = referenceRegex.exec(content)) !== null) {
    references.push(match[1]);
  }
  
  // Remove the reference comments
  content = content.replace(referenceRegex, '');
  
  // Determine which namespace this file belongs to
  const namespaceMatch = content.match(/namespace\s+(egret|eui|game|tween|socket)\s*\{/);
  const namespace = namespaceMatch ? namespaceMatch[1] : null;
  
  // Build imports from references
  const imports = [];
  for (const ref of references) {
    // Convert relative path reference to relative import
    const refDir = path.dirname(ref);
    const refName = path.basename(ref, '.ts');
    const currentDir = path.dirname(path.relative(packageRoot, filePath));
    
    // Calculate relative import path
    let importPath = path.relative(currentDir, refDir);
    if (!importPath.startsWith('.')) {
      importPath = './' + importPath;
    }
    importPath = path.join(importPath, refName).replace(/\\/g, '/');
    
    imports.push({ path: importPath, name: refName });
  }
  
  // Check if DEBUG/RELEASE are used in the file
  const hasDebug = /\bDEBUG\b/.test(content);
  const hasRelease = /\bRELEASE\b/.test(content);
  if (hasDebug || hasRelease) {
    imports.push({ path: './Defines', name: 'Defines', isDebug: true });
  }
  
  // Convert namespace blocks to ES exports
  if (namespace) {
    // Find the start and end of the namespace block
    const nsStart = content.indexOf(`namespace ${namespace} {`);
    if (nsStart !== -1) {
      // Find matching closing brace
      let depth = 0;
      let nsEnd = -1;
      for (let i = nsStart; i < content.length; i++) {
        if (content[i] === '{') depth++;
        if (content[i] === '}') {
          depth--;
          if (depth === 0) {
            nsEnd = i;
            break;
          }
        }
      }
      
      if (nsEnd !== -1) {
        // Extract code before namespace
        const before = content.substring(0, nsStart).trim();
        // Extract code inside namespace (excluding the braces)
        const inside = content.substring(
          content.indexOf('{', nsStart) + 1,
          nsEnd
        );
        // Extract code after namespace
        const after = content.substring(nsEnd + 1).trim();
        
        // Remove 'export' keyword from declarations inside the namespace
        // (they were already exported within the namespace, now need to be top-level exports)
        let converted = inside;
        
        // Remove the copyright header from inside (it's already at file top)
        converted = converted.replace(/^(\s*\/\/+\s*\n)*/s, '');
        
        // Build the final file
        let result = '';
        
        // Add copyright header from 'before' section
        if (before) {
          result += before + '\n';
        }
        
        // Add imports
        const importSet = new Set();
        for (const imp of imports) {
          if (!importSet.has(imp.path)) {
            importSet.add(imp.path);
            if (imp.isDebug) {
              result += `import { DEBUG, RELEASE } from '${imp.path}';\n`;
            } else {
              result += `import '${imp.path}';\n`;
            }
          }
        }
        
        if (imports.length > 0) {
          result += '\n';
        }
        
        // Add converted content
        result += converted.trimEnd() + '\n';
        
        // Add any trailing code
        if (after) {
          result += after + '\n';
        }
        
        content = result;
      }
    }
  }
  
  // Handle //if DEBUG conditional blocks
  // Convert them to if(DEBUG) runtime checks
  content = content.replace(/\/\/if\s+(\w+)/g, 'if($1)');
  content = content.replace(/\/\/endif/g, '');
  
  // Handle declare let DEBUG/RELEASE - remove them (will be imported)
  content = content.replace(/declare\s+let\s+DEBUG:\s*boolean;\s*/g, '');
  content = content.replace(/declare\s+let\s+RELEASE:\s*boolean;\s*/g, '');
  
  // Handle global.DEBUG assignments
  content = content.replace(/global\.DEBUG\s*=\s*true;/g, '// DEBUG is now imported from Defines');
  content = content.replace(/global\.RELEASE\s*=\s*false;/g, '// RELEASE is now imported from Defines');
  
  return content;
}

function convertPackage(packagePath) {
  const srcPath = path.join(packagePath, 'src');
  if (!fs.existsSync(srcPath)) {
    console.log(`  No src/ found in ${packagePath}, skipping`);
    return;
  }
  
  const files = walkDir(srcPath, '.ts');
  console.log(`  Found ${files.length} .ts files`);
  
  for (const file of files) {
    try {
      const converted = convertFile(file, srcPath);
      fs.writeFileSync(file, converted, 'utf8');
      process.stdout.write('.');
    } catch (e) {
      console.error(`\n  Error converting ${file}: ${e.message}`);
    }
  }
  console.log();
}

function walkDir(dir, ext) {
  const results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results.push(...walkDir(filePath, ext));
    } else if (file.endsWith(ext)) {
      results.push(filePath);
    }
  }
  return results;
}

// Main
const packagesDir = path.join(__dirname, '..', 'packages');
const packages = fs.readdirSync(packagesDir).filter(d => 
  fs.statSync(path.join(packagesDir, d)).isDirectory()
);

console.log('Converting packages to ES Modules...\n');

for (const pkg of packages) {
  const pkgPath = path.join(packagesDir, pkg);
  console.log(`Processing @egret-r/${pkg}:`);
  convertPackage(pkgPath);
}

console.log('\nConversion complete!');
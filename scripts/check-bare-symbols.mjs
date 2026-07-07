import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT = path.join(__dirname, '..');
const EXT_PACKAGES = ['eui', 'game', 'socket', 'tween'];

const RISKY_BASES = {
  EventDispatcher: true,
  DisplayObject: true,
  DisplayObjectContainer: true,
  HashObject: true,
  Event: true,
};

const RISKY_RUNTIME_SYMBOLS = ['Point', 'Rectangle', 'Matrix'];

function walkFiles(dir, filter) {
  let out = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (_) {
    return out;
  }

  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out = out.concat(walkFiles(full, filter));
    } else if (filter(full)) {
      out.push(full);
    }
  }
  return out;
}

function normalizeRel(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function stripInlineComment(line) {
  const idx = line.indexOf('//');
  return idx === -1 ? line : line.slice(0, idx);
}

function isQualified(line, symbol) {
  return (
    line.includes('egret.' + symbol) ||
    line.includes('eui.' + symbol) ||
    line.includes('egret2.' + symbol) ||
    line.includes('sys.' + symbol)
  );
}

function scanSourceFile(filePath) {
  const findings = [];
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = stripInlineComment(raw);
    if (!line.trim()) continue;

    const m = line.match(/^\s*export\s+(?:abstract\s+)?class\s+\w+\s+extends\s+([A-Za-z_$][\w$]*)/);
    if (m && RISKY_BASES[m[1]]) {
      findings.push({
        file: normalizeRel(filePath),
        line: i + 1,
        rule: 'extends-bare-base',
        snippet: raw.trim(),
      });
    }

    if (line.includes('ticker.') && !line.includes('egret.ticker') && !line.includes('this.ticker')) {
      findings.push({
        file: normalizeRel(filePath),
        line: i + 1,
        rule: 'bare-ticker',
        snippet: raw.trim(),
      });
    }

    for (const sym of RISKY_RUNTIME_SYMBOLS) {
      const newRe = new RegExp('(^|[^\\w$.])new\\s+' + sym + '\\s*\\(');
      const dotRe = new RegExp('(^|[^\\w$.])' + sym + '\\.');

      if (newRe.test(line) && !isQualified(line, sym)) {
        findings.push({
          file: normalizeRel(filePath),
          line: i + 1,
          rule: 'bare-new-' + sym.toLowerCase(),
          snippet: raw.trim(),
        });
      }
      if (dotRe.test(line) && !isQualified(line, sym)) {
        findings.push({
          file: normalizeRel(filePath),
          line: i + 1,
          rule: 'bare-ref-' + sym.toLowerCase(),
          snippet: raw.trim(),
        });
      }
    }
  }

  return findings;
}

function scanDistFile(filePath) {
  const findings = [];
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

  const extendsRe = /extends\s+(EventDispatcher|DisplayObject|DisplayObjectContainer|HashObject|Event)\b/;
  const bareTickerRe = /(^|[^\w$.])ticker\./;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (extendsRe.test(line)) {
      findings.push({
        file: normalizeRel(filePath),
        line: i + 1,
        rule: 'dist-extends-bare-base',
        snippet: line.trim(),
      });
    }

    if (bareTickerRe.test(line) && !line.includes('egret.ticker') && !line.includes('this.ticker')) {
      findings.push({
        file: normalizeRel(filePath),
        line: i + 1,
        rule: 'dist-bare-ticker',
        snippet: line.trim(),
      });
    }

    for (const sym of RISKY_RUNTIME_SYMBOLS) {
      const newRe = new RegExp('(^|[^\\w$.])new\\s+' + sym + '\\s*\\(');
      const dotRe = new RegExp('(^|[^\\w$.])' + sym + '\\.');

      if (newRe.test(line) && !line.includes('egret2.' + sym) && !line.includes('egret.' + sym)) {
        findings.push({
          file: normalizeRel(filePath),
          line: i + 1,
          rule: 'dist-bare-new-' + sym.toLowerCase(),
          snippet: line.trim(),
        });
      }
      if (dotRe.test(line) && !line.includes('egret2.' + sym) && !line.includes('egret.' + sym)) {
        findings.push({
          file: normalizeRel(filePath),
          line: i + 1,
          rule: 'dist-bare-ref-' + sym.toLowerCase(),
          snippet: line.trim(),
        });
      }
    }
  }

  return findings;
}

function run() {
  let sourceFindings = [];
  let distFindings = [];

  for (const name of EXT_PACKAGES) {
    const srcDir = path.join(ROOT, 'src', 'extension', name);
    const distFile = path.join(ROOT, 'packages', name, 'dist', 'index.js');

    const srcFiles = walkFiles(srcDir, file => file.endsWith('.ts') && !file.endsWith('.d.ts'));

    for (const f of srcFiles) {
      sourceFindings = sourceFindings.concat(scanSourceFile(f));
    }

    if (fs.existsSync(distFile)) {
      distFindings = distFindings.concat(scanDistFile(distFile));
    }
  }

  const allFindings = sourceFindings.concat(distFindings);

  if (allFindings.length === 0) {
    console.log('[bare-symbol-check] OK: no risky bare symbol patterns found.');
    return;
  }

  console.log('[bare-symbol-check] Found ' + allFindings.length + ' issue(s):');
  for (const f of allFindings) {
    console.log('- ' + f.file + ':' + f.line + ' [' + f.rule + '] ' + f.snippet);
  }

  process.exitCode = 1;
}

run();

"use strict";

var fs = require("fs");
var path = require("path");

var ROOT = path.join(__dirname, "..");
var EXT_PACKAGES = ["eui", "game", "socket", "tween"];

var RISKY_BASES = {
  EventDispatcher: true,
  DisplayObject: true,
  DisplayObjectContainer: true,
  HashObject: true,
  Event: true,
};

var RISKY_RUNTIME_SYMBOLS = ["Point", "Rectangle", "Matrix"];

function walkFiles(dir, filter) {
  var out = [];
  var entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return out;
  }

  for (var i = 0; i < entries.length; i++) {
    var full = path.join(dir, entries[i].name);
    if (entries[i].isDirectory()) {
      out = out.concat(walkFiles(full, filter));
    } else if (filter(full)) {
      out.push(full);
    }
  }
  return out;
}

function normalizeRel(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, "/");
}

function stripInlineComment(line) {
  var idx = line.indexOf("//");
  return idx === -1 ? line : line.slice(0, idx);
}

function isQualified(line, symbol) {
  return (
    line.indexOf("egret." + symbol) !== -1 ||
    line.indexOf("eui." + symbol) !== -1 ||
    line.indexOf("egret2." + symbol) !== -1 ||
    line.indexOf("sys." + symbol) !== -1
  );
}

function scanSourceFile(filePath) {
  var findings = [];
  var lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (var i = 0; i < lines.length; i++) {
    var raw = lines[i];
    var line = stripInlineComment(raw);
    if (!line.trim()) continue;

    var m = line.match(/^\s*export\s+(?:abstract\s+)?class\s+\w+\s+extends\s+([A-Za-z_$][\w$]*)/);
    if (m && RISKY_BASES[m[1]]) {
      findings.push({
        file: normalizeRel(filePath),
        line: i + 1,
        rule: "extends-bare-base",
        snippet: raw.trim(),
      });
    }

    if (line.indexOf("ticker.") !== -1 && line.indexOf("egret.ticker") === -1 && line.indexOf("this.ticker") === -1) {
      findings.push({
        file: normalizeRel(filePath),
        line: i + 1,
        rule: "bare-ticker",
        snippet: raw.trim(),
      });
    }

    for (var s = 0; s < RISKY_RUNTIME_SYMBOLS.length; s++) {
      var sym = RISKY_RUNTIME_SYMBOLS[s];
      var newRe = new RegExp("(^|[^\\w$.])new\\s+" + sym + "\\s*\\(");
      var dotRe = new RegExp("(^|[^\\w$.])" + sym + "\\.");

      if (newRe.test(line) && !isQualified(line, sym)) {
        findings.push({
          file: normalizeRel(filePath),
          line: i + 1,
          rule: "bare-new-" + sym.toLowerCase(),
          snippet: raw.trim(),
        });
      }
      if (dotRe.test(line) && !isQualified(line, sym)) {
        findings.push({
          file: normalizeRel(filePath),
          line: i + 1,
          rule: "bare-ref-" + sym.toLowerCase(),
          snippet: raw.trim(),
        });
      }
    }
  }

  return findings;
}

function scanDistFile(filePath) {
  var findings = [];
  var lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  var extendsRe = /extends\s+(EventDispatcher|DisplayObject|DisplayObjectContainer|HashObject|Event)\b/;
  var bareTickerRe = /(^|[^\w$.])ticker\./;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];

    if (extendsRe.test(line)) {
      findings.push({
        file: normalizeRel(filePath),
        line: i + 1,
        rule: "dist-extends-bare-base",
        snippet: line.trim(),
      });
    }

    if (bareTickerRe.test(line) && line.indexOf("egret.ticker") === -1 && line.indexOf("this.ticker") === -1) {
      findings.push({
        file: normalizeRel(filePath),
        line: i + 1,
        rule: "dist-bare-ticker",
        snippet: line.trim(),
      });
    }

    for (var s = 0; s < RISKY_RUNTIME_SYMBOLS.length; s++) {
      var sym = RISKY_RUNTIME_SYMBOLS[s];
      var newRe = new RegExp("(^|[^\\w$.])new\\s+" + sym + "\\s*\\(");
      var dotRe = new RegExp("(^|[^\\w$.])" + sym + "\\.");

      if (newRe.test(line) && line.indexOf("egret2." + sym) === -1 && line.indexOf("egret." + sym) === -1) {
        findings.push({
          file: normalizeRel(filePath),
          line: i + 1,
          rule: "dist-bare-new-" + sym.toLowerCase(),
          snippet: line.trim(),
        });
      }
      if (dotRe.test(line) && line.indexOf("egret2." + sym) === -1 && line.indexOf("egret." + sym) === -1) {
        findings.push({
          file: normalizeRel(filePath),
          line: i + 1,
          rule: "dist-bare-ref-" + sym.toLowerCase(),
          snippet: line.trim(),
        });
      }
    }
  }

  return findings;
}

function run() {
  var sourceFindings = [];
  var distFindings = [];

  for (var i = 0; i < EXT_PACKAGES.length; i++) {
    var name = EXT_PACKAGES[i];
    var srcDir = path.join(ROOT, "src", "extension", name);
    var distFile = path.join(ROOT, "packages", name, "dist", "index.js");

    var srcFiles = walkFiles(srcDir, function(file) {
      return file.endsWith(".ts") && !file.endsWith(".d.ts");
    });

    for (var s = 0; s < srcFiles.length; s++) {
      sourceFindings = sourceFindings.concat(scanSourceFile(srcFiles[s]));
    }

    if (fs.existsSync(distFile)) {
      distFindings = distFindings.concat(scanDistFile(distFile));
    }
  }

  var allFindings = sourceFindings.concat(distFindings);

  if (allFindings.length === 0) {
    console.log("[bare-symbol-check] OK: no risky bare symbol patterns found.");
    return;
  }

  console.log("[bare-symbol-check] Found " + allFindings.length + " issue(s):");
  for (var j = 0; j < allFindings.length; j++) {
    var f = allFindings[j];
    console.log("- " + f.file + ":" + f.line + " [" + f.rule + "] " + f.snippet);
  }

  process.exitCode = 1;
}

run();

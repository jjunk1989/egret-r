import esbuild from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse platform argument (supports both --platform=wx and --platform wx)
const args = process.argv.slice(2);
const buildAll = args.includes("--all");
let platform = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--platform" && i + 1 < args.length) { platform = args[i + 1]; break; }
  if (args[i].startsWith("--platform=")) { platform = args[i].split("=")[1]; break; }
}

const PLATFORMS = ["wx", "tt", "ks", "qq"];

function build(plat) {
  const distDir = path.join(__dirname, "dist", plat);
  fs.mkdirSync(distDir, { recursive: true });

  // Copy platform configs
  const configDir = path.join(__dirname, "platforms", plat);
  if (fs.existsSync(path.join(configDir, "game.json"))) {
    fs.copyFileSync(path.join(configDir, "game.json"), path.join(distDir, "game.json"));
  }
  if (fs.existsSync(path.join(configDir, "project.config.json"))) {
    fs.copyFileSync(path.join(configDir, "project.config.json"), path.join(distDir, "project.config.json"));
  }

  return esbuild.build({
    entryPoints: [path.join(__dirname, "src/game.ts")],
    bundle: true,
    outfile: path.join(distDir, "game.js"),
    format: "iife",
    platform: "neutral",
    target: "es2020",
    minify: false,
    banner: {
      js: `// Egret Engine R - Flappy Bird (${plat.toUpperCase()} Mini Game)\n`,
    },
  }).then(() => {
    console.log(`✅ [${plat}] Built: dist/${plat}/game.js`);
  });
}

async function main() {
  if (buildAll) {
    await Promise.all(PLATFORMS.map(build));
    console.log("\n🎉 All platforms built!");
    console.log("  WeChat:  dist/wx/");
    console.log("  Douyin:  dist/tt/");
    console.log("  Kuaishou:dist/ks/");
    console.log("  QQ:      dist/qq/");
  } else if (platform && PLATFORMS.includes(platform)) {
    await build(platform);
  } else {
    console.error("Usage: node build.mjs --platform=wx|tt|ks|qq  or  --all");
    process.exit(1);
  }
}

main().catch(err => { console.error(err); process.exit(1); });

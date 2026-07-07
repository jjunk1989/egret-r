import esbuild from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "dist");

fs.mkdirSync(distDir, { recursive: true });

// Copy config files
for (const f of ["game.json", "project.config.json"]) {
  fs.copyFileSync(path.join(__dirname, f), path.join(distDir, f));
}

await esbuild.build({
  entryPoints: [path.join(__dirname, "src/game.ts")],
  bundle: true,
  outfile: path.join(distDir, "game.js"),
  format: "iife",
  platform: "neutral",
  target: "es2020",
  minify: false,
  define: {
    WEB_ONLY: "false",
    MINIGAME: "true",
  },
});

console.log("✅ Built: dist/game.js");
console.log("📱 WeChat DevTools → Import → Select this directory");

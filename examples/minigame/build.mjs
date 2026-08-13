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

const PLATFORMS = ["wx", "tt", "ks", "qq", "my"];

function build(plat) {
  const distDir = path.join(__dirname, "dist", plat);
  fs.mkdirSync(distDir, { recursive: true });

  // Copy platform configs
  const configDir = path.join(__dirname, "platforms", plat);
  if (plat === "my") {
    // Alipay: game.json is REQUIRED for mini-game project detection
    // (missing it makes the Alipay IDE hang on a white screen).
    // project.config.json doesn't exist; mini.project.json is the IDE config.
    if (fs.existsSync(path.join(configDir, "game.json"))) {
      fs.copyFileSync(path.join(configDir, "game.json"), path.join(distDir, "game.json"));
    }
    if (fs.existsSync(path.join(configDir, "mini.project.json"))) {
      fs.copyFileSync(path.join(configDir, "mini.project.json"), path.join(distDir, "mini.project.json"));
    }
  } else {
    if (fs.existsSync(path.join(configDir, "game.json"))) {
      fs.copyFileSync(path.join(configDir, "game.json"), path.join(distDir, "game.json"));
    }
    if (fs.existsSync(path.join(configDir, "project.config.json"))) {
      fs.copyFileSync(path.join(configDir, "project.config.json"), path.join(distDir, "project.config.json"));
    }
  }

  return esbuild.build({
    entryPoints: [path.join(__dirname, "src/game.ts")],
    bundle: true,
    outfile: path.join(distDir, "game.js"),
    format: "iife",
    platform: "neutral",
    target: "es2020",
    // Alipay IDE transpiles unminified large files extremely slowly (white screen hang).
    // Keep other platforms readable for debugging; minify only Alipay output.
    minify: plat === "my",
    banner: {
      js: `// Egret Engine R - Flappy Bird (${plat.toUpperCase()} Mini Game)
(function(){
var g=globalThis;
if(typeof g.window==='undefined')g.window=g;
if(typeof g.navigator==='undefined'){
  try{
    var api=g.wx||g.tt||g.ks||g.qq||g.my;
    var info=api&&api.getSystemInfoSync?api.getSystemInfoSync():null;
    var p=(info&&info.platform)||'web';
    var s=(info&&info.system)||'';
    var lang=(info&&info.language)||'zh_CN';
    g.navigator={userAgent:(p+(s?' '+s:'')+' mobile').toLowerCase(),platform:p,language:lang,browserLanguage:lang,maxTouchPoints:1};
  }catch(e){
    g.navigator={userAgent:'mobile',platform:'web',language:'zh_CN',browserLanguage:'zh_CN',maxTouchPoints:1};
  }
}
if(g.devicePixelRatio===undefined||g.innerWidth===undefined){
  try{
    var api2=g.wx||g.tt||g.ks||g.qq||g.my;
    var info2=api2&&api2.getSystemInfoSync?api2.getSystemInfoSync():null;
    if(info2){
      if(g.devicePixelRatio===undefined)g.devicePixelRatio=info2.pixelRatio||1;
      if(g.innerWidth===undefined)g.innerWidth=info2.screenWidth;
      g.__plat=info2.platform||'';
      if(g.innerHeight===undefined)g.innerHeight=info2.screenHeight;
    }
  }catch(e2){}
  if(g.devicePixelRatio===undefined)g.devicePixelRatio=1;
}
})();`, 
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
    console.log("  Alipay:  dist/my/");
  } else if (platform && PLATFORMS.includes(platform)) {
    await build(platform);
  } else {
    console.error("Usage: node build.mjs --platform=wx|tt|ks|qq|my  or  --all");
    process.exit(1);
  }
}

main().catch(err => { console.error(err); process.exit(1); });

var fs = require('fs');

// Fix WebSysImpl.ts: Geolocation + Motion
var c = fs.readFileSync('src/egret/web/WebSysImpl.ts', 'utf8');
c = c.replace(/import \{ Geolocation \} from/, 'import { setGeolocation } from');
c = c.replace(/import \{ Motion \} from/, 'import { setMotion } from');
c = c.replace(/Geolocation = .+;/, 'setGeolocation(WebGeolocation);');
c = c.replace(/Motion = .+;/, 'setMotion(WebMotion);');
fs.writeFileSync('src/egret/web/WebSysImpl.ts', c);
console.log('WebSysImpl: fixed');

// Fix WebFps.ts: FPSDisplay
c = fs.readFileSync('src/egret/web/WebFps.ts', 'utf8');
c = c.replace(/import \{ FPSDisplay \} from/, 'import { setFPSDisplay } from');
c = c.replace(/FPSDisplay = .+;/, 'setFPSDisplay(WebFps);');
fs.writeFileSync('src/egret/web/WebFps.ts', c);
console.log('WebFps: fixed');

// Fix WebGLRenderContext.ts: _WebGLRenderContext
c = fs.readFileSync('src/egret/web/rendering/webgl/WebGLRenderContext.ts', 'utf8');
c = c.replace(/_?WebGLRenderContext = .+;/, 'setWebGLRenderContext(WebGLRenderContext);');
if (!c.includes('import { setWebGLRenderContext')) {
  c = c.replace(/(import\s+[^;]+;)/, function(m) { return m + '\nimport { setWebGLRenderContext } from "../../../player/Player";'; });
}
fs.writeFileSync('src/egret/web/rendering/webgl/WebGLRenderContext.ts', c);
console.log('WebGLRenderContext: fixed');

// Fix HTML5StageText.ts: StageText
c = fs.readFileSync('src/egret/text/web/HTML5StageText.ts', 'utf8');
c = c.replace(/import \{ StageText \} from/, 'import { setStageText } from');
c = c.replace(/StageText = .+;/, 'setStageText(HTML5StageText);');
fs.writeFileSync('src/egret/text/web/HTML5StageText.ts', c);
console.log('HTML5StageText: fixed');

// Fix Font.ts: registerFontMapping
c = fs.readFileSync('src/egret/text/Font.ts', 'utf8');
c = c.replace(/registerFontMapping = _registerFontMapping;/, 'setRegisterFontMapping(_registerFontMapping);');
fs.writeFileSync('src/egret/text/Font.ts', c);
console.log('Font: fixed');

console.log('All done');

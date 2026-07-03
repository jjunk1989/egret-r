// Fix cross-namespace references in .d.ts bundle
var fs = require('fs');
var path = require('path');
var ROOT = __dirname + '/..';

var distDir = process.argv[2] || path.join(ROOT, 'packages/eui/dist');
var pkgName = path.basename(path.dirname(distDir));

var dts = fs.readFileSync(path.join(distDir, 'index.d.ts'), 'utf8');

// Find each declare namespace block and fix references to egret types
var egretTypes = ['TextField','DisplayObject','DisplayObjectContainer','EventDispatcher','Shape',
  'Bitmap','Sprite','Stage','Event','TouchEvent','Matrix','Rectangle','Point','Filter',
  'TextFormat','Texture','Sound','HttpRequest','HttpMethod','URLLoader','ByteArray','Timer',
  'RenderTexture','Graphics','BlendMode','TextFieldType','TextEvent','FocusEvent',
  'InputController','ITextElement','ILineElement',
  'IViewport','Viewport','IItemRenderer','ItemRenderer',
  'CollectionEvent','DataProvider'];

// Find all declare namespace X { } blocks that are NOT egret
var re = /declare\s+namespace\s+(\w+)\s*\{/g;
var m;
while ((m = re.exec(dts)) !== null) {
  if (m[1] === 'egret') continue;
  
  // Find matching closing brace
  var start = m.index + m[0].length;
  var depth = 0;
  var end = start;
  while (end < dts.length) {
    if (dts[end] === '{') depth++;
    else if (dts[end] === '}') {
      if (depth === 0) break;
      depth--;
    }
    end++;
  }
  
  var block = dts.substring(start, end);
  var fixed = block;
  
  for (var t = 0; t < egretTypes.length; t++) {
    var et = egretTypes[t];
    // Only replace if not already prefixed with egret.
    // Match: extends Et (followed by space, {, or newline)
    fixed = fixed.replace(new RegExp('\\bextends\\s+' + et + '(?=\\s|\\{|$)', 'g'), 'extends egret.' + et);
    // Match: implements Et (TypeScript doesn't use implements much in .d.ts but be safe)
    fixed = fixed.replace(new RegExp('\\bimplements\\s+' + et + '(?=\\s|\\{|$)', 'g'), 'implements egret.' + et);
  }
  
  dts = dts.substring(0, start) + fixed + dts.substring(end);
  // Reset regex lastIndex since we modified the string
  re.lastIndex = start + fixed.length + 1;
}

fs.writeFileSync(path.join(distDir, 'index.d.ts'), dts, 'utf8');
console.log('Fixed cross-namespace references in ' + pkgName);

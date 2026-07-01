var fs = require('fs'), path = require('path');
var ROOT = 'c:/work/egret/egret-r';
var entryPath = path.join(ROOT, 'packages/socket/_esm_entry.ts');

var files = [
  path.join(ROOT, 'src/extension/socket/ISocket.ts'),
  path.join(ROOT, 'src/extension/socket/WebSocket.ts'),
  path.join(ROOT, 'src/extension/socket/web/HTML5WebSocket.ts')
];

files.forEach(function(f) {
  var content = fs.readFileSync(f, 'utf8');
  var imports = [];
  var re = /import\s+(?!type\b)(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g;
  var m;
  while ((m = re.exec(content)) !== null) {
    if (m[1].startsWith('.')) {
      imports.push(m[1]);
    } else {
      imports.push(m[1] + ' (external)');
    }
  }
  console.log(path.basename(f) + ': ' + JSON.stringify(imports));
});

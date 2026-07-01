var fs = require('fs');

var base = 'c:/work/egret/egret-r/';

var fixes = [
  { file: base + 'src/extension/eui/components/Component.ts', importLine: 'import { registerProperty } from "../utils/registerProperty";' },
  { file: base + 'src/extension/eui/components/DataGroup.ts', importLine: 'import { registerProperty } from "../utils/registerProperty";' },
  { file: base + 'src/extension/eui/components/Group.ts', importLine: 'import { registerProperty } from "../utils/registerProperty";' },
  { file: base + 'src/extension/eui/components/Image.ts', importLine: 'import { registerProperty } from "../utils/registerProperty";' },
  { file: base + 'src/extension/eui/components/Panel.ts', importLine: 'import { registerProperty } from "../utils/registerProperty";' },
  { file: base + 'src/extension/eui/core/UIComponent.ts', importLine: 'import { registerProperty } from "../utils/registerProperty";' },
  { file: base + 'src/extension/tween/TweenWrapper.ts', importLine: 'import { registerProperty } from "../../extension/eui/utils/registerProperty";' },
];

fixes.forEach(function(fix) {
  var content = fs.readFileSync(fix.file, 'utf8');
  if (content.indexOf('import { registerProperty }') >= 0) {
    console.log(fix.file + ' - already has it');
    return;
  }
  // Insert after the last import line (before the first non-import, non-comment line)
  var lines = content.split('\n');
  var lastImportIdx = -1;
  for (var i = 0; i < lines.length; i++) {
    if (/^import\s/.test(lines[i]) || /^\/\/ SPDX/.test(lines[i]) || /^\/\/ Copyright/.test(lines[i]) || /^\s*$/.test(lines[i])) {
      if (/^import\s/.test(lines[i])) lastImportIdx = i;
    } else {
      break;
    }
  }
  if (lastImportIdx >= 0) {
    lines.splice(lastImportIdx + 1, 0, fix.importLine);
  } else {
    // Insert after copyright
    for (var j = 0; j < lines.length; j++) {
      if (/^\/\/ Copyright/.test(lines[j])) {
        lines.splice(j + 1, 0, '', fix.importLine);
        break;
      }
    }
  }
  fs.writeFileSync(fix.file, lines.join('\n'), 'utf8');
  console.log(fix.file + ' - added');
});

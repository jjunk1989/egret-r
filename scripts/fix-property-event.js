var fs = require('fs');
var base = 'c:/work/egret/egret-r/';

var fixes = [
  'src/extension/eui/components/BitmapLabel.ts',
  'src/extension/eui/components/EditableText.ts',
  'src/extension/eui/components/Group.ts',
  'src/extension/eui/components/ItemRenderer.ts',
  'src/extension/eui/components/Label.ts',
  'src/extension/eui/components/List.ts',
  'src/extension/eui/components/RadioButton.ts',
  'src/extension/eui/components/RadioButtonGroup.ts',
  'src/extension/eui/components/Skin.ts',
  'src/extension/eui/components/supportClasses/ListBase.ts',
  'src/extension/eui/components/supportClasses/Range.ts',
];

fixes.forEach(function(f) {
  var file = base + f;
  var content = fs.readFileSync(file, 'utf8');
  if (content.indexOf('import { PropertyEvent }') >= 0) {
    console.log(f + ' - already done');
    return;
  }
  // Insert after last import line
  var lines = content.split('\n');
  var lastImport = -1;
  for (var i = 0; i < lines.length; i++) {
    if (/^import\s/.test(lines[i])) lastImport = i;
    else if (lastImport >= 0 && !/^\s*$/.test(lines[i]) && !/^\/\//.test(lines[i])) break;
  }
  if (lastImport >= 0) {
    lines.splice(lastImport + 1, 0, "import { PropertyEvent } from \"../events/PropertyEvent\";");
  } else {
    // Insert after copyright
    for (var j = 0; j < lines.length; j++) {
      if (/^\/\/ Copyright/.test(lines[j])) {
        lines.splice(j + 1, 0, '', "import { PropertyEvent } from \"../events/PropertyEvent\";");
        break;
      }
    }
  }
  fs.writeFileSync(file, lines.join('\n'), 'utf8');
  console.log(f + ' - fixed');
});

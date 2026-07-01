const fs = require('fs');

const fixes = {
  'src/Defines.release.ts': '', // remove the import
  'src/extension/assetsmanager/src/core/ResourceConfig.ts': '../../../../Defines.debug',
  'src/extension/eui/components/Image.ts': '../../../Defines.debug',
  'src/extension/eui/components/DataGroup.ts': '../../../Defines.debug',
  'src/extension/eui/exml/EXMLConfig.ts': '../../../Defines.debug',
  'src/extension/eui/exml/EXMLParser.ts': '../../../Defines.debug',
  'src/extension/game/system/MainContext.ts': '../../../Defines.debug',
  'src/extension/resource/analyzer/AnimationAnalyzer.ts': '../../../Defines.debug',
  'src/extension/resource/analyzer/JsonAnalyzer.ts': '../../../Defines.debug',
  'src/extension/resource/core/ResourceConfig.ts': '../../../Defines.debug',
  'src/extension/resource/core/ResourceLoader.ts': '../../../Defines.debug',
  'src/extension/resource/Resource.ts': '../../Defines.debug',
};

for (const [file, target] of Object.entries(fixes)) {
  let content = fs.readFileSync(file, 'utf8');
  if (target === '') {
    content = content.replace(/import\s*\{\s*\$warn\s*\}\s*from\s*"";\r?\n?/g, '');
  } else {
    content = content.replace(
      /import\s*\{\s*\$warn\s*\}\s*from\s*"";/g,
      `import { $warn } from "${target}";`
    );
  }
  fs.writeFileSync(file, content);
  console.log(file, '→ done');
}

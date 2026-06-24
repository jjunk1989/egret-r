import type { TestCaseDefinition } from './types';
import { EUI, EG, showCaseError } from './types';

export const gameCases: TestCaseDefinition[] = [
  {
    id: 'game-urlvariables',
    title: 'Game URLVariables Parse',
    module: 'game',
    run: async ({ root }) => {
      if (!EG.URLVariables) {
        try {
          await (0, eval)("import('@egret-r/game')");
        } catch {
          showCaseError(
            root,
            'Game module unavailable',
            'Failed to load @egret-r/game at runtime.',
          );
          return;
        }
      }

      if (!EG.URLVariables) {
        showCaseError(root, 'URLVariables unavailable', 'egret.URLVariables is missing in current runtime build.');
        return;
      }

      const vars = new EG.URLVariables('name=egret&mode=debug&feature=test&feature=unit');
      const data = vars.variables as Record<string, string | string[]>;

      const title = new EUI.Label();
      title.x = 40;
      title.y = 112;
      title.size = 22;
      title.textColor = 0x0f172a;
      title.text = 'Game case: URLVariables decode';
      root.addChild(title);

      const body = new EUI.Label();
      body.x = 40;
      body.y = 148;
      body.size = 18;
      body.textColor = 0x334155;
      body.lineSpacing = 8;
      body.text = [
        `name = ${String(data.name)}`,
        `mode = ${String(data.mode)}`,
        `feature = ${Array.isArray(data.feature) ? data.feature.join(', ') : String(data.feature)}`,
      ].join('\n');
      root.addChild(body);
    },
  },
];

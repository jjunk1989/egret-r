import { egret } from '@egret-r/core';
import { eui } from '@egret-r/eui';
import type { TestCaseDefinition } from './types';

export const assetsmanagerCases: TestCaseDefinition[] = [
  {
    id: 'am-api-overview',
    title: 'Assets Manager API Overview',
    module: 'assetsmanager',
    run: async ({ root }) => {
      const title = new eui.Label();
      title.x = 40;
      title.y = 112;
      title.size = 22;
      title.textColor = 0x0f172a;
      title.text = 'Assets Manager: API Overview';
      root.addChild(title);

      const body = new eui.Label();
      body.x = 40;
      body.y = 152;
      body.size = 16;
      body.textColor = 0x334155;
      body.lineSpacing = 6;

      const checks: [string, boolean][] = [
        ['ResourceLoader', typeof egret.ResourceLoader === 'function'],
        ['setConfigURL', typeof egret.setConfigURL === 'function'],
        ['getResourceInfo', typeof egret.getResourceInfo === 'function'],
        ['ImageProcessor', typeof egret.ImageProcessor === 'object'],
        ['TextProcessor', typeof egret.TextProcessor === 'object'],
        ['JsonProcessor', typeof egret.JsonProcessor === 'object'],
        ['BinaryProcessor', typeof egret.BinaryProcessor === 'object'],
        ['SoundProcessor', typeof egret.SoundProcessor === 'object'],
        ['FontProcessor', typeof egret.FontProcessor === 'object'],
        ['SheetProcessor', typeof egret.SheetProcessor === 'object'],
        ['TTFProcessor', typeof egret.TTFProcessor === 'object'],
        ['XMLProcessor', typeof egret.XMLProcessor === 'object'],
        ['MovieClipProcessor', typeof egret.MovieClipProcessor === 'object'],
        ['ETC1KTXProcessor', typeof egret.ETC1KTXProcessor === 'object'],
        ['MergeJSONProcessor', typeof egret.MergeJSONProcessor === 'object'],
        ['CommonJSProcessor', typeof egret.CommonJSProcessor === 'object'],
      ];

      const lines = checks.map(
        ([name, ok]) => `${ok ? '✅' : '❌'} egret.${name}`
      );

      body.text = [
        'Module loaded. Exposed APIs:',
        '',
        ...lines,
        '',
        `Total: ${checks.filter(([, ok]) => ok).length}/${checks.length} available`,
      ].join('\n');

      root.addChild(body);
    },
  },
  {
    id: 'am-config-setup',
    title: 'Assets Manager Config & ResourceInfo',
    module: 'assetsmanager',
    run: async ({ root }) => {
      const title = new eui.Label();
      title.x = 40;
      title.y = 112;
      title.size = 22;
      title.textColor = 0x0f172a;
      title.text = 'Assets Manager: Config & ResourceInfo';
      root.addChild(title);

      const body = new eui.Label();
      body.x = 40;
      body.y = 152;
      body.size = 16;
      body.textColor = 0x334155;
      body.lineSpacing = 6;

      // Test setConfigURL + resourceNameSelector + resourceMergerSelector
      egret.setConfigURL('resource/default.res.json', 'resource/');

      const hasNameSelector = typeof egret.resourceNameSelector === 'function';
      const hasMergerSelector = egret.resourceMergerSelector === null ||
        typeof egret.resourceMergerSelector === 'function' ||
        egret.resourceMergerSelector === undefined;

      // Test getResourceInfo with a non-existent path (returns null)
      const nullResult = egret.getResourceInfo('nonexistent.png');

      body.text = [
        'Config API test:',
        '',
        `setConfigURL: ✅ called successfully`,
        `resourceNameSelector: ${hasNameSelector ? '✅ function' : '❌ missing'}`,
        `resourceMergerSelector: ${hasMergerSelector ? '✅ ok' : '❌ missing'}`,
        `getResourceInfo: ✅ function`,
        `getResourceInfo('nonexistent.png') = ${nullResult === null ? 'null (expected)' : 'unexpected!'}`,
      ].join('\n');

      root.addChild(body);
    },
  },
  {
    id: 'am-file-system',
    title: 'Assets Manager FileSystem & Path',
    module: 'assetsmanager',
    run: async ({ root }) => {
      const title = new eui.Label();
      title.x = 40;
      title.y = 112;
      title.size = 22;
      title.textColor = 0x0f172a;
      title.text = 'Assets Manager: FileSystem & Path Utils';
      root.addChild(title);

      const body = new eui.Label();
      body.x = 40;
      body.y = 152;
      body.size = 16;
      body.textColor = 0x334155;
      body.lineSpacing = 6;

      const hasFS = typeof egret.NewFileSystem === 'function';

      // Path utils
      const testPath = 'assets/images/hero.png';
      const normalized = egret.normalize?.(testPath) ?? testPath;
      const basename = egret.basename?.(testPath) ?? '(n/a)';
      const dirname = egret.dirname?.(testPath) ?? '(n/a)';

      body.text = [
        'FileSystem & Path utilities:',
        '',
        `NewFileSystem: ${hasFS ? '✅ class' : '❌ missing'}`,
        '',
        'Path utils (path="assets/images/hero.png"):',
        `  normalize = "${normalized}"`,
        `  basename  = "${basename}"`,
        `  dirname   = "${dirname}"`,
      ].join('\n');

      root.addChild(body);
    },
  },
  {
    id: 'am-processors',
    title: 'Assets Manager Processors Registration',
    module: 'assetsmanager',
    run: async ({ root }) => {
      const title = new eui.Label();
      title.x = 40;
      title.y = 112;
      title.size = 22;
      title.textColor = 0x0f172a;
      title.text = 'Assets Manager: Processor Map';
      root.addChild(title);

      const body = new eui.Label();
      body.x = 40;
      body.y = 152;
      body.size = 16;
      body.textColor = 0x334155;
      body.lineSpacing = 6;

      // Check processor map is accessible
      const hasMap = typeof egret.map === 'object' && egret.map !== null;
      const hasIsSupport = typeof egret.isSupport === 'function';

      // Test isSupport with mocked resource info
      let supportResult = '';
      if (hasIsSupport) {
        const mockRes = { type: 'image', url: 'test.png', root: '', name: 'test.png' };
        supportResult = egret.isSupport(mockRes) ? 'image✅' : 'image❌';
        mockRes.type = 'text';
        supportResult += ' ' + (egret.isSupport(mockRes) ? 'text✅' : 'text❌');
        mockRes.type = 'json';
        supportResult += ' ' + (egret.isSupport(mockRes) ? 'json✅' : 'json❌');
      }

      body.text = [
        'Processor system:',
        '',
        `Processor map: ${hasMap ? '✅ registered' : '❌ missing'}`,
        `isSupport(): ${hasIsSupport ? '✅ function' : '❌ missing'}`,
        `isSupport check: ${supportResult || 'n/a'}`,
        '',
        'Registered processor types (via map):',
        ...(hasMap ? Object.keys(egret.map as Record<string, unknown>).map(k => `  - ${k}`) : ['  (map unavailable)']),
      ].join('\n');

      root.addChild(body);
    },
  },
];

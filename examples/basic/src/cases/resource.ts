import { egret } from '@egret-r/core';
import { eui } from '@egret-r/eui';
import type { TestCaseDefinition } from './types';

export const resourceCases: TestCaseDefinition[] = [
  {
    id: 'res-api-overview',
    title: 'Resource (RES) API Overview',
    module: 'resource',
    run: async ({ root }) => {
      const title = new eui.Label();
      title.x = 40;
      title.y = 112;
      title.size = 22;
      title.textColor = 0x0f172a;
      title.text = 'Resource (RES): API Overview';
      root.addChild(title);

      const body = new eui.Label();
      body.x = 40;
      body.y = 152;
      body.size = 16;
      body.textColor = 0x334155;
      body.lineSpacing = 6;

      const checks: [string, boolean][] = [
        ['loadConfig', typeof egret.loadConfig === 'function'],
        ['loadGroup', typeof egret.loadGroup === 'function'],
        ['getRes', typeof egret.getRes === 'function'],
        ['getResAsync', typeof egret.getResAsync === 'function'],
        ['getResByUrl', typeof egret.getResByUrl === 'function'],
        ['hasRes', typeof egret.hasRes === 'function'],
        ['destroyRes', typeof egret.destroyRes === 'function'],
        ['createGroup', typeof egret.createGroup === 'function'],
        ['getGroupByName', typeof egret.getGroupByName === 'function'],
        ['isGroupLoaded', typeof egret.isGroupLoaded === 'function'],
        ['parseConfig', typeof egret.parseConfig === 'function'],
        ['registerAnalyzer', typeof egret.registerAnalyzer === 'function'],
        ['getAnalyzer', typeof egret.getAnalyzer === 'function'],
        ['registerVersionController', typeof egret.registerVersionController === 'function'],
        ['getVersionController', typeof egret.getVersionController === 'function'],
        ['ResourceConfig', typeof egret.ResourceConfig === 'function'],
        ['ResourceItem', typeof egret.ResourceItem === 'object'],
        ['ResourceEvent', typeof egret.ResourceEvent === 'object'],
        ['Html5VersionController', typeof egret.Html5VersionController === 'function'],
      ];

      const lines = checks.map(
        ([name, ok]) => `${ok ? '✅' : '❌'} egret.${name}`
      );

      body.text = [
        'RES module loaded. Exposed APIs:',
        '',
        ...lines,
        '',
        `Total: ${checks.filter(([, ok]) => ok).length}/${checks.length} available`,
      ].join('\n');

      root.addChild(body);
    },
  },
  {
    id: 'res-analyzers',
    title: 'Resource Analyzers Overview',
    module: 'resource',
    run: async ({ root }) => {
      const title = new eui.Label();
      title.x = 40;
      title.y = 112;
      title.size = 22;
      title.textColor = 0x0f172a;
      title.text = 'Resource (RES): Analyzers';
      root.addChild(title);

      const body = new eui.Label();
      body.x = 40;
      body.y = 152;
      body.size = 16;
      body.textColor = 0x334155;
      body.lineSpacing = 6;

      const analyzers: [string, string, boolean][] = [
        ['ImageAnalyzer', 'image/png/jpg/gif', typeof egret.ImageAnalyzer === 'function'],
        ['TextAnalyzer', 'txt', typeof egret.TextAnalyzer === 'function'],
        ['JsonAnalyzer', 'json', typeof egret.JsonAnalyzer === 'function'],
        ['XMLAnalyzer', 'xml', typeof egret.XMLAnalyzer === 'function'],
        ['BinAnalyzer', 'bin/bytes', typeof egret.BinAnalyzer === 'function'],
        ['SoundAnalyzer', 'mp3/wav', typeof egret.SoundAnalyzer === 'function'],
        ['FontAnalyzer', 'fnt', typeof egret.FontAnalyzer === 'function'],
        ['SheetAnalyzer', 'sprite sheet', typeof egret.SheetAnalyzer === 'function'],
        ['AnimationAnalyzer', 'animation', typeof egret.AnimationAnalyzer === 'function'],
      ];

      const lines = analyzers.map(
        ([name, ext, ok]) => `${ok ? '✅' : '❌'} egret.${name} (${ext})`
      );

      body.text = [
        'Resource analyzers available:',
        '',
        ...lines,
        '',
        `Total: ${analyzers.filter(([, , ok]) => ok).length}/${analyzers.length} registered`,
      ].join('\n');

      root.addChild(body);
    },
  },
  {
    id: 'res-config-group',
    title: 'Resource Config & Group API',
    module: 'resource',
    run: async ({ root }) => {
      const title = new eui.Label();
      title.x = 40;
      title.y = 112;
      title.size = 22;
      title.textColor = 0x0f172a;
      title.text = 'Resource (RES): Config & Groups';
      root.addChild(title);

      const body = new eui.Label();
      body.x = 40;
      body.y = 152;
      body.size = 16;
      body.textColor = 0x334155;
      body.lineSpacing = 6;

      // Test createGroup / getGroupByName / isGroupLoaded
      egret.createGroup('test_group', ['asset1.png', 'asset2.json'], true);
      const groupInfo = egret.getGroupByName('test_group');
      const isLoaded = egret.isGroupLoaded('test_group');
      const hasAsset1 = egret.hasRes('asset1.png');

      // Test version controller
      const vc = egret.getVersionController();
      const vcType = vc ? (vc instanceof egret.Html5VersionController ? 'Html5VersionController' : vc.constructor.name) : 'none';

      body.text = [
        'Config & Group API test:',
        '',
        `createGroup('test_group', ['asset1.png','asset2.json']): ✅ called`,
        `getGroupByName('test_group'): ${groupInfo ? `✅ ${groupInfo.length} items` : '❌ null'}`,
        `isGroupLoaded('test_group'): ${isLoaded ? 'true' : 'false'}`,
        `hasRes('asset1.png'): ${hasAsset1 ? 'true' : 'false'}`,
        '',
        'Version controller:',
        `getVersionController(): ${vcType}`,
        `registerVersionController: ${typeof egret.registerVersionController === 'function' ? '✅' : '❌'}`,
      ].join('\n');

      root.addChild(body);
    },
  },
  {
    id: 'res-parser-config',
    title: 'Resource Config Parsing',
    module: 'resource',
    run: async ({ root }) => {
      const title = new eui.Label();
      title.x = 40;
      title.y = 112;
      title.size = 22;
      title.textColor = 0x0f172a;
      title.text = 'Resource (RES): Config Parsing';
      root.addChild(title);

      const body = new eui.Label();
      body.x = 40;
      body.y = 152;
      body.size = 16;
      body.textColor = 0x334155;
      body.lineSpacing = 6;

      // Build a minimal resource config JSON
      const testConfig = {
        groups: [
          {
            name: 'preload',
            keys: 'bg_jpg,btn_png'
          }
        ],
        resources: [
          { name: 'bg_jpg', type: 'image', url: 'assets/bg.jpg' },
          { name: 'btn_png', type: 'image', url: 'assets/btn.png' },
          { name: 'config_json', type: 'json', url: 'assets/config.json' },
        ]
      };

      // Test parseConfig
      let parseOk = false;
      try {
        egret.parseConfig(testConfig, 'assets/');
        // Verify config was loaded
        const grp = egret.getGroupByName('preload');
        parseOk = grp !== null && grp.length > 0;
      } catch (e) {
        parseOk = false;
      }

      body.text = [
        'Config parsing test:',
        '',
        `parseConfig(minimal-resource.json, 'assets/'): ${parseOk ? '✅ success' : '❌ failed'}`,
        '',
        'Test config structure:',
        '  groups: [preload] → bg.jpg, btn.png',
        '  resources: bg.jpg, btn.png, config.json',
        '',
        `ResourceItem interface: ${typeof egret.ResourceItem === 'object' ? '✅ defined' : '❌ missing'}`,
        `ResourceEvent enum: ${typeof egret.ResourceEvent === 'object' ? '✅ defined' : '❌ missing'}`,
      ].join('\n');

      root.addChild(body);
    },
  },
];

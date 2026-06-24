import type { TestCaseDefinition } from './types';
import { EUI } from './types';
const _E = (globalThis as any).eui;

export const socketCases: TestCaseDefinition[] = [
  {
    id: 'socket-websocket',
    title: 'Socket WebSocket Wrapper',
    module: 'socket',
    run: async ({ root }) => {
      const EG_SOCKET = (globalThis as any).egret;

      const label = new _E.Label();
      label.x = 40;
      label.y = 112;
      label.size = 22;
      label.textColor = 0x0f172a;
      label.text = 'Socket case: ISocket API';
      root.addChild(label);

      const body = new _E.Label();
      body.x = 40;
      body.y = 148;
      body.size = 18;
      body.textColor = 0x334155;
      body.lineSpacing = 8;

      if (!EG_SOCKET.WebSocket) {
        body.text = 'egret.WebSocket is unavailable.\nSocket module may not be loaded yet.';
        root.addChild(body);
        return;
      }

      const socket = new EG_SOCKET.WebSocket();
      const typeStr = typeof socket.connect === 'function' ? 'WebSocket API ready' : 'WebSocket API incomplete';
      body.text = [
        'Socket module loaded successfully.',
        `WebSocket constructor: ${typeof EG_SOCKET.WebSocket}`,
        `${typeStr}`,
      ].join('\n');
      root.addChild(body);
    },
  },
];

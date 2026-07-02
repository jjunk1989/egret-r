import { describe, expect, it } from 'vitest';
import { egret } from '@egret-r/core';

describe('socket module', () => {
  it('should load @egret-r/socket', async () => {
    await import('@egret-r/socket');
    expect((egret as any).WebSocket).toBeTruthy();
  });

  it('WebSocket constructor should create an instance', async () => {
    await import('@egret-r/socket');
    const ws = new egret.WebSocket();
    expect(ws).toBeInstanceOf(egret.EventDispatcher);
  });

  it('WebSocket should have static type constants', async () => {
    await import('@egret-r/socket');
    expect(egret.WebSocket.TYPE_STRING).toBe('webSocketTypeString');
    expect(egret.WebSocket.TYPE_BINARY).toBe('webSocketTypeBinary');
  });

  it('WebSocket instance should have expected API methods', async () => {
    await import('@egret-r/socket');
    const ws = new egret.WebSocket();
    expect(typeof ws.connect).toBe('function');
    expect(typeof ws.connectByUrl).toBe('function');
    expect(typeof ws.writeUTF).toBe('function');
    expect(typeof ws.close).toBe('function');
    expect(typeof ws.addEventListener).toBe('function');
    expect(typeof ws.removeEventListener).toBe('function');
  });

  it('WebSocket should not be connected initially', async () => {
    await import('@egret-r/socket');
    const ws = new egret.WebSocket();
    expect(ws.connected).toBe(false);
  });
});

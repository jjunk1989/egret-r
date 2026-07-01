const { JSDOM } = require('jsdom');

async function main() {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'http://localhost' });

  Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    HTMLCanvasElement: dom.window.HTMLCanvasElement,
    HTMLImageElement: dom.window.HTMLImageElement,
    HTMLElement: dom.window.HTMLElement,
    location: dom.window.location,
    localStorage: dom.window.localStorage,
    DOMParser: dom.window.DOMParser,
  });

  try {
    await import('../packages/tween/dist/index.js');
    console.log('Tween loaded OK');
  } catch (e) {
    console.error('ERROR:', e.message);
    const lines = e.stack.split('\n');
    for (let i = 0; i < Math.min(8, lines.length); i++) {
      console.error(lines[i]);
    }
  }
}
main();

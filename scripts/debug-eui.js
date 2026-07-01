const { JSDOM } = require('jsdom');

async function main() {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'http://localhost' });
  Object.assign(globalThis, {
    window: dom.window, document: dom.window.document,
    HTMLCanvasElement: dom.window.HTMLCanvasElement,
    HTMLImageElement: dom.window.HTMLImageElement,
    HTMLElement: dom.window.HTMLElement,
    location: dom.window.location,
    localStorage: dom.window.localStorage,
    DOMParser: dom.window.DOMParser,
  });

  try {
    const { egret, eui } = await import('../packages/eui/dist/index.js');
    console.log('eui keys:', Object.keys(eui).slice(0, 20));
    console.log('eui.Label:', typeof eui.Label);
    
    try {
      const label = new eui.Label();
      console.log('label created:', label);
      console.log('label.$TextField:', label.hasOwnProperty('$TextField'));
    } catch(e) {
      console.error('Label error:', e.message);
      console.error(e.stack.split('\n').slice(0, 6).join('\n'));
    }
  } catch (e) {
    console.error('Load error:', e.message);
    console.error(e.stack.split('\n').slice(0, 5).join('\n'));
  }
}
main();

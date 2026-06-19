import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true,
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
  },
  optimizeDeps: {
    exclude: ['@egret-r/core', '@egret-r/eui', '@egret-r/game', '@egret-r/tween'],
  },
});
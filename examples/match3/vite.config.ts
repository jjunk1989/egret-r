import { defineConfig } from 'vite';

export default defineConfig({
  server: { port: 3008, open: true },
  build: { target: 'es2020', minify: 'esbuild' },
  optimizeDeps: {
    exclude: ['@egret-r/core', '@egret-r/eui', '@egret-r/game', '@egret-r/tween', '@egret-r/socket'],
  },
  resolve: { preserveSymlinks: true },
  plugins: [
    {
      name: 'fix-egret-r-cache',
      configureServer(server: any) {
        server.middlewares.use((req: any, res: any, next: any) => {
          const url = req.url || '';
          if (url.includes('@egret-r') && url.includes('/dist/')) {
            const original = res.setHeader;
            res.setHeader = function (name: string, value: any) {
              if (name.toLowerCase() === 'cache-control' && typeof value === 'string')
                value = value.replace(/,?\s*immutable/i, '');
              return original.call(this, name, value);
            } as any;
          }
          next();
        });
      },
    },
  ],
});

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
    exclude: ['@egret-r/core', '@egret-r/eui', '@egret-r/game', '@egret-r/tween', '@egret-r/socket', '@egret-r/assetsmanager', '@egret-r/resource'],
  },
  resolve: {
    preserveSymlinks: true,
  },
  plugins: [
    {
      name: 'fix-egret-r-cache',
      configureServer(server) {
        // Vite sets immutable cache for @fs/ files, but our workspace
        // packages are rebuilt frequently and the ?v= hash doesn't change.
        // Strip immutable so the browser always revalidates these files.
        server.middlewares.use((req, res, next) => {
          const url = req.url || '';
          if (url.includes('@egret-r') && url.includes('/dist/')) {
            const original = res.setHeader;
            res.setHeader = function (name: string, value: any) {
              if (name.toLowerCase() === 'cache-control' && typeof value === 'string') {
                value = value.replace(/,?\s*immutable/i, '');
              }
              return original.call(this, name, value);
            } as any;
          }
          next();
        });
      },
    },
  ],
});
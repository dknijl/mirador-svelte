import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'url';

export default defineConfig({
  oxc: {
    exclude: [],
    include: /(src|__tests__)\/.*\.jsx?$/,
  },
  optimizeDeps: {
    rolldownOptions: {
      moduleTypes: {
        '.js': 'jsx',
      },
    },
  },
  plugins: [svelte(), react()],
  resolve: {
    alias: [
      { find: '@tests', replacement: fileURLToPath(new URL('./__tests__', import.meta.url)) },
      { find: '@src', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      // Vitest resolves package conditions for node, which would pick Svelte's
      // server build (where `mount` is unavailable). Adding the global
      // `browser` condition instead breaks msw/node, so only the Svelte root
      // entry is pointed at its client build.
      { find: /^svelte$/, replacement: fileURLToPath(new URL('./node_modules/svelte/src/index-client.js', import.meta.url)) },
    ],
  },
  test: {
    environment: 'happy-dom',
    environmentOptions: {
      happyDOM: {
        settings: {
          // don't load real pages into iframes (e.g. IIIF auth token iframes)
          navigation: { disableChildFrameNavigation: true },
        },
      },
    },
    exclude: ['node_modules'],
    globals: true,
    include: ['**/*.test.js', '**/*.test.jsx'],
    sequence: {
      shuffle: true,
    },
    setupFiles: ['./setupTest.js'],
  },
});

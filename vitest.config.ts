import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: [
      { find: '@tests', replacement: fileURLToPath(new URL('./__tests__', import.meta.url)) },
      { find: '@src', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      // Vitest resolves package conditions for node, which would pick Svelte's
      // server build (where `mount` is unavailable). Adding the global
      // `browser` condition breaks msw/node, so select the client entry for each
      // Svelte module that owns DOM lifecycle or subscriptions.
      { find: /^svelte$/, replacement: fileURLToPath(new URL('./node_modules/svelte/src/index-client.js', import.meta.url)) },
      {
        find: /^svelte\/reactivity$/,
        replacement: fileURLToPath(new URL('./node_modules/svelte/src/reactivity/index-client.js', import.meta.url)),
      },
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
    include: ['**/*.test.js'],
    sequence: {
      shuffle: true,
    },
    setupFiles: ['./setupTest.js'],
  },
});

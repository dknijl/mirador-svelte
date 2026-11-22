import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { svelte } from '@sveltejs/vite-plugin-svelte';

/**
 * Vite configuration
 */
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: './src/index.js',
      fileName: (format) => (format === 'umd' ? 'kokudor.min.js' : undefined),
      formats: ['umd'],
      name: 'Kokudor',
    },
    rolldownOptions: {
      external: ['__tests__/*'],
      output: {
        assetFileNames: 'mirador.[ext]',
        exports: 'named',
      },
    },
    sourcemap: true,
  },
  define: {
    'process.env': '{}',
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  plugins: [svelte(), react()],
});

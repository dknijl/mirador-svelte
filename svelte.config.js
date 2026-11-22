/**
 * Svelte compiler configuration.
 *
 * Mirador is a plain JavaScript codebase (no TypeScript), so no preprocessing
 * is needed: the plugin compiles `.svelte` files as-is.
 */
export default {
  compilerOptions: {
    // Mirador ships `dist/mirador.es.js` / `dist/kokudor.min.js` as its build
    // artifacts and consumers only import the JS, so component styles have to
    // travel with the JS instead of a separate stylesheet nobody would load.
    // Svelte de-duplicates injection per component.
    css: 'injected',
    // Svelte 5 runes mode is the default; stating it keeps the intent explicit
    // for components that are mounted from React through the bridge.
    runes: true,
  },
};

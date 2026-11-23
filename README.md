# Kokudor

[日本語](README.ja.md)

Kokudor is a Mirador-based viewer for IIIF images.

## Embed in Svelte, Vue or React

1. Build Kokudor from the root of this repository.

   ```sh
   npm ci
   npm run build
   ```

2. Copy `dist/kokudor.min.js` to your app’s static files directory (`static/` for SvelteKit, `public/` for Vite or Next.js). Save the following as `kokudor.html` beside it. Set `manifestId` to the IIIF manifest you want to display.

   ```html
   <!doctype html>
   <meta charset="utf-8">
   <title>Kokudor</title>
   <div id="kokudor" style="position: absolute; inset: 0"></div>
   <script src="./kokudor.min.js"></script>
   <script>
     Kokudor.viewer({
       id: 'kokudor',
       windows: [{ manifestId: 'https://kokusho.nijl.ac.jp/biblio/200013800/manifest' }],
     });
   </script>
   ```

3. Paste this iframe into your Svelte markup, Vue template or React JSX. Adjust `src` if your app is served under a subpath.

   ```html
   <iframe src="/kokudor.html" title="Kokudor" width="100%" height="600"></iframe>
   ```

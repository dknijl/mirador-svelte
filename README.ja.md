# Kokudor

[English](README.md)

Kokudor は、Mirador をベースにした IIIF 画像ビューアです。

## Svelte・Vue・React に埋め込む

1. このリポジトリのルートで Kokudor をビルドします。

   ```sh
   npm ci
   npm run build
   ```

2. `dist/kokudor.min.js` をアプリの静的ファイル用ディレクトリ（SvelteKit なら `static/`、Vite や Next.js なら `public/`）にコピーします。同じ場所に以下の内容を `kokudor.html` として保存し、`manifestId` に表示したい資料の IIIF マニフェスト URL を指定します。

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

3. 以下の iframe を Svelte のマークアップ、Vue のテンプレート、または React の JSX に貼り付けます。アプリをサブパスで公開する場合は、`src` を公開先に合わせてください。

   ```html
   <iframe src="/kokudor.html" title="Kokudor" width="100%" height="600"></iframe>
   ```

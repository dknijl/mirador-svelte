# Kokudor

Kokudor is an IIIF viewer based on Mirador. To build the viewer from this repository, run `npm install` and `npm run build`. The UMD bundle is written to `dist/kokudor.min.js` and exposes `Kokudor.viewer()`.

## Adding translations to Kokudor
For help with adding a translation, see [src/locales/README.md](src/locales/README.md)

## Running Kokudor locally for development

Kokudor local development requires [nodejs](https://nodejs.org/en/download/) to be installed.

1. Run `npm install` to install the dependencies.

### Starting the project

```sh
$ npm start
```

Then navigate to [http://127.0.0.1:4444/](http://127.0.0.1:4444/)

### Instantiating Kokudor

Save this HTML alongside the `dist` directory and serve it over HTTP.

```html
<!doctype html>
<meta charset="utf-8">
<title>Kokudor</title>
<div id="kokudor" style="position: absolute; inset: 0"></div>
<script src="./dist/kokudor.min.js"></script>
<script>
  const { store } = Kokudor.viewer({
    id: 'kokudor',
    windows: [{ manifestId: 'https://kokusho.nijl.ac.jp/biblio/200013800/manifest' }],
  });
</script>
```

### Example Action

Add a window:
```javascript
store.dispatch(Kokudor.addWindow());
```

To focus a window run:

```javascript
store.dispatch(Kokudor.focusWindow('window-1'))
```

### Check current state

```javascript
store.getState()
```

## Running the tests
We use Vitest to run our test suite.

```sh
$ npm test
```

You can see the helpful Vitest UI in your browser by running Vitest with the `--ui` flag. To pass the flag through to npm run the following:

```sh
$ npm test -- --ui
```

You can run Vitest without the additional linting and size checks in our `npm test` command. You can also test a single file:
```sh
$ npx vitest __tests__/integration/tests/sequence-switching.test.js --ui
```

## Linting the project

```sh
$ npm run lint
```
## Image Fallback

Kokudor automatically displays a simple fallback placeholder when images fail to load. Customize the fallback image via configuration:

```javascript
const config = {
  fallbackImage: 'https://example.com/custom-fallback.jpg',
};
```

The error message is translatable via the `imageFailedToLoad` translation key. Detailed error information is logged to the console for debugging.

## Debugging

### Local instance

The following browser extensions are useful for debugging a local development instance of Kokudor:

 - [React DevTools](https://github.com/facebook/react-devtools)
 - [Redux DevTools](https://github.com/zalmoxisus/redux-devtools-extension)

### Test suite

To debug the test suite, run:

```sh
$ npm run test:debug
```

then spin up a [nodejs inspector client](https://nodejs.org/en/docs/guides/debugging-getting-started/#inspector-clients) and set some breakpoints. See [here](https://www.digitalocean.com/community/tutorials/how-to-debug-node-js-with-the-built-in-debugger-and-chrome-devtools#step-3-%E2%80%94-debugging-node-js-with-chrome-devtools) for a guide to debugging with Chrome DevTools.

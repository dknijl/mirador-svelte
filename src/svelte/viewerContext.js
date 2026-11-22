import { createSubscriber, SvelteSet } from 'svelte/reactivity';
import createI18nInstance from '../i18n';
import { getConfig } from '../state/selectors';

const defaultFallback =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="600"%3E%3Crect width="400" height="600" fill="%23f5f5f5"/%3E%3Cpath d="M 200 240 L 254 354 L 146 354 Z M 200 228 L 128 372 L 272 372 Z M 204.5 336 L 195.5 336 L 195.5 345 L 204.5 345 Z M 204.5 309 L 195.5 309 L 195.5 327 L 204.5 327 Z" fill="%231967d2"/%3E%3C/svg%3E';

export const viewerContext = Symbol('Mirador viewer');

export function createViewerContext(store, plugins = []) {
  const subscribe = createSubscriber((update) => store.subscribe(update));
  const i18n = createI18nInstance();
  const failedImages = new SvelteSet();
  let resources;
  let language;
  return {
    store,
    get plugins() {
      return typeof plugins === 'function' ? plugins() : plugins;
    },
    failedImages,
    notifyFailure: (url) => failedImages.add(url),
    get fallbackImage() {
      return getConfig(this.state).fallbackImage || defaultFallback;
    },
    get state() {
      subscribe();
      return store.getState();
    },
    get t() {
      const config = getConfig(this.state);
      if (resources !== config.translations) {
        resources = config.translations;
        for (const [locale, translations] of Object.entries(resources || {})) {
          i18n.addResourceBundle(locale, 'translation', translations, true, true);
        }
      }
      if (!language || language.lng !== config.language || language.resources !== resources) {
        language = { lng: config.language, resources, translate: i18n.getFixedT(config.language || 'en') };
      }
      return language.translate;
    },
  };
}

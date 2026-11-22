import { flushSync, mount, unmount } from 'svelte';
import { SvelteProps } from './reactiveProps.svelte';
import createStore from '@src/state/store';
import { createViewerContext, viewerContext } from '@src/svelte/viewerContext';
import { within } from '@testing-library/dom';
import { onTestFinished } from 'vitest';

/** Mount in a fresh DOM container and release the component after this test. */
export function renderSvelte(
  Component,
  props = {},
  { preloadedState = {}, store = props.store ?? createStore([], [], { preloadedState }), plugins = props.plugins ?? [] } = {},
) {
  const container = document.body.appendChild(document.createElement('div'));
  const context = createViewerContext(store, plugins);
  const defaults = {
    store,
    plugins,
    t: context.t,
    failedImages: context.failedImages,
    fallbackImage: context.fallbackImage,
    notifyFailure: context.notifyFailure,
  };
  const state = new SvelteProps({ ...defaults, ...props });

  let active = true;

  const instance = mount(Component, {
    props: state.current,
    target: container,
    context: new Map([[viewerContext, () => context]]),
  });
  onTestFinished(destroy);
  flushSync();
  function destroy() {
    if (!active) return;
    active = false;
    if (instance) unmount(instance);
    container.remove();
  }
  return {
    ...within(container),
    container,
    store,
    unmount: destroy,
    rerender(next) {
      flushSync(() => state.update({ ...defaults, ...next }));
    },
  };
}

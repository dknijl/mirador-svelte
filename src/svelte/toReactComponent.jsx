import { useEffect, useLayoutEffect, useRef } from 'react';
import { flushSync, mount, unmount } from 'svelte';
import { SvelteProps } from './reactiveProps.svelte';

/**
 * Wrap a Svelte 5 component so React can render it.
 *
 * React owns the props and the lifetime, Svelte owns the DOM inside. Prop
 * changes flow through a `$state` proxy, so Svelte's own reactivity sees them.
 *
 * The wrapper renders a `display: contents` host node: it keeps the Svelte
 * component in React's tree without adding a box to the layout. It is a
 * `span` because Mirador also mounts these components inside `p` elements,
 * where a `div` would be invalid markup.
 *
 * Not bridged yet: React `children`/slots, React context, and Svelte-raised
 * events. Plain callback props (`onClick`, `onError`, ...) work.
 *
 * @param {Function} SvelteComponent compiled Svelte 5 component
 * @param {string} [displayName] name used in React devtools and error messages
 */
export function toReactComponent(SvelteComponent, displayName) {
  function SvelteBridge(props) {
    const targetRef = useRef(null);
    const instanceRef = useRef(null);
    const propsRef = useRef(null);

    if (propsRef.current === null) propsRef.current = new SvelteProps(props);

    useLayoutEffect(() => {
      propsRef.current.update(props);
      if (instanceRef.current) flushSync();
    });

    useEffect(() => {
      const target = targetRef.current;
      instanceRef.current = mount(SvelteComponent, { props: propsRef.current.current, target });
      // Run Svelte's pending effects now, so listeners/subscriptions are
      // registered before the surrounding React effect finishes.
      flushSync();

      return () => {
        const instance = instanceRef.current;
        instanceRef.current = null;
        unmount(instance);
      };
    }, []);

    return <span ref={targetRef} style={{ display: 'contents' }} />;
  }

  SvelteBridge.displayName = displayName || `Svelte(${SvelteComponent.name || 'component'})`;

  return SvelteBridge;
}

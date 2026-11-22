<script>
  import { getContext } from 'svelte';
  import { viewerContext } from '../svelte/viewerContext';
  import { getThumbnailFactory } from '../state/selectors/thumbnails';
  import { getLocale } from '../state/selectors';

  let {
    store,
    resource,
    thumbnail,
    labelled = false,
    label,
    maxHeight,
    maxWidth,
    style = {},
    children,
    notifyFailure,
    fallbackImage,
    imagePlaceholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMMDQmtBwADgwF/Op8FmAAAAABJRU5ErkJggg==',
  } = $props();
  const getViewer = getContext(viewerContext);
  const context = $derived(getViewer?.());
  const state = $derived(context?.state ?? store.getState());
  const image = $derived(thumbnail ?? getThumbnailFactory(state, maxHeight, maxWidth).get(resource));
  const caption = $derived(label ?? resource?.getLabel?.()?.getValue(getLocale(state, {}) || '') ?? resource?.id);
  let visible = $state(false);
  let failedUrl = $state(null);
  const failed = $derived(Boolean(failedUrl && failedUrl === image?.url));
  const box = $derived(dimensions(image, maxWidth, maxHeight));
  const source = $derived(failed ? fallbackImage || imagePlaceholder : (visible && image?.url) || imagePlaceholder);
  function dimensions(item, w, h) {
    if (!item?.height || !item.width)
      return { width: item?.height && !item.width ? undefined : w, height: item?.width && !item.height ? undefined : h };
    const ratio = item.width / item.height;
    if ((!w || item.width <= w) && (!h || item.height <= h)) return { width: item.width, height: item.height };
    if (!w) return { height: h, maxWidth: Math.round(h * ratio) };
    if (!h) return { width: w, maxHeight: Math.round(w / ratio) };
    const scale = Math.min(w / item.width, h / item.height);
    return { width: Math.round(item.width * scale), height: Math.round(item.height * scale) };
  }
  function length(value) {
    return typeof value === 'number' ? value + 'px' : value;
  }
  function observe(element) {
    if (!globalThis.IntersectionObserver) {
      visible = true;
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        visible = true;
        observer.disconnect();
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }
  function error() {
    if (!image?.url || source !== image.url) return;
    failedUrl = source;
    notifyFailure?.(source);
  }
</script>

<div>
  <img
    {@attach observe}
    src={source}
    alt={failed ? 'Thumbnail image unavailable' : ''}
    role={failed ? undefined : 'presentation'}
    onerror={error}
    style:height={length(style.height ?? box.height ?? (failed ? box.maxHeight : undefined) ?? 'auto')}
    style:width={length(style.width ?? box.width ?? (failed ? box.maxWidth : undefined) ?? 'auto')}
    style:max-width={length(style.maxWidth ?? box.maxWidth)}
    style:max-height={length(style.maxHeight ?? box.maxHeight)}
    style:object-fit={failed && fallbackImage ? 'contain' : style.objectFit}
  />
  {#if labelled}<span>{caption}</span>{/if}
  {@render children?.()}
</div>

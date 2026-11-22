<script>
  import OpenSeadragon from 'openseadragon';
  import { untrack } from 'svelte';

  let { viewer, index, opacity, fitBounds, tileSource, url, fallbackImage, notifyFailure } = $props();
  let item = $state.raw(null);
  // Spread props from the window can refresh together on any store update.
  // Track the image identity separately from its mutable presentation.
  const owner = $derived(viewer);
  const imageUrl = $derived(url);
  const descriptor = $derived(tileSource);
  const x = $derived(fitBounds?.[0]);
  const y = $derived(fitBounds?.[1]);
  const width = $derived(fitBounds?.[2]);
  const height = $derived(fitBounds?.[3]);
  const bounds = $derived(x == null ? undefined : new OpenSeadragon.Rect(x, y, width, height));

  $effect(() => {
    const osd = owner;
    const source = imageUrl ? { type: 'image', url: imageUrl } : descriptor;
    if (!osd || !source) return undefined;
    let released = false;
    let owned;
    function loaded({ item: image }) {
      if (released) osd.world?.removeItem(image);
      else {
        owned = image;
        item = image;
      }
    }
    function add(sourceToLoad, error) {
      osd.addTiledImage({ tileSource: sourceToLoad, index, opacity, fitBounds: bounds, success: loaded, error });
    }
    function failed(error) {
      if (released) return;
      const imageUrl = url || (typeof source === 'string' ? source : source['@id'] || source.id);
      if (imageUrl) notifyFailure?.(imageUrl);
      console.warn('[Mirador: OSD tile image load failed]', error);
      if (fallbackImage) add({ type: 'image', url: fallbackImage });
    }
    untrack(() => add(typeof source === 'string' ? source : { ...source }, failed));
    return () => {
      released = true;
      if (owned) osd.world?.removeItem(owned);
      item = null;
    };
  });

  $effect(() => {
    if (item && opacity != null) item.setOpacity(opacity);
  });
  $effect(() => {
    if (item && bounds) item.fitBounds(bounds);
  });
  $effect(() => {
    if (item && index != null) viewer.world.setItemIndex(item, index);
  });
</script>

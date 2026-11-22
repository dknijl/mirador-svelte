<script>
  import Connected from '../svelte/Connected.svelte';
  import Thumbnail from './IIIFThumbnail.svelte';
  let {
    canvas,
    selected = false,
    setCanvas,
    focusOnCanvas,
    annotationsCount,
    requestCanvasAnnotations,
    searchAnnotationsCount = 0,
    config = { height: 100, width: null },
    t,
  } = $props();
  let element;
  let requested;
  $effect(() => {
    if (selected) element?.scrollIntoView?.({ block: 'nearest', container: 'nearest' });
  });
  function observe(node) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && annotationsCount === 0 && requested !== canvas) {
        requested = canvas;
        requestCanvasAnnotations?.();
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }
  function key(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      focusOnCanvas();
    } else setCanvas(canvas.id);
  }
</script>

<div
  class="thumbnail"
  class:selected
  bind:this={element}
  {@attach observe}
  role="button"
  tabindex="0"
  onclick={() => (selected ? focusOnCanvas() : setCanvas(canvas.id))}
  onkeyup={key}
  style:max-height={config.height + 45 + 'px'}
>
  <Connected
    name="IIIFThumbnail"
    component={Thumbnail}
    targetProps={{ resource: canvas, labelled: true, maxHeight: config.height, maxWidth: config.width }}
  >
    <div class="counts">
      {#if searchAnnotationsCount > 0}<span class="count" aria-label={t('searchResults')}>{searchAnnotationsCount}</span>{/if}
      {#if annotationsCount > 0}<span class="count" aria-label={t('annotations')}>{annotationsCount}</span>{/if}
    </div>
  </Connected>
</div>

<style>
  .thumbnail {
    border: 2px solid transparent;
    cursor: pointer;
    display: inline-block;
    margin: 8px 4px;
    min-width: 60px;
    overflow: hidden;
    padding: 4px;
    position: relative;
    width: min-content;
  }
  .thumbnail.selected {
    border-color: var(--mirador-primary);
  }
  .counts {
    position: absolute;
    inset-block-start: 0;
    inset-inline-end: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .count {
    border-radius: 1em;
    padding: 0 0.4em;
    background: var(--mirador-paper);
    color: var(--mirador-text);
  }
</style>

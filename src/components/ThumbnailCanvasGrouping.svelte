<script>
  import Connected from '../svelte/Connected.svelte';
  import IIIFThumbnail from './IIIFThumbnail.svelte';
  let {
    canvasGroupings = [],
    index,
    bottomRows = 1,
    columnCount,
    columnIndex = 0,
    rowIndex = 0,
    currentCanvasId,
    position,
    style = {},
    setCanvas,
    showThumbnailLabels = true,
  } = $props();
  const side = $derived(position !== 'far-bottom');
  const groupIndex = $derived(
    index ?? (side ? rowIndex * (columnCount || canvasGroupings.length) + columnIndex : columnIndex * bottomRows + rowIndex),
  );
  const group = $derived(canvasGroupings[groupIndex]);
  const imageHeight = $derived(Math.max(1, (style.height || 100) - 12 - (showThumbnailLabels ? 20 : 0)));
  const selected = $derived(group?.some((canvas) => canvas.id === currentCanvasId));
</script>

{#if group?.length}
  <div
    class="mirador-thumbnail-nav-container"
    role="gridcell"
    style:width={Number.isFinite(style.width) ? style.width + 'px' : undefined}
    style:height={Number.isFinite(style.height) ? style.height + 'px' : undefined}
    aria-selected={selected}
    aria-colindex={columnIndex + 1}
    aria-rowindex={rowIndex + 1}
  >
    <button
      type="button"
      class={'mirador-thumbnail-nav-canvas mirador-thumbnail-nav-canvas-' + groupIndex}
      class:current={selected}
      data-canvas-index={group[0].index}
      data-canvas-id={group[0].id}
      style:height="auto"
      style:width="100%"
      aria-label={showThumbnailLabels
        ? undefined
        : group.map((canvas) => canvas.getLabel?.()?.getValue?.('') || String(canvas.index + 1)).join(', ')}
      onclick={() => setCanvas(group[0].id)}
    >
      {#each group as canvas (canvas.id)}
        <Connected
          name="IIIFThumbnail"
          component={IIIFThumbnail}
          targetProps={{
            resource: canvas,
            labelled: showThumbnailLabels,
            label: side ? String(canvas.index + 1) : undefined,
            maxHeight: imageHeight,
            style: { width: '100%', maxWidth: '100%', height: imageHeight, objectFit: 'contain' },
          }}
        />
      {/each}
    </button>
  </div>
{/if}

<style>
  .mirador-thumbnail-nav-container {
    box-sizing: border-box;
    min-width: 0;
    padding: 6px;
  }
  button {
    display: flex;
    align-items: center;
    padding: 0;
    color: inherit;
    background: transparent;
    border: 0;
  }
  button.current {
    outline: 2px solid var(--mirador-primary);
    outline-offset: 2px;
  }
  button :global(img) {
    display: block;
  }
  button :global(span) {
    display: block;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  button :global(div) {
    min-width: 0;
    flex: 1;
  }
</style>

<script>
  import { untrack } from 'svelte';
  import Connected from '../svelte/Connected.svelte';
  import ThumbnailCanvasGrouping from './ThumbnailCanvasGrouping.svelte';

  let {
    canvasGroupings = [],
    canvasIndex = 0,
    hasNextCanvas = false,
    hasPreviousCanvas = false,
    position = 'far-left',
    setNextCanvas = () => {},
    setPreviousCanvas = () => {},
    thumbnailColumns = null,
    thumbnailNavigation = {},
    view = 'single',
    viewingDirection = 'left-to-right',
    windowId,
    t = (key) => key,
  } = $props();
  let viewport = $state();
  let gridElement = $state();
  let scrollTop = $state(0);
  let scrollLeft = $state(0);

  const horizontal = $derived(position === 'far-bottom');
  const side = $derived(position === 'far-left' || position === 'far-right');
  const columnsPref = $derived(Math.max(1, Number(thumbnailColumns ?? thumbnailNavigation.columns ?? 1)));
  const bottomRows = $derived(horizontal ? columnsPref : 1);
  const columns = $derived(horizontal ? Math.ceil(canvasGroupings.length / bottomRows) : columnsPref);
  const rows = $derived(horizontal ? bottomRows : Math.ceil(canvasGroupings.length / columns));
  const preferredWidth = $derived((thumbnailNavigation.width || 100) * (view === 'book' ? 2 : 1));
  const navWidth = $derived(horizontal ? '100%' : `${preferredWidth * columnsPref}px`);
  const groupingCount = $derived(canvasGroupings.length);
  const focusedGroup = $derived(view === 'book' ? Math.ceil(canvasIndex / 2) : canvasIndex);
  const spacing = 12;
  const scrollbar = 6;
  const fallbackHeight = $derived(thumbnailNavigation.height || 130);
  const bottomHeight = $derived(Math.min(fallbackHeight, (thumbnailNavigation.width || 100) * bottomRows + scrollbar));
  const navHeight = $derived(horizontal ? `${bottomHeight}px` : '100%');
  const bottomCellHeight = $derived(Math.max(1, Math.floor((bottomHeight - scrollbar) / bottomRows)));
  const bottomImageHeight = $derived(
    Math.max(1, bottomCellHeight - spacing - (thumbnailNavigation.showThumbnailLabels === false ? 0 : 20)),
  );
  const rtl = $derived(viewingDirection === 'right-to-left');
  let measuredWidth = $state(0);
  let measuredHeight = $state(0);
  const sideWidth = $derived(measuredWidth ? measuredWidth / columns : preferredWidth);

  function groupSize(group) {
    const aspect = group.reduce(
      (sum, canvas) => sum + (canvas.getWidth?.() ?? canvas.width) / (canvas.getHeight?.() ?? canvas.height),
      0,
    );
    const size = horizontal
      ? Math.min(preferredWidth - spacing, Math.ceil(bottomImageHeight * aspect))
      : Math.ceil(((sideWidth - spacing - scrollbar) * group.length) / aspect);
    if (!Number.isFinite(size) || size <= 0) return horizontal ? preferredWidth : fallbackHeight + spacing;
    return (horizontal ? size : Math.max(size, Math.round(fallbackHeight / 3))) + spacing;
  }

  // The same track offsets drive the CSS grid, overscan spacers and selection scrolling.
  const perTrack = $derived(horizontal ? bottomRows : columns);
  const offsets = $derived.by(() => {
    const result = [0];
    for (let start = 0; start < canvasGroupings.length; start += perTrack) {
      const extent = Math.max(...canvasGroupings.slice(start, start + perTrack).map(groupSize));
      result.push(result.at(-1) + extent);
    }
    return result;
  });

  function trackAt(pixel) {
    let lo = 0;
    let hi = offsets.length - 1;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (offsets[mid + 1] <= pixel) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  const visibleRange = $derived.by(() => {
    const offset = horizontal ? scrollLeft : scrollTop;
    const extent = horizontal ? measuredWidth || preferredWidth * 5 : measuredHeight || fallbackHeight * 5;
    const first = Math.max(0, trackAt(offset) - 4);
    const last = Math.min(offsets.length - 1, trackAt(offset + extent) + 5);
    return {
      start: first * perTrack,
      end: Math.min(last * perTrack, canvasGroupings.length),
      before: offsets[first],
      after: offsets.at(-1) - offsets[last],
    };
  });

  const visibleGroupings = $derived(canvasGroupings.slice(visibleRange.start, visibleRange.end));
  function cellDimensions(index) {
    const track = Math.floor(index / perTrack);
    const extent = offsets[track + 1] - offsets[track];
    return { width: horizontal ? extent : sideWidth, height: horizontal ? bottomCellHeight : extent };
  }

  function handleKeydown(event) {
    const next = horizontal ? 'ArrowRight' : 'ArrowDown';
    const previous = horizontal ? 'ArrowLeft' : 'ArrowUp';
    if (event.key === next && hasNextCanvas) {
      event.preventDefault();
      setNextCanvas();
    } else if (event.key === previous && hasPreviousCanvas) {
      event.preventDefault();
      setPreviousCanvas();
    }
  }

  $effect(() => {
    const current = focusedGroup;
    const track = Math.floor(current / perTrack);
    if (current < 0 || current >= groupingCount) return;
    if (gridElement) {
      // Recomputing track sizes must not pull a manually scrolled strip back to the selection.
      const tracks = untrack(() => offsets);
      const target = tracks[track];
      const end = tracks[track + 1];
      const fromStart = Math.abs(gridElement.scrollLeft);
      if (horizontal && (target < fromStart || end > fromStart + gridElement.clientWidth)) {
        gridElement.scrollLeft = rtl ? -target : target;
        scrollLeft = Math.abs(gridElement.scrollLeft);
      } else if (!horizontal && (target < gridElement.scrollTop || end > gridElement.scrollTop + gridElement.clientHeight)) {
        gridElement.scrollTop = target;
        scrollTop = target;
      }
    }
    const item = viewport?.querySelector(`[data-canvas-group-index="${current}"]`);
    item?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  });
</script>

{#if position !== 'off'}
  <nav
    bind:this={viewport}
    class={['thumbnail-navigation', { bottom: horizontal, side }]}
    aria-label={t('thumbnailNavigation')}
    dir={viewingDirection === 'right-to-left' ? 'rtl' : 'ltr'}
    style:width={navWidth}
    style:height={navHeight}
  >
    {#if side}<h3>{t('contents')}</h3>{/if}
    <div
      bind:this={gridElement}
      bind:clientWidth={measuredWidth}
      bind:clientHeight={measuredHeight}
      class={['canvas-grid', { horizontal }]}
      dir={side ? 'ltr' : undefined}
      role="grid"
      tabindex="0"
      onkeydown={handleKeydown}
      onscroll={(event) => {
        scrollTop = event.currentTarget.scrollTop;
        scrollLeft = Math.abs(event.currentTarget.scrollLeft);
      }}
      aria-rowcount={rows}
      aria-colcount={columns}
      style={`--columns:${columns};--rows:${rows};--cell-width:${preferredWidth}px;--cell-height:${bottomCellHeight}px`}
    >
      {#if visibleRange.start > 0}
        <div
          class={{ 'side-spacer': !horizontal, 'bottom-spacer': horizontal }}
          aria-hidden="true"
          style={horizontal ? `width:${visibleRange.before}px` : `height:${visibleRange.before}px`}
        ></div>
      {/if}
      {#each visibleGroupings as grouping, visibleIndex (grouping[0]?.id || visibleRange.start + visibleIndex)}
        {@const index = visibleRange.start + visibleIndex}
        {@const columnIndex = horizontal ? Math.floor(index / bottomRows) : index % columns}
        {@const rowIndex = horizontal ? index % bottomRows : Math.floor(index / columns)}
        {@const dimensions = cellDimensions(index)}
        <div
          data-canvas-group-index={index}
          style:width={horizontal ? dimensions.width + 'px' : '100%'}
          style:height={dimensions.height + 'px'}
        >
          <Connected
            name="ThumbnailCanvasGrouping"
            component={ThumbnailCanvasGrouping}
            targetProps={{
              canvasGroupings,
              index,
              columnCount: columns,
              bottomRows,
              columnIndex,
              rowIndex,
              position,
              style: dimensions,
              windowId,
            }}
          />
        </div>
      {/each}
      {#if visibleRange.end < canvasGroupings.length}
        <div
          class={{ 'side-spacer': !horizontal, 'bottom-spacer': horizontal }}
          aria-hidden="true"
          style={horizontal ? `width:${visibleRange.after}px` : `height:${visibleRange.after}px`}
        ></div>
      {/if}
    </div>
    <div class="navigation-actions">
      <button type="button" disabled={!hasPreviousCanvas} aria-label={t('previousCanvas')} onclick={setPreviousCanvas}>‹</button>
      <button type="button" disabled={!hasNextCanvas} aria-label={t('nextCanvas')} onclick={setNextCanvas}>›</button>
    </div>
  </nav>
{/if}

<style>
  .thumbnail-navigation {
    box-sizing: border-box;
    display: flex;
    flex: 0 1 auto;
    max-height: 100%;
    max-width: 100%;
    min-height: 0;
    min-width: 0;
    overflow: hidden;
    position: relative;
  }
  .thumbnail-navigation.side {
    flex-direction: column;
    max-width: min(30cqw, 100%);
  }
  h3 {
    flex: 0 0 auto;
    font-size: 0.85rem;
    letter-spacing: 0.08em;
    margin: 0;
    padding: 6px 10px;
    text-transform: uppercase;
  }
  .canvas-grid {
    align-content: start;
    display: grid;
    flex: 1 1 auto;
    grid-auto-flow: row;
    grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
    min-height: 0;
    min-width: 0;
    overflow: auto;
    overscroll-behavior: contain;
  }
  .canvas-grid:not(.horizontal) {
    grid-auto-rows: max-content;
  }
  .canvas-grid.horizontal {
    grid-auto-flow: column;
    grid-template-columns: none;
    grid-template-rows: repeat(var(--rows), minmax(0, 1fr));
    grid-auto-columns: max-content;
    justify-content: start;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .canvas-grid > div {
    box-sizing: border-box;
    min-width: 0;
    overflow: hidden;
  }
  .canvas-grid .side-spacer {
    grid-column: 1 / -1;
    pointer-events: none;
  }
  .canvas-grid .bottom-spacer {
    grid-row: 1 / -1;
    pointer-events: none;
  }
  .navigation-actions {
    display: flex;
    flex: 0 0 auto;
  }
  .navigation-actions button {
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    font-size: 1.25rem;
    min-height: 32px;
    min-width: 32px;
  }
  .navigation-actions button:disabled {
    opacity: 0.4;
  }
</style>

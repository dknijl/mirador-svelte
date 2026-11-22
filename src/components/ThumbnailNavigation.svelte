<script>
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
  const navHeight = $derived(horizontal ? `${thumbnailNavigation.height || 130}px` : '100%');
  const focusedGroup = $derived(view === 'book' ? Math.ceil(canvasIndex / 2) : canvasIndex);
  const sideCellHeight = $derived(Math.max(80, preferredWidth * 1.25));
  const bottomCellHeight = $derived(Math.max(1, Math.floor((thumbnailNavigation.height || 130) / bottomRows)));
  const visibleRange = $derived.by(() => {
    const overscan = 4;
    if (horizontal) {
      const width = gridElement?.clientWidth || preferredWidth * 5;
      let column = 0;
      let offset = 0;
      while (column < columns && offset + columnWidth(column) <= scrollLeft) {
        offset += columnWidth(column);
        column += 1;
      }
      const first = Math.max(0, column - overscan);
      while (column < columns && offset < scrollLeft + width) {
        offset += columnWidth(column);
        column += 1;
      }
      const last = Math.min(columns, column + overscan);
      return { start: first * bottomRows, end: Math.min(canvasGroupings.length, last * bottomRows) };
    }
    const height = gridElement?.clientHeight || sideCellHeight * 5;
    const first = Math.max(0, Math.floor(scrollTop / sideCellHeight) - overscan);
    const last = Math.min(rows, Math.ceil((scrollTop + height) / sideCellHeight) + overscan);
    return { start: first * columns, end: Math.min(canvasGroupings.length, last * columns) };
  });
  const visibleGroupings = $derived(canvasGroupings.slice(visibleRange.start, visibleRange.end));

  function groupingAspect(group) {
    if (!group?.length) return 1;
    return group.reduce((total, canvas) => {
      const width = canvas.getWidth?.() || canvas.width || 1;
      const height = canvas.getHeight?.() || canvas.height || 1;
      return total + (width > 0 && height > 0 ? width / height : 1);
    }, 0);
  }

  function columnWidth(column) {
    const first = column * bottomRows;
    const last = Math.min(first + bottomRows, canvasGroupings.length);
    let width = preferredWidth + 12;
    for (let index = first; index < last; index += 1) {
      width = Math.max(width, Math.ceil(bottomCellHeight * groupingAspect(canvasGroupings[index])) + 12);
    }
    return width;
  }

  function columnOffset(column) {
    let offset = 0;
    for (let index = 0; index < column; index += 1) offset += columnWidth(index);
    return offset;
  }

  function columnsWidth(first, last) {
    let width = 0;
    for (let index = first; index < last; index += 1) width += columnWidth(index);
    return width;
  }

  function cellStyle(index) {
    if (horizontal) {
      const width = columnWidth(Math.floor(index / bottomRows));
      return `width:${width}px;height:${bottomCellHeight}px`;
    }
    return `width:100%;height:${sideCellHeight}px`;
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
    if (current < 0 || current >= canvasGroupings.length) return;
    if (horizontal && gridElement) {
      const column = Math.floor(current / bottomRows);
      const target = columnOffset(column);
      if (target < gridElement.scrollLeft || target + columnWidth(column) > gridElement.scrollLeft + gridElement.clientWidth) {
        gridElement.scrollLeft = target;
        scrollLeft = target;
      }
    } else if (gridElement) {
      const target = Math.floor(current / columns) * sideCellHeight;
      if (target < gridElement.scrollTop || target + sideCellHeight > gridElement.scrollTop + gridElement.clientHeight) {
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
      class={['canvas-grid', { horizontal }]}
      role="grid"
      tabindex="0"
      onkeydown={handleKeydown}
      onscroll={(event) => {
        scrollTop = event.currentTarget.scrollTop;
        scrollLeft = event.currentTarget.scrollLeft;
      }}
      aria-rowcount={rows}
      aria-colcount={columns}
      style={`--columns:${columns};--rows:${rows};--cell-width:${preferredWidth}px;--cell-height:${horizontal ? bottomCellHeight : sideCellHeight}px`}
    >
      {#if visibleRange.start > 0}
        <div
          class={{ 'side-spacer': !horizontal, 'bottom-spacer': horizontal }}
          style:grid-row={!horizontal ? `span ${Math.floor(visibleRange.start / columns)}` : undefined}
          style:grid-column={horizontal ? `span ${Math.floor(visibleRange.start / bottomRows)}` : undefined}
          aria-hidden="true"
          style={horizontal
            ? `width:${columnsWidth(0, Math.floor(visibleRange.start / bottomRows))}px`
            : `height:${Math.floor(visibleRange.start / columns) * sideCellHeight}px`}
        ></div>
      {/if}
      {#each visibleGroupings as grouping, visibleIndex (grouping[0]?.id || visibleRange.start + visibleIndex)}
        {@const index = visibleRange.start + visibleIndex}
        {@const columnIndex = horizontal ? Math.floor(index / bottomRows) : index % columns}
        {@const rowIndex = horizontal ? index % bottomRows : Math.floor(index / columns)}
        <div data-canvas-group-index={index} style={cellStyle(index)}>
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
              style: { width: preferredWidth, height: horizontal ? bottomCellHeight : sideCellHeight },
              windowId,
            }}
          />
        </div>
      {/each}
      {#if visibleRange.end < canvasGroupings.length}
        <div
          class={{ 'side-spacer': !horizontal, 'bottom-spacer': horizontal }}
          style:grid-row={!horizontal ? `span ${rows - Math.ceil(visibleRange.end / columns)}` : undefined}
          style:grid-column={horizontal ? `span ${columns - Math.ceil(visibleRange.end / bottomRows)}` : undefined}
          aria-hidden="true"
          style={horizontal
            ? `width:${columnsWidth(Math.ceil(visibleRange.end / bottomRows), columns)}px`
            : `height:${(rows - Math.ceil(visibleRange.end / columns)) * sideCellHeight}px`}
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
    grid-auto-rows: var(--cell-height);
  }
  .canvas-grid.horizontal {
    grid-auto-flow: column;
    grid-template-columns: none;
    grid-template-rows: repeat(var(--rows), minmax(0, 1fr));
    grid-auto-columns: max-content;
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

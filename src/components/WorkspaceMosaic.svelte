<script>
  import { flushSync } from 'svelte';
  import Connected from '../svelte/Connected.svelte';
  import MosaicRenderPreview from './MosaicRenderPreview.svelte';
  import isEqual from 'lodash/isEqual';
  import { dockWindow, mosaicGeometry, reconcileLayout, replaceAt, resizeDivider } from '../lib/MosaicLayout';

  let { layout = null, windowIds = [], updateWorkspaceMosaicLayout, tile, getWindowLabel = (id) => id } = $props();
  let root;
  let preview = $state();
  let dragging = $state(null);
  let resizing;
  const tree = $derived(reconcileLayout(layout, windowIds));
  const geometry = $derived(mosaicGeometry(tree));
  $effect(() => {
    if (!isEqual(layout, tree)) updateWorkspaceMosaicLayout(tree);
  });

  function startDrag(event) {
    const handle = event.target.closest('[data-mosaic-handle]');
    const host = handle?.closest('[data-window-id]');
    if (!host) return;
    dragging = host.dataset.windowId;
    event.dataTransfer?.setData('text/plain', dragging);
    if (event.dataTransfer?.setDragImage) {
      flushSync();
      event.dataTransfer.setDragImage(preview, 12, 12);
    }
  }

  function drop(event, target, side) {
    event.preventDefault();
    if (dragging !== null) updateWorkspaceMosaicLayout(dockWindow(tree, dragging, target, side));
    dragging = null;
  }

  function startResize(event, divider) {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    resizing = { start: divider.horizontal ? event.clientX : event.clientY, divider, tree };
  }

  function moveResize(event) {
    if (!resizing) return;
    const { start, divider, tree: original } = resizing;
    const rect = root.getBoundingClientRect();
    const length = divider.horizontal ? (rect.width * divider.box.width) / 100 : (rect.height * divider.box.height) / 100;
    const offset = (divider.horizontal ? event.clientX : event.clientY) - start;
    if (length > 0) updateWorkspaceMosaicLayout(resizeDivider(original, divider, (offset / length) * 100));
  }

  function keyResize(event, divider) {
    const keys = divider.horizontal ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    updateWorkspaceMosaicLayout(resizeDivider(tree, divider, event.key === keys[0] ? -2 : 2));
  }
</script>

{#snippet targets(target)}
  <div class="drop-target-container" class:active={dragging !== null}>
    {#each ['top', 'bottom', 'left', 'right'] as side (side)}
      <div
        role="presentation"
        class={'drop-target ' + side}
        ondragover={(event) => event.preventDefault()}
        ondrop={(event) => drop(event, target, side)}
      ></div>
    {/each}
  </div>
{/snippet}

<div class="mirador-mosaic" role="group" bind:this={root} ondragstart={startDrag} ondragend={() => (dragging = null)}>
  {#each geometry.tiles as box (box.id)}
    <div
      class="mosaic-tile"
      data-window-id={box.id}
      hidden={box.hidden}
      style:left={box.x + '%'}
      style:top={box.y + '%'}
      style:right={100 - box.x - box.width + '%'}
      style:bottom={100 - box.y - box.height + '%'}
    >
      <div class="mosaic-window" class:tabbed={box.tabbed}>{@render tile?.(box.id)}</div>
      {@render targets(box.id)}
    </div>
  {/each}
  {#each geometry.tabs as group (group.path.join('.'))}
    <div class="tab-strip" style:left={group.x + '%'} style:top={group.y + '%'} style:width={group.width + '%'}>
      {#each group.node.tabs as id, i (id)}
        <button
          aria-pressed={i === group.node.activeTabIndex}
          onclick={() => updateWorkspaceMosaicLayout(replaceAt(tree, group.path, { ...group.node, activeTabIndex: i }))}
        >
          {getWindowLabel(id)}
        </button>
      {/each}
    </div>
  {/each}
  {#each geometry.dividers as divider (divider.path.join('.') + '/' + divider.index)}
    <button
      class="divider"
      class:vertical={divider.horizontal}
      aria-label={divider.horizontal ? 'Resize window widths' : 'Resize window heights'}
      style:left={(divider.horizontal ? divider.position : divider.box.x) + '%'}
      style:top={(divider.horizontal ? divider.box.y : divider.position) + '%'}
      style:width={divider.horizontal ? '8px' : divider.box.width + '%'}
      style:height={divider.horizontal ? divider.box.height + '%' : '8px'}
      onpointerdown={(event) => startResize(event, divider)}
      onpointermove={moveResize}
      onlostpointercapture={() => (resizing = null)}
      onkeydown={(event) => keyResize(event, divider)}
    ></button>
  {/each}
  {#if dragging !== null}
    <div class="drag-preview" bind:this={preview} inert aria-hidden="true">
      <Connected name="MosaicRenderPreview" component={MosaicRenderPreview} targetProps={{ windowId: dragging }} />
    </div>
  {/if}
  {@render targets(null)}
</div>

<style>
  .mirador-mosaic,
  .mosaic-window,
  .mosaic-tile,
  .drop-target-container {
    position: absolute;
    inset: 0;
  }
  .drag-preview {
    position: absolute;
    left: -10000px;
    width: 220px;
    height: 60px;
    pointer-events: none;
  }
  .mosaic-window {
    overflow: hidden;
  }
  .tabbed {
    top: 2rem;
  }
  .tab-strip {
    position: absolute;
    display: flex;
    overflow: auto;
    height: 2rem;
  }
  .divider {
    position: absolute;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: row-resize;
    transform: translateY(-50%);
    touch-action: none;
  }
  .divider.vertical {
    cursor: col-resize;
    transform: translateX(-50%);
  }
  .divider:focus-visible {
    outline: 2px solid currentColor;
  }
  .drop-target-container {
    pointer-events: none;
  }
  .active .drop-target {
    position: absolute;
    pointer-events: auto;
  }
  .drop-target:hover {
    background: #1976d244;
  }
  .top,
  .bottom {
    left: 0;
    right: 0;
    height: 25%;
  }
  .left,
  .right {
    top: 25%;
    bottom: 25%;
    width: 35%;
  }
  .top {
    top: 0;
  }
  .bottom {
    bottom: 0;
  }
  .left {
    left: 0;
  }
  .right {
    right: 0;
  }
  .mirador-mosaic > .active > :is(.left, .right) {
    width: 3%;
  }
  .mirador-mosaic > .active > :is(.top, .bottom) {
    height: 3%;
  }
</style>

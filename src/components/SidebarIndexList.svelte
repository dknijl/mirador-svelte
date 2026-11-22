<script>
  import Connected from '../svelte/Connected.svelte';
  import SidebarIndexThumbnail from './SidebarIndexThumbnail.svelte';
  import SidebarIndexItem from './SidebarIndexItem.svelte';
  import ScrollTo from './ScrollTo.svelte';
  import MiradorCanvas from '../lib/MiradorCanvas';
  let { canvases = [], selectedCanvasIds = [], setCanvas = () => {}, variant = 'item', windowId, t = (key) => key } = $props();

  function navigate(event, index) {
    const buttons = event.currentTarget.closest('ul').querySelectorAll('button');
    const columns = variant === 'thumbnail' ? 2 : 1;
    const rtl = event.currentTarget.closest('[dir]')?.dir === 'rtl';
    let next = index;
    switch (event.key) {
      case 'ArrowDown':
        next += columns;
        break;
      case 'ArrowUp':
        next -= columns;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = buttons.length - 1;
        break;
      case 'ArrowLeft':
      case 'ArrowRight': {
        const offset = (event.key === 'ArrowRight') !== rtl ? 1 : -1;
        if (Math.floor((index + offset) / columns) === Math.floor(index / columns)) next += offset;
        break;
      }
      default:
        return;
    }
    event.preventDefault();
    buttons[next]?.focus();
  }
  function label(canvas) {
    return new MiradorCanvas(canvas).getLabel() || t('noTitle');
  }
</script>

<ul
  class="canvas-list"
  class:thumbnails={variant === 'thumbnail'}
  role={variant === 'thumbnail' ? 'listbox' : 'menu'}
  aria-label={t('canvases')}
>
  {#each canvases as canvas, index (canvas.id)}
    {@const selected = selectedCanvasIds.includes(canvas.id)}
    <li>
      <ScrollTo scrollTo={selected}>
        <button
          type="button"
          role={variant === 'thumbnail' ? 'option' : 'menuitem'}
          aria-selected={variant === 'thumbnail' ? selected : undefined}
          onkeydown={(event) => navigate(event, index)}
          aria-current={selected ? 'true' : undefined}
          onclick={() => setCanvas(windowId, canvas.id)}
        >
          {#if variant === 'thumbnail'}
            <Connected
              name="SidebarIndexThumbnail"
              component={SidebarIndexThumbnail}
              targetProps={{ canvas, label: label(canvas) }}
            />
          {:else}
            <Connected name="SidebarIndexItem" component={SidebarIndexItem} targetProps={{ label: label(canvas) }} />
          {/if}
        </button>
      </ScrollTo>
    </li>
  {/each}
</ul>

<style>
  .canvas-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .canvas-list.thumbnails {
    box-sizing: border-box;
    column-gap: 8px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 8px;
    row-gap: 8px;
  }
  li {
    border-bottom: 1px solid color-mix(in srgb, currentColor 15%, transparent);
  }
  button {
    align-items: flex-start;
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    display: flex;
    gap: 8px;
    min-height: 44px;
    padding: 8px 16px;
    text-align: start;
    width: 100%;
  }
  button[aria-current='true'] {
    background: color-mix(in srgb, currentColor 10%, transparent);
    outline: 2px solid currentcolor;
  }
  .thumbnails button {
    align-items: center;
    aspect-ratio: 1;
    background: color-mix(in srgb, currentColor 5%, transparent);
    border-radius: 4px;
    display: grid;
    justify-items: center;
    text-align: center;
  }
</style>

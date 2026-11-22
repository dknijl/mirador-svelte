<script>
  let {
    ariaLabel,
    children,
    direction = 'ltr',
    isDisplayed = false,
    onCloseClick = () => {},
    position = null,
    paperClassName = '',
    title = '',
    titleControls,
    updateCompanionWindow,
    defaultSidebarPanelWidth = 235,
    defaultSidebarPanelHeight = 201,
    t = (key) => key,
  } = $props();
  let root = $state();
  let width = $derived(defaultSidebarPanelWidth);
  let height = $derived(defaultSidebarPanelHeight);
  let drag = $state(null);
  const isBottom = $derived(position === 'bottom' || position === 'far-bottom');

  function startResize(event) {
    event.preventDefault();
    const bounds = root.getBoundingClientRect();
    drag = { x: event.clientX, y: event.clientY, width: bounds.width, height: bounds.height };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }
  function resize(event) {
    if (!drag) return;
    if (isBottom) height = Math.max(50, drag.height + drag.y - event.clientY);
    else
      width = Math.max(position === 'left' ? 235 : 100, drag.width + (direction === 'rtl' ? 1 : -1) * (event.clientX - drag.x));
  }
</script>

{#if isDisplayed}
  <aside
    bind:this={root}
    class={`companion-window ${paperClassName}`}
    class:mirador-companion-window-left={position === 'left'}
    class:mirador-companion-window-right={position === 'right'}
    class:mirador-companion-window-bottom={position === 'bottom'}
    class:mirador-companion-window-far-right={position === 'far-right'}
    class:mirador-companion-window-far-bottom={position === 'far-bottom'}
    class:left={position === 'left'}
    class:bottom={isBottom}
    class:rtl={direction === 'rtl'}
    style:width={isBottom ? '100%' : `${width}px`}
    style:height={isBottom ? `${height}px` : '100%'}
    role="region"
    aria-label={ariaLabel || title}
  >
    <header class="companion-window-header">
      <h3>{title}</h3>
      <div class="title-controls">{@render titleControls?.()}</div>
      {#if updateCompanionWindow && position === 'left'}
        <button
          type="button"
          aria-label={t('openInCompanionWindow')}
          onclick={() => updateCompanionWindow({ position: 'right' })}
        >
          ↗
        </button>
      {:else}
        {#if updateCompanionWindow}
          <button
            type="button"
            aria-label={isBottom ? t('moveCompanionWindowToRight') : t('moveCompanionWindowToBottom')}
            onclick={() => updateCompanionWindow({ position: isBottom ? 'right' : 'bottom' })}
          >
            ↗
          </button>
        {/if}
        <button type="button" aria-label={t('closeCompanionWindow')} onclick={onCloseClick}>×</button>
      {/if}
    </header>
    <div class="companion-window-content">{@render children?.()}</div>
    <button
      class="resize-handle"
      type="button"
      aria-label={t('resizePanel', 'Resize panel')}
      onpointerdown={startResize}
      onpointermove={resize}
      onkeydown={(event) => {
        const keys = isBottom
          ? ['ArrowDown', 'ArrowUp']
          : direction === 'rtl'
            ? ['ArrowLeft', 'ArrowRight']
            : ['ArrowRight', 'ArrowLeft'];
        if (!keys.includes(event.key)) return;
        event.preventDefault();
        const delta = keys.indexOf(event.key) ? 10 : -10;
        if (isBottom) height = Math.max(50, height + delta);
        else width = Math.max(position === 'left' ? 235 : 100, width + delta);
      }}
      onpointerup={() => (drag = null)}
      onlostpointercapture={() => (drag = null)}
    ></button>
  </aside>
{/if}

<style>
  .companion-window {
    background: Canvas;
    color: CanvasText;
    display: flex;
    flex-direction: column;
    min-width: 100px;
    min-height: 50px;
    overflow: hidden;
    position: relative;
  }
  .companion-window.left {
    order: -1;
  }
  .companion-window-header {
    align-items: center;
    display: flex;
    flex: none;
    gap: 4px;
    min-height: 40px;
    padding: 0 8px;
  }
  h3 {
    flex: 1;
    font-size: 0.85rem;
    letter-spacing: 0.08em;
    margin: 0;
    text-transform: uppercase;
  }
  .title-controls {
    display: flex;
  }
  .companion-window-header button {
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    font: inherit;
    min-width: 32px;
    min-height: 32px;
  }
  .companion-window-content {
    flex: 1;
    min-height: 0;
    overflow: auto;
  }
  .resize-handle {
    position: absolute;
    inset-inline-start: 0;
    inset-block-start: 0;
    width: 8px;
    height: 100%;
    cursor: ew-resize;
    opacity: 0;
    touch-action: none;
  }
  .companion-window.bottom .resize-handle {
    height: 8px;
    width: 100%;
    cursor: ns-resize;
  }
  .resize-handle:focus-visible {
    opacity: 1;
  }
</style>

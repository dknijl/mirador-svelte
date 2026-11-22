<script>
  let {
    handleClose = () => {},
    windowIds = [],
    focusWindow = () => {},
    focusedWindowId = null,
    titles = {},
    t = (key) => key,
  } = $props();
  let focusedItem = $state();
  $effect(() => {
    focusedItem?.focus();
  });
</script>

<div class="backdrop" onclick={handleClose} role="presentation"></div>
<div class="menu" role="menu" aria-label={t('openWindows')}>
  <h2 role="presentation">{t('openWindows')}</h2>
  {#each windowIds as windowId (windowId)}
    <button
      {@attach (element) => {
        if (windowId === focusedWindowId) {
          focusedItem = element;
          return () => (focusedItem = undefined);
        }
      }}
      role="menuitem"
      aria-current={windowId === focusedWindowId ? 'true' : undefined}
      onclick={() => {
        focusWindow(windowId, true);
        handleClose();
      }}
    >
      {titles[windowId] || t('untitled')}
    </button>
  {/each}
</div>

<style>
  .backdrop {
    inset: 0;
    position: fixed;
    z-index: 1299;
  }
  .menu {
    background: Canvas;
    box-shadow: 0 4px 16px #0004;
    display: flex;
    flex-direction: column;
    max-height: min(70vh, 30rem);
    min-width: 15rem;
    overflow: auto;
    padding: 0.5rem;
    position: fixed;
    right: 0.5rem;
    top: 0.5rem;
    z-index: 1300;
  }
  h2 {
    font-size: 0.9rem;
    margin: 0.5rem;
  }
  button {
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    font: inherit;
    padding: 0.65rem;
    text-align: start;
  }
  button:hover,
  button:focus-visible,
  button[aria-current='true'] {
    background: color-mix(in srgb, CanvasText 10%, Canvas);
  }
</style>

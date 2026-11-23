<script>
  import AnchoredWorkspaceMenu from './AnchoredWorkspaceMenu.svelte';
  let {
    anchorEl,
    id,
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

<AnchoredWorkspaceMenu {anchorEl} {id} label={t('openWindows')} {handleClose}>
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
</AnchoredWorkspaceMenu>

<style>
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

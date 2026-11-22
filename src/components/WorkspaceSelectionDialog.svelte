<script>
  let {
    open = false,
    handleClose = () => {},
    updateWorkspace = () => {},
    workspaceType = 'mosaic',
    children,
    t = (key) => key,
  } = $props();
  let dialogElement = $state();
  $effect(() => {
    if (open) dialogElement?.querySelector('[aria-pressed="true"]')?.focus();
  });
  function select(type) {
    updateWorkspace({ type });
    handleClose();
  }
</script>

{#if open}
  <dialog bind:this={dialogElement} open aria-labelledby="workspace-selection-title">
    <h2 id="workspace-selection-title">{t('workspaceSelectionTitle')}</h2>
    {@render children?.()}
    <button
      aria-pressed={workspaceType === 'elastic'}
      class:selected={workspaceType === 'elastic'}
      onclick={() => select('elastic')}
    >
      <svg viewBox="0 0 120 90" aria-hidden="true">
        <rect x="4" y="4" width="50" height="35" /><rect x="65" y="4" width="50" height="35" /><rect
          x="4"
          y="50"
          width="50"
          height="35"
        /><rect x="65" y="50" width="50" height="35" />
      </svg>
      <span><strong>{t('elastic')}</strong><small>{t('elasticDescription')}</small></span>
    </button>
    <button
      aria-pressed={workspaceType === 'mosaic'}
      class:selected={workspaceType === 'mosaic'}
      onclick={() => select('mosaic')}
    >
      <svg viewBox="0 0 120 90" aria-hidden="true">
        <rect x="4" y="4" width="50" height="82" /><rect x="65" y="4" width="50" height="35" /><rect
          x="65"
          y="50"
          width="50"
          height="36"
        />
      </svg>
      <span><strong>{t('mosaic')}</strong><small>{t('mosaicDescription')}</small></span>
    </button>
    <button type="button" onclick={handleClose}>{t('cancel')}</button>
  </dialog>
{/if}

<style>
  dialog {
    background: Canvas;
    border: 0;
    box-shadow: 0 8px 32px #0005;
    color: CanvasText;
    max-height: 85vh;
    max-width: min(40rem, calc(100vw - 2rem));
    overflow: auto;
    padding: 1.25rem;
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1400;
  }
  h2 {
    margin-top: 0;
  }
  dialog > button:not(:last-child) {
    align-items: center;
    background: transparent;
    border: 2px solid transparent;
    color: inherit;
    cursor: pointer;
    display: flex;
    gap: 1rem;
    margin: 0.5rem 0;
    padding: 0.75rem;
    text-align: left;
    width: 100%;
  }
  dialog > button.selected {
    border-color: var(--mirador-primary, #1976d2);
  }
  svg {
    flex: 0 0 120px;
    fill: none;
    stroke: currentColor;
    stroke-width: 4;
  }
  span {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
</style>

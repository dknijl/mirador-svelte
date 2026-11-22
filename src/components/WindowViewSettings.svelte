<script>
  let { handleClose = () => {}, windowViewType, viewTypes = [], setWindowViewType, windowId, t = (key) => key } = $props();
  const labels = { single: '▣', gallery: '▦', scroll: '▥', book: '▤' };
</script>

{#if viewTypes.length}
  <h3 role="presentation">{t('view')}</h3>
  <div class="option-row" role="menubar">
    {#each viewTypes as value (value)}
      <button
        type="button"
        role="menuitemradio"
        aria-checked={windowViewType === value}
        aria-label={t(value)}
        class:selected={windowViewType === value}
        onclick={() => {
          setWindowViewType(windowId, value);
          handleClose();
        }}
      >
        <span aria-hidden="true">{labels[value] || '▣'}</span><span>{t(value)}</span>
      </button>
    {/each}
  </div>
{/if}

<style>
  h3 {
    font-size: 0.875rem;
    font-weight: 500;
    margin: 8px 12px 4px;
  }
  .option-row {
    display: flex;
    gap: 4px;
    padding: 4px;
  }
  button {
    align-items: center;
    background: transparent;
    border: 0;
    border-bottom: 2px solid transparent;
    color: inherit;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 62px;
    padding: 6px;
  }
  button.selected {
    border-bottom-color: var(--mirador-secondary, #9c27b0);
    color: var(--mirador-secondary, #9c27b0);
  }
</style>

<script>
  let {
    handleClose = () => {},
    thumbnailNavigationPosition = 'off',
    thumbnailColumns = null,
    updateWindow = () => {},
    direction = 'ltr',
    windowId,
    setWindowThumbnailPosition = () => {},
    t = (key, options = {}) =>
      key === 'thumbnailRows' ? `${options.count} rows` : key === 'thumbnailColumns' ? `${options.count} columns` : key,
  } = $props();

  const positions = [
    ['off', 'off', '□'],
    ['far-bottom', 'bottom', '▁'],
    ['far-left', 'left', '▏'],
    ['far-right', 'right', '▕'],
  ];
</script>

<h3 role="presentation">{t('thumbnails')}</h3>
<div class="option-row" role="menubar">
  {#each positions as [value, label, icon] (value)}
    <button
      type="button"
      role="menuitemradio"
      aria-checked={thumbnailNavigationPosition === value}
      aria-label={t(label)}
      class:selected={thumbnailNavigationPosition === value}
      onclick={() => {
        setWindowThumbnailPosition(windowId, value);
        handleClose();
      }}
    >
      <span aria-hidden="true" class:rtl={direction === 'rtl' && (value === 'far-left' || value === 'far-right')}>
        {icon}
      </span><span>{t(label)}</span>
    </button>
  {/each}
</div>
{#if thumbnailNavigationPosition !== 'off'}
  <div class="layout-row" role="menubar" aria-label={t('thumbnailLayout')}>
    {#each [null, 1, 2] as count (count ?? 'auto')}
      <button
        type="button"
        role="menuitemradio"
        aria-checked={count === thumbnailColumns}
        onclick={() => {
          updateWindow(windowId, { thumbnailColumns: count });
          handleClose();
        }}
      >
        {count === null
          ? t('thumbnailAuto')
          : t(thumbnailNavigationPosition === 'far-bottom' ? 'thumbnailRows' : 'thumbnailColumns', { count })}
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
  button.selected,
  button[aria-checked='true'] {
    border-bottom-color: var(--mirador-secondary, #9c27b0);
    color: var(--mirador-secondary, #9c27b0);
  }
  .layout-row {
    display: flex;
    gap: 4px;
  }
  .layout-row button {
    flex: 1;
  }
  .rtl {
    transform: rotate(180deg);
  }
</style>

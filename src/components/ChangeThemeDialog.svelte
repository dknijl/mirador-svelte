<script>
  let {
    open = false,
    handleClose = () => {},
    setSelectedTheme = () => {},
    selectedTheme = 'light',
    themeIds = [],
    t = (key) => key,
  } = $props();
  let dialogElement = $state();
  $effect(() => {
    if (open) dialogElement?.querySelector('[aria-pressed="true"]')?.focus();
  });
</script>

{#if open}
  <dialog bind:this={dialogElement} open aria-labelledby="theme-dialog-title">
    <h2 id="theme-dialog-title">{t('changeTheme')}</h2>
    <div class="themes">
      {#each themeIds as themeId (themeId)}
        <button
          aria-pressed={themeId === selectedTheme}
          onclick={() => {
            setSelectedTheme(themeId);
            handleClose();
          }}
        >
          {t(themeId)}
        </button>
      {/each}
    </div>
    <button onclick={handleClose}>{t('cancel')}</button>
  </dialog>
{/if}

<style>
  dialog {
    background: Canvas;
    border: 0;
    box-shadow: 0 8px 32px #0005;
    color: CanvasText;
    left: 50%;
    padding: 1.25rem;
    position: fixed;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1400;
  }
  .themes {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  button {
    font: inherit;
    padding: 0.5rem 0.75rem;
  }
</style>

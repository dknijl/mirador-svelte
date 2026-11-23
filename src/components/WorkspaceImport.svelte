<script>
  let { open = false, handleClose = () => {}, importConfig = () => {}, addError = () => {}, t = (key) => key } = $props();
  let configImportValue = $state('');
  let textarea = $state();
  $effect(() => {
    if (open) textarea?.focus();
  });
  function importWorkspace() {
    try {
      importConfig(JSON.parse(configImportValue));
      handleClose();
      configImportValue = '';
    } catch (error) {
      addError(error.toString());
    }
  }
</script>

{#if open}
  <dialog open aria-labelledby="workspace-import-title">
    <h2 id="workspace-import-title">{t('importWorkspace')}</h2>
    <p id="workspace-import-hint">{t('importWorkspaceHint')}</p>
    <textarea bind:this={textarea} bind:value={configImportValue} aria-describedby="workspace-import-hint"></textarea>
    <footer><button onclick={handleClose}>{t('cancel')}</button><button onclick={importWorkspace}>{t('import')}</button></footer>
  </dialog>
{/if}

<style>
  dialog {
    background: Canvas;
    border: 0;
    box-shadow: 0 8px 32px #0005;
    color: CanvasText;
    left: 50%;
    max-width: min(600px, calc(100vw - 2rem));
    padding: 1.25rem;
    position: fixed;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    z-index: 1400;
  }
  textarea {
    box-sizing: border-box;
    font: 1rem/1.4 monospace;
    min-height: 18rem;
    width: 100%;
  }
  footer {
    display: flex;
    gap: 0.5rem;
    justify-content: end;
    margin-top: 1rem;
  }
  button {
    font: inherit;
    padding: 0.5rem 0.75rem;
  }
</style>

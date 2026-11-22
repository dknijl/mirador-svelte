<script>
  import copy from 'copy-to-clipboard';
  let { open = false, handleClose = () => {}, exportableState = {}, t = (key) => key } = $props();
  let copied = $state(false);
  const exportedState = $derived(JSON.stringify(exportableState, null, 2));
  async function copyExport() {
    copy(exportedState);
    copied = true;
  }
</script>

{#if copied}
  <div class="notice" role="alert">{t('exportCopied')} <button aria-label={t('dismiss')} onclick={handleClose}>×</button></div>
{:else if open}
  <dialog open aria-labelledby="workspace-export-title">
    <h2 id="workspace-export-title">{t('downloadExport')}</h2>
    <details aria-label={t('viewWorkspaceConfiguration')} role="region">
      <summary>{t('viewWorkspaceConfiguration')}</summary>
      <pre>{exportedState}</pre>
    </details>
    <footer><button onclick={handleClose}>{t('cancel')}</button><button onclick={copyExport}>{t('copy')}</button></footer>
  </dialog>
{/if}

<style>
  dialog {
    background: Canvas;
    border: 0;
    box-shadow: 0 8px 32px #0005;
    color: CanvasText;
    left: 50%;
    max-height: 85vh;
    max-width: min(40rem, calc(100vw - 2rem));
    overflow: auto;
    padding: 1.25rem;
    position: fixed;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    z-index: 1400;
  }
  pre {
    max-height: 50vh;
    overflow: auto;
    white-space: pre-wrap;
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
  .notice {
    background: CanvasText;
    color: Canvas;
    padding: 0.75rem;
    position: fixed;
    left: 50%;
    top: 1rem;
    transform: translateX(-50%);
    z-index: 1500;
  }
</style>

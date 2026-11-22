<script>
  let { error = null, removeError = () => {}, t = (key) => key } = $props();
  function close() {
    if (error) removeError(error.id);
  }
</script>

{#if error}
  <dialog id="error-dialog" open aria-labelledby="error-dialog-title">
    <h2 id="error-dialog-title">{t('errorDialogTitle')}</h2>
    <p>{String(error.message)}</p>
    <button onclick={close}>{t('errorDialogConfirm')}</button>
  </dialog>
{/if}

<style>
  dialog {
    background: Canvas;
    border: 1px solid #b00020;
    box-shadow: 0 8px 32px #0005;
    color: CanvasText;
    left: 50%;
    max-width: min(34rem, calc(100vw - 2rem));
    padding: 1.25rem;
    position: fixed;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    z-index: 1500;
  }
  p {
    overflow-wrap: anywhere;
  }
  button {
    font: inherit;
    padding: 0.5rem 0.75rem;
  }
</style>

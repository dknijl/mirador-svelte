<script>
  let { addResourcesOpen = false, addResource = () => {}, onSubmit = () => {}, onCancel = null, t = (key) => key } = $props();
  let formValue = $state('');

  function cancel() {
    onCancel?.();
    formValue = '';
  }

  function submit(event) {
    event.preventDefault();
    addResource(formValue);
    onSubmit();
    formValue = '';
  }
</script>

{#if addResourcesOpen}
  <form onsubmit={submit}>
    <label for="manifestURL">{t('addManifestUrl')}</label>
    <input id="manifestURL" type="text" bind:value={formValue} required aria-describedby="manifest-help" />
    <small id="manifest-help">{t('addManifestUrlHelp')}</small>
    {#if onCancel}<button type="button" onclick={cancel}>{t('cancel')}</button>{/if}
    <button id="fetchBtn" type="submit">{t('fetchManifest')}</button>
  </form>
{/if}

<style>
  form {
    align-items: end;
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    padding: 1rem;
  }
  label {
    flex-basis: 100%;
    font-weight: 600;
  }
  input {
    flex: 1 1 16rem;
    font: inherit;
    min-height: 2.5rem;
  }
  small {
    flex-basis: 100%;
  }
  button {
    font: inherit;
    padding: 0.45rem 0.85rem;
  }
</style>

<script>
  import PluginTarget from '../extend/PluginTarget.svelte';
  let { error, metadata = null, showJsError = true, plugins = [], store, t = (key) => key, ...rest } = $props();
</script>

{#if showJsError}
  <section class="error-content" role="alert">
    <strong>{t('errorDialogTitle')}</strong>
    <details>
      <summary>{t('jsError', { message: error?.message, name: error?.name })}</summary>
      <pre>{t('jsStack', { stack: error?.stack })}</pre>
      {#if metadata}<pre>{JSON.stringify(metadata, null, 2)}</pre>{/if}
    </details>
    <PluginTarget mode="add" name="ErrorContent" {plugins} {store} targetProps={{ error, metadata, showJsError, t, ...rest }} />
  </section>
{/if}

<style>
  .error-content {
    background: #b00020;
    color: white;
    padding: 1rem;
  }
  details {
    margin-top: 0.5rem;
  }
  summary {
    cursor: pointer;
  }
  pre {
    max-height: 16rem;
    overflow: auto;
    white-space: pre-wrap;
  }
</style>

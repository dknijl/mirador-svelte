<script>
  import MinimalWindow from './MinimalWindow.svelte';
  let { title = '', windowId, t } = $props();
</script>

<MinimalWindow windowId={windowId + '-preview'} label={t('previewWindowTitle', { title })} ariaLabel={false} {t} />

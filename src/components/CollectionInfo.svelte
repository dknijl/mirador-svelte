<script>
  import CollapsibleSection from './CollapsibleSection.svelte';
  let {
    collectionLabel = null,
    collectionPath = [],
    showCollectionDialog = () => {},
    windowId = null,
    t = (key) => key,
  } = $props();
  const id = $props.id();
  function showCollection() {
    const manifestId = collectionPath[collectionPath.length - 1];
    showCollectionDialog(manifestId, collectionPath.slice(0, -1), windowId);
  }
</script>

{#if collectionPath.length > 0}
  <CollapsibleSection {id} label={t('collection')} {t}>
    {#if collectionLabel}<h4>{collectionLabel}</h4>{/if}
    <button type="button" onclick={showCollection}>{t('showCollection')}</button>
  </CollapsibleSection>
{/if}

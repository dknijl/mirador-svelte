<script>
  let { collectionPath = [], manifestId = null, showCollectionDialog = () => {}, windowId = null, t = (key) => key } = $props();
  function openCollection() {
    showCollectionDialog(manifestId, collectionPath.slice(0, -1), windowId);
  }
</script>

<div class="select-collection">
  <p><em>{t('noItemSelected')}</em></p>
  <button aria-label={t('showCollection')} onclick={openCollection}>
    <span aria-hidden="true">☷</span>{t('showCollection')}
  </button>
</div>

<style>
  .select-collection {
    align-content: center;
    display: grid;
    height: 100%;
    justify-content: center;
    justify-items: center;
  }
  p {
    margin: 0 0 1rem;
    text-align: center;
  }
  button {
    background: var(--mirador-primary, #1976d2);
    border: 0;
    border-radius: 0.2rem;
    color: white;
    cursor: pointer;
    display: flex;
    font: inherit;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
  }
</style>

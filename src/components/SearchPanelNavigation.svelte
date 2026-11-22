<script>
  let {
    numTotal,
    searchHits = [],
    selectedContentSearchAnnotation = [],
    direction = 'ltr',
    selectAnnotation = () => {},
    t = (key, options) => (key === 'pagination' ? `${options.current} of ${options.total}` : key),
  } = $props();
  const currentHitIndex = $derived(searchHits.findIndex((hit) => hit.annotations?.includes(selectedContentSearchAnnotation[0])));
  const total = $derived(searchHits.length < numTotal ? `${searchHits.length}+` : searchHits.length);
  function select(index) {
    const annotationId = searchHits[index]?.annotations?.[0];
    if (annotationId) selectAnnotation(annotationId);
  }
</script>

{#if searchHits.length}
  <div class="search-navigation">
    <button
      type="button"
      aria-label={t('searchPreviousResult')}
      disabled={currentHitIndex <= 0}
      onclick={() => select(currentHitIndex - 1)}
    >
      <span aria-hidden="true" style:transform={direction === 'rtl' ? 'rotate(180deg)' : undefined}>‹</span>
    </button>
    <span role="status" style="unicode-bidi: plaintext">{t('pagination', { current: currentHitIndex + 1, total })}</span>
    <button
      type="button"
      aria-label={t('searchNextResult')}
      disabled={currentHitIndex < 0 || currentHitIndex >= searchHits.length - 1}
      onclick={() => select(currentHitIndex + 1)}
    >
      <span aria-hidden="true" style:transform={direction === 'rtl' ? 'rotate(180deg)' : undefined}>›</span>
    </button>
  </div>
{/if}

<style>
  .search-navigation {
    align-items: center;
    display: flex;
    justify-content: center;
  }
  button {
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    min-height: 36px;
    min-width: 36px;
  }
  button:disabled {
    cursor: default;
    opacity: 0.4;
  }
</style>

<script>
  import Connected from '../svelte/Connected.svelte';
  import SearchHit from './SearchHit.svelte';
  import ScrollTo from './ScrollTo.svelte';
  let {
    containerRef,
    companionWindowId,
    isFetching = false,
    fetchSearch = () => {},
    nextSearch,
    query,
    searchAnnotations = [],
    searchHits = [],
    searchNumTotal = 0,
    windowId,
    t = (key) => key,
  } = $props();
  let focusedIndex = $state(null);
  const empty = $derived(Boolean(query && !isFetching && !searchHits.length && !searchAnnotations.length));
  function showDetails(index) {
    focusedIndex = index;
  }
  function backToResults() {
    focusedIndex = null;
  }
</script>

{#if focusedIndex !== null}
  <ScrollTo {containerRef} offsetTop={96} scrollTo>
    <button class="back" type="button" onclick={backToResults}>{t('backToResults')}</button>
  </ScrollTo>
{/if}
<div class="search-results" role="list">
  {#if empty}<p class="no-results">{t('searchNoResults')}</p>{/if}
  {#if searchHits.length}
    {#each searchHits as hit, index (hit.annotations?.[0] || index)}
      {#if focusedIndex === null || focusedIndex === index}
        <Connected
          name="SearchHit"
          component={SearchHit}
          targetProps={{
            hit,
            index,
            total: searchHits.length,
            companionWindowId,
            windowId,
            focused: focusedIndex === index,
            showDetails: () => showDetails(index),
            t,
          }}
        />
      {/if}
    {/each}
  {:else}
    {#each searchAnnotations as annotation, index (annotation.id)}
      {#if focusedIndex === null || focusedIndex === index}
        <Connected
          name="SearchHit"
          component={SearchHit}
          targetProps={{
            annotationId: annotation.id,
            index,
            total: searchAnnotations.length,
            companionWindowId,
            windowId,
            focused: focusedIndex === index,
            showDetails: () => showDetails(index),
            t,
          }}
        />
      {/if}
    {/each}
  {/if}
</div>
{#if nextSearch}
  <button class="more" type="button" onclick={() => fetchSearch(windowId, companionWindowId, nextSearch, query)}>
    {t('moreResults')}<br />({t('searchResultsRemaining', { numLeft: searchNumTotal - searchHits.length })})
  </button>
{/if}

<style>
  .no-results {
    font-size: 1.1rem;
    padding: 16px;
  }
  .back {
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    padding: 0.5rem;
  }
  .search-results {
    min-height: 0;
  }
  .more {
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    padding: 12px;
    width: 100%;
  }
</style>

<script>
  import Connected from '../svelte/Connected.svelte';
  import CompanionWindow from './CompanionWindow.svelte';
  import SearchPanelControls from './SearchPanelControls.svelte';
  import SearchResults from './SearchResults.svelte';

  let {
    fetchSearch,
    id,
    query = '',
    removeSearch = () => {},
    searchService,
    suggestedSearches = [],
    windowId,
    t = (key) => key,
  } = $props();
  function searchSuggested(queryText) {
    if (!searchService) return;
    fetchSearch(`${searchService.id}?${new URLSearchParams({ q: queryText })}`, queryText);
  }
</script>

{#snippet heading()}
  <span>{t('searchTitle')}</span>
  {#if query}<button type="button" class="clear-search" aria-label={t('clearSearchAria')} onclick={removeSearch}>
      {t('clearSearch')} ×
    </button>{/if}
  <Connected name="SearchPanelControls" component={SearchPanelControls} targetProps={{ companionWindowId: id, windowId }} />
{/snippet}
{#snippet body()}
  <Connected name="SearchResults" component={SearchResults} targetProps={{ companionWindowId: id, windowId }} />
  {#if suggestedSearches.length && !query}
    {#each suggestedSearches as suggestion (suggestion)}<p>
        <button type="button" onclick={() => searchSuggested(suggestion)}>{t('suggestSearch', { query: suggestion })}</button>
      </p>{/each}
  {/if}
{/snippet}
<Connected
  name="CompanionWindow"
  component={CompanionWindow}
  targetProps={{ ariaLabel: t('searchTitle'), title: t('searchTitle'), windowId, id, titleControls: heading }}
>
  {@render body()}
</Connected>

<style>
  .clear-search {
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
  }
  p {
    margin: 16px;
  }
  p button {
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    text-decoration: underline;
  }
</style>

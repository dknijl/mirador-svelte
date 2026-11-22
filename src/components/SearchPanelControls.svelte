<script>
  import Connected from '../svelte/Connected.svelte';
  import SearchPanelNavigation from './SearchPanelNavigation.svelte';
  let {
    autocompleteService,
    companionWindowId,
    fetchSearch = () => {},
    query = '',
    searchIsFetching = false,
    searchService,
    windowId,
    t = (key) => key,
  } = $props();
  let input = $state('');
  let suggestions = $state([]);
  let term = $state('');
  let active = $state(-1);
  const listId = $derived(`suggestions-${companionWindowId}`);

  $effect(() => {
    input = query;
    term = '';
  });

  $effect(() => {
    const value = term;
    const service = autocompleteService?.id;
    suggestions = [];
    active = -1;
    if (!service || !value) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`${service}?${new URLSearchParams({ q: value })}`, { signal: controller.signal });
        if (!response.ok) return;
        const result = await response.json();
        if (!controller.signal.aborted)
          suggestions = (result.terms || []).map((item) => (typeof item === 'string' ? item : item.match));
      } catch {
        if (!controller.signal.aborted) suggestions = [];
      }
    }, 500);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  });

  function search(value) {
    if (!value || !searchService) return;
    input = value;
    term = '';
    fetchSearch(windowId, companionWindowId, `${searchService.id}?${new URLSearchParams({ q: value })}`, value);
  }

  function navigate(event) {
    if (!suggestions.length) return;
    if (event.key === 'Escape') term = '';
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      active = (active + (event.key === 'ArrowDown' ? 1 : -1) + suggestions.length) % suggestions.length;
    }
  }
</script>

<form
  aria-label={t('searchTitle')}
  onsubmit={(event) => {
    event.preventDefault();
    search(suggestions[active] || input);
  }}
>
  <label for={`search-${companionWindowId}`}>{t('searchInputLabel')}</label>
  <div class="search-input">
    <input
      id={`search-${companionWindowId}`}
      role="combobox"
      bind:value={input}
      autocomplete="off"
      aria-autocomplete="list"
      aria-expanded={suggestions.length > 0}
      aria-controls={listId}
      aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
      onkeydown={navigate}
      oninput={(event) => (term = event.currentTarget.value)}
    />
    {#if suggestions.length}
      <ul role="listbox" id={listId} aria-label={t('searchInputLabel')}>
        {#each suggestions as suggestion, index (suggestion)}
          <li role="presentation">
            <button
              type="button"
              role="option"
              id={`${listId}-${index}`}
              aria-selected={active === index}
              onclick={() => search(suggestion)}
            >
              {suggestion}
            </button>
          </li>
        {/each}
      </ul>
    {/if}
    <button type="submit" aria-label={t('searchSubmitAria')}>
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="10" cy="10" r="7" /><path d="m15 15 6 6" />
      </svg>
    </button>
    {#if searchIsFetching}<span class="spinner" role="progressbar" aria-label={t('loading')}></span>{/if}
  </div>
</form>
<Connected name="SearchPanelNavigation" component={SearchPanelNavigation} targetProps={{ windowId, companionWindowId }} />

<style>
  [role='listbox'] {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 2;
    margin: 0;
    padding: 0;
    list-style: none;
    background: Canvas;
    color: CanvasText;
  }
  [role='option'] {
    width: 100%;
    text-align: start;
  }
  [role='option'][aria-selected='true'] {
    background: Highlight;
    color: HighlightText;
  }

  form {
    padding: 0 12px 8px;
    width: 100%;
  }
  label {
    display: block;
    font-size: 0.85rem;
    margin-bottom: 4px;
  }
  .search-input {
    align-items: center;
    display: flex;
    position: relative;
  }
  input {
    background: transparent;
    border: 0;
    border-bottom: 1px solid currentcolor;
    color: inherit;
    flex: 1;
    font: inherit;
    min-width: 0;
    padding: 6px;
  }
  button {
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    font-size: 1.25rem;
    min-width: 36px;
    min-height: 36px;
  }
  .spinner {
    animation: spin 1s linear infinite;
    border: 2px solid currentcolor;
    border-right-color: transparent;
    border-radius: 50%;
    height: 18px;
    position: absolute;
    right: 40px;
    width: 18px;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>

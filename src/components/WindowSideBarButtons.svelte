<script>
  import SveltePlugin from '../extend/SveltePlugin.svelte';
  let {
    addCompanionWindow = () => {},
    closeSideBar = () => {},
    hasAnnotations = false,
    hasAnyAnnotations = false,
    hasAnyLayers = false,
    hasCurrentLayers = false,
    hasSearchResults = false,
    hasSearchService = false,
    panels = {},
    sideBarPanel = 'closed',
    t = (key) => key,
    plugins = [],
    store,
    windowId,
  } = $props();

  const available = $derived(
    [
      panels.info && ['info', 'ⓘ'],
      panels.attribution && ['attribution', '©'],
      panels.canvas && ['canvas', '▤'],
      panels.annotations && (hasAnnotations || hasAnyAnnotations) && ['annotations', '▣', hasAnnotations, true],
      panels.search && hasSearchService && ['search', '⌕', hasSearchResults, true],
      panels.layers && hasAnyLayers && ['layers', '▱', hasCurrentLayers, true],
    ].filter(Boolean),
  );
  const pluginTabs = $derived(
    plugins.filter(
      (plugin) => plugin.target === 'WindowSideBarButtons' && plugin.mode === 'add' && plugin.component && plugin.value,
    ),
  );
</script>

<div class="tabs" role="tablist" aria-label={t('sidePanel', 'Side panels')}>
  {#each available as [value, icon, badge, showBadge] (value)}
    <button
      type="button"
      role="tab"
      aria-label={t('openCompanionWindow', { context: value })}
      aria-selected={sideBarPanel === value}
      class:active={sideBarPanel === value}
      onclick={() => (sideBarPanel === value ? closeSideBar() : addCompanionWindow(value))}
    >
      <span aria-hidden="true">{icon}</span>
      {#if showBadge}<span class="badge" hidden={!badge} aria-label={badge ? t('newContent', 'New content') : undefined}
        ></span>{/if}
    </button>
  {/each}
  {#each pluginTabs as plugin (plugin.value)}
    <button
      type="button"
      role="tab"
      aria-label={plugin.value}
      aria-selected={sideBarPanel === plugin.value}
      class:active={sideBarPanel === plugin.value}
      onclick={() => (sideBarPanel === plugin.value ? closeSideBar() : addCompanionWindow(plugin.value))}
    >
      <SveltePlugin {plugin} {store} targetProps={{ value: plugin.value, windowId }} />
    </button>
  {/each}
</div>

<style>
  .tabs {
    display: flex;
    min-height: 32px;
  }
  button {
    position: relative;
    min-width: 38px;
    min-height: 32px;
    padding: 4px 8px;
    border: 0;
    border-bottom: 2px solid transparent;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }
  button:hover,
  button:focus-visible {
    background: rgb(0 0 0 / 8%);
    text-decoration: none;
  }
  button.active {
    border-bottom-color: currentcolor;
  }
  .badge {
    position: absolute;
    inset-block-start: 4px;
    inset-inline-end: 4px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #d32f2f;
  }
</style>

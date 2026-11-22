<script>
  import Connected from '../svelte/Connected.svelte';
  import PluginTarget from '../extend/PluginTarget.svelte';
  import ManifestInfo from './ManifestInfo.svelte';
  import LabelValueMetadata from './LabelValueMetadata.svelte';
  import IIIFResourceLabel from './IIIFResourceLabel.svelte';

  let {
    addWindow = () => {},
    collection = null,
    dialogCollectionPath = [],
    error = null,
    hideCollectionDialog = () => {},
    isMultipart = false,
    manifest = null,
    manifestId,
    open = false,
    ready = false,
    setWorkspaceAddVisibility = () => {},
    showCollectionDialog = () => {},
    updateWindow = () => {},
    windowId = null,
    plugins = [],
    store,
    t = (key) => key,
  } = $props();
  let filter = $state(null);
  const collections = $derived(manifest?.getCollections?.() ?? []);
  const manifests = $derived(manifest?.getManifests?.() ?? []);
  const currentFilter = $derived(filter || (collections.length ? 'collections' : 'manifests'));
  const rights = $derived(manifest ? asArray(manifest.getProperty('rights') || manifest.getProperty('license')) : []);
  const requiredStatement = $derived(
    manifest
      ? asArray(manifest.getRequiredStatement())
          .filter((pair) => pair?.getValue())
          .map((pair) => ({ label: null, values: pair.getValues() }))
      : [],
  );

  function asArray(value) {
    return Array.isArray(value) ? value : value ? [value] : [];
  }

  function navigateMenu(event) {
    const items = Array.from(event.currentTarget.querySelectorAll('[role="menuitem"]'));
    const current = items.indexOf(event.target);
    if (!items.length || current === -1) return;
    const next = {
      Home: 0,
      End: items.length - 1,
      ArrowUp: (current + items.length - 1) % items.length,
      ArrowDown: (current + 1) % items.length,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    items[next].focus();
  }

  function hideDialog() {
    hideCollectionDialog(windowId);
  }

  function selectCollection(item) {
    showCollectionDialog(item.id, [...dialogCollectionPath, manifestId], windowId);
  }

  function goToPreviousCollection() {
    showCollectionDialog(dialogCollectionPath.at(-1), dialogCollectionPath.slice(0, -1), windowId);
  }

  function selectManifest(item) {
    if (windowId)
      updateWindow(windowId, { canvasId: null, collectionPath: [...dialogCollectionPath, manifestId], manifestId: item.id });
    else addWindow({ collectionPath: [...dialogCollectionPath, manifestId], manifestId: item.id });
    hideDialog();
    setWorkspaceAddVisibility(false);
  }
</script>

{#if open && !error}
  <dialog open aria-labelledby="select-collection">
    {#if ready && manifest}
      <header>
        <small>{t(isMultipart ? 'multipartCollection' : 'collection')}</small>
        <h2 id="select-collection"><IIIFResourceLabel resource={manifest} {store} /></h2>
      </header>
      <div class="dialog-content">
        {#if collection}
          <button class="back" onclick={goToPreviousCollection}>
            <span aria-hidden="true">←</span><IIIFResourceLabel resource={collection} {store} />
          </button>
        {/if}
        <div class="metadata">
          <Connected
            name="ManifestInfo"
            component={ManifestInfo}
            {plugins}
            {store}
            {t}
            targetProps={{ manifestId: manifest.id }}
          />
          <details>
            <summary>{t('attributionTitle')}</summary>
            {#if requiredStatement.length}<Connected
                name="LabelValueMetadata"
                component={LabelValueMetadata}
                {plugins}
                {store}
                {t}
                targetProps={{ labelValuePairs: requiredStatement, defaultLabel: t('attribution') }}
              />{/if}
            {#if rights.length}
              <h3>{t('rights')}</h3>
              {#each rights as right (typeof right === 'string' ? right : right.getValue?.())}
                {@const href = typeof right === 'string' ? right : right.getValue?.()}
                <p><a {href} target="_blank" rel="noopener noreferrer">{href}</a></p>
              {/each}
            {/if}
          </details>
        </div>
        <div class="filters">
          {#if manifest.getTotalCollections() > 0}<button
              aria-pressed={currentFilter === 'collections'}
              onclick={() => (filter = 'collections')}
            >
              {t('totalCollections', { count: manifest.getTotalCollections() })}
            </button>{/if}
          {#if manifest.getTotalManifests() > 0}<button
              aria-pressed={currentFilter === 'manifests'}
              onclick={() => (filter = 'manifests')}
            >
              {t('totalManifests', { count: manifest.getTotalManifests() })}
            </button>{/if}
        </div>
        <ul role="menu" aria-labelledby="select-collection" tabindex="-1" onkeydown={navigateMenu}>
          {#if currentFilter === 'collections'}
            {#each collections as item (item.id)}<li role="none">
                <button role="menuitem" onclick={() => selectCollection(item)}>
                  <IIIFResourceLabel resource={item} {store} />
                </button>
              </li>{/each}
          {:else}
            {#each manifests as item (item.id)}<li role="none">
                <button role="menuitem" onclick={() => selectManifest(item)}>
                  <IIIFResourceLabel resource={item} {store} />
                </button>
              </li>{/each}
          {/if}
        </ul>
        <PluginTarget mode="add" name="CollectionDialog" {plugins} {store} targetProps={{ manifest, manifestId, windowId }} />
      </div>
      <footer><button onclick={hideDialog}>{t('close')}</button></footer>
    {:else}
      <h2 id="select-collection" class="loading">{t('loading')}</h2>
      {#each [0, 1, 2] as row (row)}
        <div class="skeleton" aria-hidden="true"></div>
      {/each}
    {/if}
  </dialog>
{/if}

<style>
  dialog {
    background: Canvas;
    border: 0;
    box-shadow: 0 8px 32px #0005;
    color: CanvasText;
    left: 50%;
    max-height: 86vh;
    max-width: min(46rem, calc(100vw - 2rem));
    overflow: auto;
    padding: 1.25rem;
    position: fixed;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    z-index: 1400;
  }
  header small {
    text-transform: uppercase;
  }
  h2 {
    margin: 0.25rem 0 1rem;
  }
  .dialog-content {
    max-height: 65vh;
    overflow: auto;
  }
  .metadata {
    padding: 1rem;
  }
  details {
    margin-top: 0.5rem;
  }
  summary {
    cursor: pointer;
  }
  .filters {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
  }
  button {
    background: transparent;
    border: 1px solid #888;
    color: inherit;
    cursor: pointer;
    font: inherit;
    padding: 0.55rem 0.8rem;
  }
  button[aria-pressed='true'] {
    background: var(--mirador-primary, #1976d2);
    border-color: var(--mirador-primary, #1976d2);
    color: white;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    border-bottom: 1px solid #ccc;
  }
  li button {
    border: 0;
    text-align: start;
    width: 100%;
  }
  footer {
    display: flex;
    justify-content: end;
    margin-top: 1rem;
  }
  .skeleton {
    background: #ddd;
    height: 2.5rem;
    margin-top: 1rem;
  }
</style>

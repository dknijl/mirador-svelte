<script>
  import Connected from '../svelte/Connected.svelte';
  import CompanionWindow from './CompanionWindow.svelte';
  let {
    collectionPath = [],
    collection,
    id,
    isFetching = false,
    manifestId,
    parentCollection,
    updateCompanionWindow = () => {},
    updateWindow = () => {},
    windowId,
    t = (key) => key,
  } = $props();
  const label = (resource) => resource?.getLabel?.()?.getValue?.('') || resource?.id || '';
  const behavior = $derived(collection?.getProperty?.('behavior'));
  const isMultipart = $derived(Array.isArray(behavior) ? behavior.includes('multi-part') : behavior === 'multi-part');
</script>

{#snippet heading()}
  {#if parentCollection}<button
      type="button"
      onclick={() => updateCompanionWindow({ collectionPath: collectionPath.slice(0, -1) })}
    >
      ↑ {label(parentCollection)}
    </button>{/if}
  <strong>
    {label(collection)}{#if isFetching}<span class="loading" aria-label={t('loading')}></span>{/if}
  </strong>
{/snippet}
{#snippet body()}
  {#if isFetching}<p class="loading">{t('loading')}</p>{/if}
  {#if collection}
    <ul>
      {#each collection.getCollections() as child (child.id)}<li>
          <button type="button" onclick={() => updateCompanionWindow({ collectionPath: [...collectionPath, child.id] })}>
            {label(child)}
          </button>
        </li>{/each}
      {#each collection.getManifests() as manifest (manifest.id)}<li
          aria-current={manifestId === manifest.id ? 'true' : undefined}
        >
          <button
            type="button"
            onclick={() => {
              updateWindow({ canvasId: null, collectionPath, manifestId: manifest.id });
              updateCompanionWindow({ multipart: false });
            }}
          >
            {label(manifest)}
          </button>
        </li>{/each}
    </ul>
  {/if}
{/snippet}
<Connected
  name="CompanionWindow"
  component={CompanionWindow}
  targetProps={{ title: t(isMultipart ? 'multipartCollection' : 'collection'), windowId, id, titleControls: heading }}
>
  {@render body()}
</Connected>

<style>
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    border-bottom: 1px solid color-mix(in srgb, currentColor 15%, transparent);
  }
  li button {
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    padding: 12px 16px;
    text-align: start;
    width: 100%;
  }
  li[aria-current='true'] button {
    font-weight: 600;
  }
  .loading {
    display: inline-block;
    height: 0.8em;
    margin-inline-start: 0.5em;
    width: 5em;
    background: color-mix(in srgb, currentColor 15%, transparent);
  }
</style>

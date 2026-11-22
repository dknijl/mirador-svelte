<script>
  import { attachIIIFDrop } from '../lib/iiifDrop';
  import Connected from '../svelte/Connected.svelte';
  import PluginTarget from '../extend/PluginTarget.svelte';
  import ManifestForm from './ManifestForm.svelte';
  import ManifestListItem from './ManifestListItem.svelte';

  let {
    addResource = () => {},
    catalog = [],
    setWorkspaceAddVisibility = () => {},
    plugins = [],
    store,
    t = (key) => key,
    ...rest
  } = $props();
  let formOpen = $state(false);
  let listElement;
  let currentWidth = $state('100%');

  function updateWidth() {
    if (listElement) currentWidth = `${listElement.offsetWidth}px`;
  }

  function scrollToTop() {
    listElement?.scrollTo({ behavior: 'smooth', left: 0, top: 0 });
  }

  function handleDrop({ manifestId, manifestJson }) {
    if (manifestJson) addResource(manifestId, manifestJson, { provider: 'file' });
    else addResource(manifestId);
    scrollToTop();
  }

  function submit() {
    formOpen = false;
    scrollToTop();
  }

  $effect(() => {
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  });
</script>

<div
  class="workspace-add mirador-workspace-add"
  bind:this={listElement}
  {@attach (element) => attachIIIFDrop(element, handleDrop)}
>
  {#if catalog.length === 0}
    <h1 class="empty">{t('emptyResourceList')}</h1>
  {:else}
    <section aria-labelledby="resource-heading">
      <h1 id="resource-heading" class="visually-hidden">{t('miradorResources')}</h1>
      <ul class="manifest-list">
        <PluginTarget
          mode="add"
          name="WorkspaceAdd"
          {plugins}
          {store}
          targetProps={{ addResource, catalog, setWorkspaceAddVisibility, ...rest }}
        >
          {#each catalog as resource, index (resource.manifestId)}
            <Connected
              name="ManifestListItem"
              component={ManifestListItem}
              {plugins}
              {store}
              {t}
              targetProps={{
                manifestId: resource.manifestId,
                provider: resource.provider,
                handleClose: () => setWorkspaceAddVisibility(false),
                autofocus: index === 0,
              }}
            />
          {/each}
        </PluginTarget>
      </ul>
    </section>
  {/if}

  <button class="add-resource-button" disabled={formOpen} aria-label={t('addResource')} onclick={() => (formOpen = true)}>
    <span aria-hidden="true">+</span>{t('addResource')}
  </button>

  {#if formOpen}
    <section class="form-drawer" style:width={currentWidth} aria-label={t('addResource')}>
      <header>
        <button type="button" aria-label={t('closeAddResourceForm')} onclick={() => (formOpen = false)}>⌄</button>
        <h2>{t('addResource')}</h2>
      </header>
      <Connected
        name="ManifestForm"
        component={ManifestForm}
        {plugins}
        {store}
        {t}
        targetProps={{ addResourcesOpen: formOpen, onSubmit: submit, onCancel: () => (formOpen = false) }}
      />
    </section>
  {/if}
</div>

<style>
  .workspace-add {
    box-sizing: border-box;
    height: 100%;
    overflow: auto;
    position: relative;
  }
  .empty {
    align-items: center;
    display: flex;
    font-size: 1.5rem;
    height: 100%;
    justify-content: center;
    margin: 0;
    text-align: center;
  }
  .manifest-list {
    margin: 1rem;
    padding: 0;
  }
  .add-resource-button {
    align-items: center;
    background: var(--mirador-primary, #1976d2);
    border: 0;
    border-radius: 2rem;
    bottom: 1rem;
    color: white;
    cursor: pointer;
    display: flex;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    position: absolute;
    right: 1rem;
  }
  .add-resource-button span {
    font-size: 1.4rem;
    line-height: 1;
  }
  .form-drawer {
    background: Canvas;
    border-top: 1px solid #aaa;
    bottom: 0;
    box-sizing: border-box;
    left: 0;
    padding: 1rem;
    position: absolute;
  }
  .form-drawer header {
    align-items: center;
    background: var(--mirador-primary, #1976d2);
    color: white;
    display: flex;
    gap: 1rem;
    margin: -1rem -1rem 1rem;
    padding: 0.5rem 1rem;
  }
  .form-drawer header h2 {
    font-size: 1.25rem;
    margin: 0;
  }
  .form-drawer header button {
    background: transparent;
    border: 0;
    color: inherit;
    font: inherit;
  }
  .visually-hidden {
    clip: rect(0, 0, 0, 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
</style>

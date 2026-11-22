<script>
  import { onMount, untrack } from 'svelte';
  import Connected from '../svelte/Connected.svelte';
  import ManifestListItemError from './ManifestListItemError.svelte';

  let {
    manifestId,
    provider = null,
    fetchManifest = () => {},
    addWindow = () => {},
    handleClose = () => {},
    active = false,
    ready = false,
    isFetching = false,
    error = null,
    title = null,
    thumbnail = null,
    manifestLogo = null,
    size = 0,
    isCollection = false,
    isMultipart = false,
    autofocus = false,
    t = (key, opts) => (opts?.count ? `${opts.count} ${key}` : key),
    plugins = [],
    store,
  } = $props();
  let itemButton = $state();

  let requested;
  $effect(() => {
    if (ready || error || isFetching || provider === 'file' || requested === manifestId) return;
    requested = manifestId;
    untrack(() => fetchManifest(manifestId));
  });

  onMount(() => {
    if (autofocus) itemButton?.focus();
  });
</script>

<li
  class:active
  data-manifestid={manifestId}
  data-active={active}
  style:border-left-color={active ? 'var(--mirador-primary, #1967d2)' : 'transparent'}
>
  {#if error}
    <Connected
      name="ManifestListItemError"
      component={ManifestListItemError}
      {plugins}
      {store}
      {t}
      targetProps={{ manifestId }}
    />
  {:else if ready}
    <div class="manifest-item">
      <button
        bind:this={itemButton}
        class="manifest-title"
        onclick={() => {
          addWindow({ manifestId });
          handleClose();
        }}
      >
        {#if thumbnail}<img class="thumbnail" src={thumbnail} alt="" />{:else}<span
            class="thumbnail-placeholder"
            aria-hidden="true"
          ></span>{/if}
        <span class="title">
          {#if isCollection}<small>{t(isMultipart ? 'multipartCollection' : 'collection')}</small>{/if}
          <strong>{title || manifestId}</strong>
        </span>
      </button>
      <div class="manifest-meta"><span>{provider}</span><span>{t('numItems', { count: size, number: size })}</span></div>
      {#if manifestLogo}<img class="logo" src={manifestLogo} alt="" />{/if}
    </div>
  {:else}
    <div class="manifest-item loading" aria-label={t('loading')} aria-busy="true">
      <span class="thumbnail-placeholder"></span><span class="skeleton"></span>
    </div>
  {/if}
</li>

<style>
  li {
    border-bottom: 1px solid #ddd;
    border-left: 4px solid transparent;
    list-style: none;
    padding: 0.5rem 1rem;
  }
  li.active {
    border-left-color: var(--mirador-primary, #1976d2);
  }
  .manifest-item {
    align-items: center;
    display: grid;
    gap: 0.75rem;
    grid-template-columns: minmax(12rem, 5fr) minmax(8rem, 4fr) minmax(3rem, 3fr);
    width: 100%;
  }
  .manifest-title {
    align-items: center;
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    display: flex;
    font: inherit;
    gap: 1rem;
    min-width: 0;
    padding: 0;
    text-align: left;
  }
  .thumbnail,
  .thumbnail-placeholder {
    height: 5rem;
    object-fit: contain;
    width: 7.5rem;
  }
  .thumbnail-placeholder {
    background: #ddd;
    display: block;
  }
  .title {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .title strong {
    font-size: 1.1rem;
    overflow-wrap: anywhere;
  }
  .manifest-meta {
    display: flex;
    flex-direction: column;
  }
  .logo {
    height: 2.5rem;
    max-width: 100%;
    object-fit: contain;
  }
  .skeleton {
    background: #ddd;
    height: 1.2rem;
    width: 70%;
  }
  @media (max-width: 600px) {
    .manifest-item {
      grid-template-columns: 1fr 1fr;
    }
    .manifest-meta {
      grid-column: 1;
    }
    .logo {
      grid-column: 2;
      grid-row: 2;
    }
  }
</style>

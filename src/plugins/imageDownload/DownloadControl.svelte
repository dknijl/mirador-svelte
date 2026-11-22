<script>
  import { createSubscriber } from 'svelte/reactivity';

  let { t, getGroups, subscribe } = $props();
  let dialog;
  let open = $state(false);
  const trackStore = createSubscriber((update) => subscribe(update));
  let groups = $derived.by(() => {
    if (!open) return [];
    trackStore();
    return getGroups();
  });
  const titleId = $props.id();

  function closeDownloads() {
    dialog.close();
    open = false;
  }

  function showDownloads() {
    dialog.showModal();
    open = true;
  }
</script>

<button
  type="button"
  class="download"
  title={t('mirador-dl-plugin.download')}
  aria-label={t('mirador-dl-plugin.download')}
  aria-haspopup="dialog"
  onclick={showDownloads}
>
  <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M16 13h-3V3h-2v10H8l4 4zM4 19v2h16v-2z" />
  </svg>
</button>
<dialog
  bind:this={dialog}
  aria-labelledby={titleId}
  onclose={() => {
    open = dialog.open;
  }}
>
  <h2 id={titleId}>{t('mirador-dl-plugin.download')}</h2>
  {#each groups as group, index (index)}
    <h3>{group.label}</h3>
    <ul>
      {#each group.links as link (link.href)}
        <li><a href={link.href} download target="_blank" rel="noopener noreferrer">{link.label}</a></li>
      {/each}
    </ul>
  {:else}
    <p>{t('mirador-dl-plugin.empty')}</p>
  {/each}
  <button type="button" class="close" onclick={closeDownloads}>{t('mirador-dl-plugin.close')}</button>
</dialog>

<style>
  .download {
    background: transparent;
    border: 0;
    border-radius: 50%;
    color: inherit;
    cursor: pointer;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
  }
  .download:hover {
    background: color-mix(in srgb, currentColor 8%, transparent);
  }
  dialog {
    background: Canvas;
    color: CanvasText;
    border: 0;
    border-radius: 4px;
    padding: 1.5rem;
    width: min(26rem, 80vw);
    max-height: 75vh;
    overflow: auto;
    box-shadow: 0 8px 32px #0004;
  }
  dialog::backdrop {
    background: #0006;
  }
  h2 {
    margin: 0 0 1rem;
  }
  h3 {
    font-size: 1rem;
  }
  li {
    margin-block: 0.5rem;
  }
  .close {
    font: inherit;
    cursor: pointer;
    padding: 0.35rem 0.8rem;
  }
</style>

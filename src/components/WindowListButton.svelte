<script>
  import Connected from '../svelte/Connected.svelte';
  import WindowList from './WindowList.svelte';
  import MiradorMenuButton from './MiradorMenuButton.svelte';
  let { disabled = false, windowCount = 0, plugins = [], store, t = (key) => key } = $props();
  let anchorEl = $state(null);
  let id = $state('window-list-menu');
</script>

<MiradorMenuButton
  aria-haspopup="menu"
  aria-label={t('listAllOpenWindows')}
  aria-controls={anchorEl ? id : undefined}
  aria-expanded={Boolean(anchorEl)}
  selected={Boolean(anchorEl)}
  {disabled}
  onclick={(event) => (anchorEl = event.currentTarget)}
>
  <span aria-hidden="true">▤</span><span class="badge">{windowCount}</span>
</MiradorMenuButton>
{#if anchorEl}
  <Connected
    name="WindowList"
    component={WindowList}
    {plugins}
    {store}
    {t}
    targetProps={{ anchorEl, id, open: true, handleClose: () => (anchorEl = null) }}
  />
{/if}

<style>
  .badge {
    background: #555;
    border-radius: 1rem;
    font-size: 0.65rem;
    min-width: 1rem;
    padding: 0.1rem 0.25rem;
  }
</style>

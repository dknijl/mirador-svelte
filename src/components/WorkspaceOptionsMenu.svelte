<script>
  import Connected from '../svelte/Connected.svelte';
  import PluginTarget from '../extend/PluginTarget.svelte';
  import WorkspaceExport from './WorkspaceExport.svelte';
  import WorkspaceImport from './WorkspaceImport.svelte';
  let { anchorEl = null, handleClose = () => {}, open = false, plugins = [], store, t = (key) => key, ...rest } = $props();
  let selected = $state(null);
  function choose(value) {
    selected = value;
    handleClose();
  }
  function closeDialog() {
    selected = null;
  }
</script>

{#if open}
  <div class="backdrop" onclick={handleClose} role="presentation"></div>
  <div
    class="menu"
    role="menu"
    aria-label={t('workspaceOptions')}
    style:top={anchorEl && typeof anchorEl.getBoundingClientRect === 'function'
      ? `${Math.max(8, anchorEl.getBoundingClientRect().top - 120)}px`
      : '8px'}
  >
    <button role="menuitem" onclick={() => choose('exportWorkspace')}>{t('downloadExportWorkspace')}</button>
    <button role="menuitem" onclick={() => choose('importWorkspace')}>{t('importWorkspace')}</button>
    <PluginTarget
      mode="add"
      name="WorkspaceOptionsMenu"
      {plugins}
      {store}
      targetProps={{ anchorEl, handleClose, open, ...rest }}
    />
  </div>
{/if}
{#if selected === 'exportWorkspace'}
  <Connected
    name="WorkspaceExport"
    component={WorkspaceExport}
    {plugins}
    {store}
    {t}
    targetProps={{ open: true, handleClose: closeDialog }}
  />
{:else if selected === 'importWorkspace'}
  <Connected
    name="WorkspaceImport"
    component={WorkspaceImport}
    {plugins}
    {store}
    {t}
    targetProps={{ open: true, handleClose: closeDialog }}
  />
{/if}

<style>
  .backdrop {
    inset: 0;
    position: fixed;
    z-index: 1299;
  }
  .menu {
    background: Canvas;
    box-shadow: 0 4px 16px #0004;
    display: flex;
    flex-direction: column;
    min-width: 15rem;
    padding: 0.35rem;
    position: fixed;
    right: 0.5rem;
    z-index: 1300;
  }
  button {
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    font: inherit;
    padding: 0.7rem;
    text-align: start;
  }
</style>

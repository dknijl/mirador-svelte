<script>
  import Connected from '../svelte/Connected.svelte';
  import WindowViewSettings from './WindowViewSettings.svelte';
  import WindowThumbnailSettings from './WindowThumbnailSettings.svelte';
  import CaptionTocMenu from './CaptionTocMenu.svelte';
  import PluginTarget from '../extend/PluginTarget.svelte';
  let {
    handleClose = () => {},
    showThumbnailNavigationSettings = true,
    windowId,
    id,
    store,
    plugins = [],
    pluginList = plugins,
    t = (key) => key,
  } = $props();
</script>

<div class="popover-backdrop" role="presentation" onclick={(event) => event.target === event.currentTarget && handleClose()}>
  <div
    class="window-top-menu"
    {id}
    role="menu"
    tabindex="-1"
    aria-label={t('windowMenu')}
    onkeydown={(event) => event.key === 'Escape' && handleClose()}
  >
    <Connected name="WindowViewSettings" component={WindowViewSettings} targetProps={{ windowId, handleClose }} />
    {#if showThumbnailNavigationSettings}
      <Connected name="WindowThumbnailSettings" component={WindowThumbnailSettings} targetProps={{ windowId, handleClose }} />
    {/if}
    <Connected name="CaptionTocMenu" component={CaptionTocMenu} targetProps={{ windowId, handleClose }} />
    <h3 role="presentation">{t('windowPluginButtons')}</h3>
    <PluginTarget mode="add" name="WindowTopMenu" {store} plugins={pluginList} targetProps={{ windowId, handleClose }} />
    <button class="close" type="button" onclick={handleClose}>{t('close')}</button>
  </div>
</div>

<style>
  .popover-backdrop {
    inset: 0;
    position: fixed;
    z-index: 1400;
  }
  .window-top-menu {
    background: var(--mirador-paper, Canvas);
    border-radius: 4px;
    box-shadow: 0 4px 18px rgb(0 0 0 / 24%);
    max-height: 80vh;
    overflow: auto;
    padding: 8px;
    position: absolute;
    right: 12px;
    top: 52px;
  }
  .window-top-menu:focus {
    outline: none;
  }
  h3 {
    font-size: 0.875rem;
    font-weight: 500;
    margin: 8px 12px 4px;
  }
  .close {
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    margin-top: 8px;
    padding: 6px 12px;
  }
</style>

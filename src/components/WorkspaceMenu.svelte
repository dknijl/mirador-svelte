<script>
  import Connected from '../svelte/Connected.svelte';
  import PluginTarget from '../extend/PluginTarget.svelte';
  import NestedMenu from './NestedMenu.svelte';
  import LanguageSettings from './LanguageSettings.svelte';
  import WorkspaceSelectionDialog from './WorkspaceSelectionDialog.svelte';
  import ChangeThemeDialog from './ChangeThemeDialog.svelte';

  let {
    open = false,
    anchorEl = null,
    handleClose = () => {},
    showThemePicker = false,
    isWorkspaceAddVisible = false,
    toggleZoomControls = () => {},
    showZoomControls = false,
    plugins = [],
    store,
    t = (key) => key,
    ...rest
  } = $props();
  let selectedOption = $state(null);

  function closeDialog() {
    selectedOption = null;
  }
  function select(option) {
    selectedOption = option;
    handleClose();
  }
</script>

{#if open}
  <div
    class="menu-backdrop"
    onclick={handleClose}
    onkeydown={(event) => event.key === 'Escape' && handleClose()}
    role="presentation"
  ></div>
  <div
    class="menu"
    role="menu"
    aria-label={t('workspaceMenu')}
    style:top={anchorEl && typeof anchorEl.getBoundingClientRect === 'function'
      ? `${Math.max(8, anchorEl.getBoundingClientRect().top - 260)}px`
      : '8px'}
  >
    <button
      role="menuitem"
      disabled={isWorkspaceAddVisible}
      onclick={() => {
        toggleZoomControls(!showZoomControls);
        handleClose();
      }}
    >
      {t(showZoomControls ? 'hideZoomControls' : 'showZoomControls')}
    </button>
    <button role="menuitem" onclick={() => select('workspaceSelection')}>{t('selectWorkspaceMenu')}</button>
    <NestedMenu label={t('language')} {plugins} {store} {t}>
      <div class="language-menu" role="menu">
        <Connected
          name="LanguageSettings"
          component={LanguageSettings}
          {plugins}
          {store}
          {t}
          targetProps={{ afterSelect: handleClose }}
        />
      </div>
    </NestedMenu>
    {#if showThemePicker}<button role="menuitem" onclick={() => select('changeTheme')}>{t('changeTheme')}</button>{/if}
    <PluginTarget mode="add" name="WorkspaceMenu" {plugins} {store} targetProps={{ open, anchorEl, handleClose, ...rest }} />
  </div>
{/if}
{#if selectedOption === 'workspaceSelection'}
  <Connected
    name="WorkspaceSelectionDialog"
    component={WorkspaceSelectionDialog}
    {plugins}
    {store}
    {t}
    targetProps={{ open: true, handleClose: closeDialog }}
  />
{:else if selectedOption === 'changeTheme'}
  <Connected
    name="ChangeThemeDialog"
    component={ChangeThemeDialog}
    {plugins}
    {store}
    {t}
    targetProps={{ open: true, handleClose: closeDialog }}
  />
{/if}

<style>
  .menu-backdrop {
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
  .menu button {
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    font: inherit;
    padding: 0.7rem;
    text-align: start;
  }
  .menu button:hover,
  .menu button:focus-visible {
    background: color-mix(in srgb, CanvasText 10%, Canvas);
  }
  .menu button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  .language-menu {
    background: Canvas;
    box-shadow: 0 4px 16px #0004;
    display: flex;
    flex-direction: column;
    max-height: 15rem;
    overflow: auto;
  }
</style>

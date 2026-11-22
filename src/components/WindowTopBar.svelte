<script>
  import Connected from '../svelte/Connected.svelte';
  import ns from '../config/css-ns';
  import MiradorMenuButton from './MiradorMenuButton.svelte';
  import WindowTopMenuButton from './WindowTopMenuButton.svelte';
  import WindowTopBarPluginArea from './WindowTopBarPluginArea.svelte';
  import WindowTopBarPluginMenu from './WindowTopBarPluginMenu.svelte';
  import FullScreenButton from './FullScreenButton.svelte';
  import DownloadControl from '../plugins/imageDownload/DownloadControl.svelte';
  import { getDownloadGroups } from '../plugins/imageDownload/downloadGroups';

  let {
    removeWindow,
    windowId,
    toggleWindowSideBar,
    maximizeWindow = () => {},
    maximized = false,
    minimizeWindow = () => {},
    allowClose = true,
    allowMaximize = true,
    allowFullscreen = false,
    allowTopMenuButton = true,
    allowWindowSideBar = true,
    sideBarOpen = false,
    windowDraggable = false,
    component = 'nav',
    store,
    plugins = [],
    t = (key) => key,
  } = $props();

  function groups() {
    return getDownloadGroups(store.getState(), windowId, t);
  }
</script>

<svelte:element
  this={component}
  class={ns('window-top-bar')}
  aria-label={t('windowNavigation')}
  role="navigation"
  draggable={windowDraggable ? true : undefined}
  data-mosaic-handle={windowDraggable ? '' : undefined}
>
  {#if allowWindowSideBar}
    <Connected
      name="MiradorMenuButton"
      component={MiradorMenuButton}
      targetProps={{
        'aria-expanded': sideBarOpen,
        'aria-haspopup': true,
        'aria-label': t(sideBarOpen ? 'hideWindowSideBar' : 'showWindowSideBar'),
        onclick: toggleWindowSideBar,
        class: ns('window-menu-btn'),
      }}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
    </Connected>
  {/if}
  {#if allowTopMenuButton}<Connected name="WindowTopMenuButton" component={WindowTopMenuButton} targetProps={{ windowId }} />{/if}
  <DownloadControl {t} subscribe={store.subscribe} getGroups={groups} />
  <WindowTopBarPluginArea {store} {plugins} {windowId} />
  <WindowTopBarPluginMenu {store} {plugins} {t} {windowId} />
  {#if allowMaximize}
    <Connected
      name="MiradorMenuButton"
      component={MiradorMenuButton}
      targetProps={{
        'aria-label': t(maximized ? 'minimizeWindow' : 'maximizeWindow'),
        class: ns('window-maximize window-menu-btn'),
        onclick: maximized ? minimizeWindow : maximizeWindow,
      }}
    >
      {#if maximized}
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 7h12v10H6z" /></svg>
      {:else}
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 4h16v16H4z" /></svg>
      {/if}
    </Connected>
  {/if}
  {#if allowFullscreen}<Connected
      name="FullScreenButton"
      component={FullScreenButton}
      targetProps={{ class: ns('window-menu-btn') }}
    />{/if}
  {#if allowClose}
    <Connected
      name="MiradorMenuButton"
      component={MiradorMenuButton}
      targetProps={{ 'aria-label': t('closeWindow'), class: ns('window-close window-menu-btn'), onclick: removeWindow }}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" /></svg>
    </Connected>
  {/if}
</svelte:element>

<style>
  .mirador-window-top-bar {
    align-items: center;
    background: var(--mirador-paper, Canvas);
    display: flex;
    flex-shrink: 0;
    gap: 4px;
    justify-content: flex-end;
    min-height: 32px;
    padding-inline: 4px 8px;
    position: relative;
    z-index: 1100;
  }
  .mirador-window-top-bar :global(.menu-button) {
    height: 32px;
    min-width: 32px;
    padding: 5px;
  }
  .mirador-window-top-bar :global(.menu-button svg) {
    height: 20px;
    width: 20px;
  }
  .mirador-window-top-bar :global(.menu-button svg path) {
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
  }
  .mirador-window-top-bar :global([draggable='true']) {
    cursor: move;
  }
</style>

<script>
  import { setContext } from 'svelte';
  import ns from '../config/css-ns';
  import Connected from '../svelte/Connected.svelte';
  import { windowViewerContext } from '../svelte/windowViewerContext';
  import PrimaryWindow from './PrimaryWindow.svelte';
  import MinimalWindow from './MinimalWindow.svelte';
  import CompanionArea from './CompanionArea.svelte';
  import WindowTopBar from './WindowTopBar.svelte';
  import WindowSideBar from './WindowSideBar.svelte';
  import WindowCanvasNavigationControls from './WindowCanvasNavigationControls.svelte';
  import IIIFAuthentication from './IIIFAuthentication.svelte';

  let {
    hostsWorkspaceControls = false,
    focusWindow = () => {},
    label = '',
    maximized = false,
    isFetching = false,
    sideBarOpen = false,
    view,
    windowDraggable = false,
    windowId,
    workspaceType,
    manifestError,
    workspaceControls,
    workspaceOptions,
    t = (key, options = {}) => (key === 'window' ? `Window: ${options.label}` : key),
  } = $props();

  const viewer = $state({ current: null, zoomToWorld: () => {} });
  setContext(windowViewerContext, viewer);
</script>

<section
  class={[ns(['window', sideBarOpen ? 'sidebar-open' : ''].filter(Boolean)), { maximized }]}
  id={windowId}
  aria-label={t('window', { label })}
  onfocusin={focusWindow}
>
  <Connected name="IIIFAuthentication" component={IIIFAuthentication} targetProps={{ windowId }} />
  {#if manifestError}
    <div class="manifest-error" role="alert">{manifestError}</div>
  {/if}
  <div class="content-row">
    <div class="content-column">
      <svelte:boundary>
        <Connected name="PrimaryWindow" component={PrimaryWindow} targetProps={{ view, windowId, isFetching }} />
        {#snippet failed(caught)}
          <Connected name="MinimalWindow" component={MinimalWindow} targetProps={{ windowId, label }}>
            <div class="error-content" role="alert">{caught?.message || t('error')}</div>
          </Connected>
        {/snippet}
      </svelte:boundary>
      <Connected name="CompanionArea" component={CompanionArea} targetProps={{ windowId, position: 'bottom' }} />
    </div>
    <div class="companion-right">
      <Connected name="CompanionArea" component={CompanionArea} targetProps={{ windowId, position: 'right' }} />
      <Connected name="CompanionArea" component={CompanionArea} targetProps={{ windowId, position: 'far-right' }} />
    </div>
  </div>
  <Connected name="CompanionArea" component={CompanionArea} targetProps={{ windowId, position: 'far-bottom' }} />
  <div class="bottom-bar">
    {#if hostsWorkspaceControls && workspaceControls}
      <div class="workspace-controls">{@render workspaceControls()}</div>
    {/if}
    <Connected
      name="WindowCanvasNavigationControls"
      component={WindowCanvasNavigationControls}
      targetProps={{ windowId, osdViewer: viewer, zoomToWorld: viewer.zoomToWorld }}
    />
    <div class="toolbar-end">
      <Connected
        name="WindowTopBar"
        component={WindowTopBar}
        targetProps={{ windowId, windowDraggable: workspaceType === 'mosaic' && windowDraggable }}
      />
      {#if hostsWorkspaceControls && workspaceOptions}
        <div class="workspace-options">{@render workspaceOptions()}</div>
      {/if}
      <Connected name="WindowSideBar" component={WindowSideBar} targetProps={{ windowId }} />
    </div>
  </div>
</section>

<style>
  .mirador-window {
    background: var(--mirador-background, #222);
    container-type: inline-size;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    position: relative;
    width: 100%;
  }
  .mirador-window.maximized {
    inset: 0;
    position: absolute;
    z-index: var(--mirador-modal-z-index, 1300);
  }
  .content-row {
    display: flex;
    flex: 1;
    min-height: 0;
  }
  .content-column {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
  }
  .companion-right {
    display: flex;
    flex: 0 1 auto;
    flex-direction: row;
    min-height: 0;
  }
  .bottom-bar {
    align-items: center;
    background: var(--mirador-paper, Canvas);
    border-top: 1px solid var(--mirador-divider, #888);
    display: grid;
    flex: 0 0 auto;
    grid-template-columns: minmax(max-content, 1fr) minmax(0, auto) minmax(max-content, 1fr);
    min-height: 36px;
    overflow-x: auto;
    scrollbar-width: thin;
    white-space: nowrap;
  }
  .workspace-controls,
  .workspace-options {
    align-items: center;
    display: flex;
  }
  .toolbar-end {
    align-items: center;
    display: flex;
    justify-self: end;
  }
  .manifest-error {
    background: #9f2020;
    color: white;
    padding: 0.5rem;
  }
  .error-content {
    padding: 1rem;
  }
  .window-error {
    align-items: center;
    background: #222;
    color: white;
    display: flex;
    height: 100%;
    justify-content: center;
  }
</style>

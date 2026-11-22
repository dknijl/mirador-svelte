<script>
  import ns from '../config/css-ns';
  import Connected from '../svelte/Connected.svelte';
  import ZoomControls from './ZoomControls.svelte';
  import ViewerNavigation from './ViewerNavigation.svelte';
  import ViewerInfo from './ViewerInfo.svelte';

  let { showZoomControls = false, visible = true, windowId, zoomToWorld, osdViewer, t = (key) => key } = $props();
</script>

{#if !visible}
  <div class="visually-hidden"><Connected name="ViewerInfo" component={ViewerInfo} targetProps={{ windowId }} /></div>
{:else}
  <div class={ns('canvas-nav')} role="group" aria-label={t('windowNavigation')}>
    {#if showZoomControls}
      <Connected name="ZoomControls" component={ZoomControls} targetProps={{ windowId, zoomToWorld, osdViewer }} />
    {/if}
    <Connected name="ViewerNavigation" component={ViewerNavigation} targetProps={{ windowId }} />
    <Connected name="ViewerInfo" component={ViewerInfo} targetProps={{ windowId }} />
  </div>
{/if}

<style>
  .mirador-canvas-nav {
    align-items: center;
    column-gap: 8px;
    display: flex;
    flex: 1;
    flex-wrap: nowrap;
    justify-content: center;
    padding-inline: 8px;
  }
  .mirador-canvas-nav :global(.menu-button) {
    width: 38px;
  }
  .mirador-canvas-nav :global(.mirador-osd-navigation) {
    display: flex;
    flex-shrink: 0;
  }
  .mirador-canvas-nav :global(.mirador-osd-info) {
    max-width: 38ch;
    padding-inline: 4px;
    width: auto;
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

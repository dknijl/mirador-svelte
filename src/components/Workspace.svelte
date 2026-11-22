<script>
  import Connected from '../svelte/Connected.svelte';
  import DropTarget from './IIIFDropTarget.svelte';
  import Window from './Window.svelte';
  import Mosaic from './WorkspaceMosaic.svelte';
  import Elastic from './WorkspaceElastic.svelte';
  let {
    allowNewWindows = true,
    addWindow,
    maximizedWindowIds = [],
    windowIds = [],
    workspaceId,
    workspaceType,
    t,
    workspaceControls,
    workspaceOptions,
  } = $props();
  function onDrop({ canvasId, manifestId, manifestJson }) {
    if (allowNewWindows) addWindow({ canvasId, manifestId, manifest: manifestJson });
  }
</script>

{#snippet tile(windowId)}
  <Connected name="Window" component={Window} targetProps={{ windowId, workspaceControls, workspaceOptions }} />
{/snippet}
<DropTarget {onDrop}>
  <div class="mirador-workspace-viewport">
    <h1>{t('miradorViewer')}</h1>
    {#key workspaceId}
      {#if maximizedWindowIds.length}
        {#each maximizedWindowIds as id (id)}{@render tile(id)}{/each}
      {:else if !windowIds.length}
        <div class="welcome">{t('welcome')}</div>
      {:else if workspaceType === 'elastic'}
        <Connected name="WorkspaceElastic" component={Elastic} targetProps={{ tile }} />
      {:else if workspaceType === 'mosaic'}
        <Connected name="WorkspaceMosaic" component={Mosaic} targetProps={{ tile }} />
      {:else}
        {#each windowIds as id (id)}{@render tile(id)}{/each}
      {/if}
    {/key}
  </div>
</DropTarget>

<style>
  .mirador-workspace-viewport {
    position: relative;
    width: 100%;
    height: 100%;
  }
  h1 {
    position: absolute;
    width: 1px;
    height: 1px;
    clip-path: inset(50%);
    overflow: hidden;
  }
  .welcome {
    display: grid;
    place-items: center;
    height: 100%;
    font-size: clamp(2rem, 5vw, 5rem);
  }
</style>

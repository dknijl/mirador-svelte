<script>
  import ns from '../config/css-ns';
  import Connected from '../svelte/Connected.svelte';
  import CompanionArea from './CompanionArea.svelte';
  import CollectionDialog from './CollectionDialog.svelte';
  import WindowTopBarTitle from './WindowTopBarTitle.svelte';
  import GalleryView from './GalleryView.svelte';
  import SelectCollection from './SelectCollection.svelte';
  import WindowViewer from './WindowViewer.svelte';
  import VideoViewer from './VideoViewer.svelte';
  import AudioViewer from './AudioViewer.svelte';
  import TextViewer from './TextViewer.svelte';

  let {
    audioResources = [],
    children,
    class: className,
    isCollection = false,
    isCollectionDialogVisible = false,
    isFetching = false,
    textResources = [],
    videoResources = [],
    view,
    windowId,
  } = $props();

  const viewerName = $derived.by(() => {
    if (isCollection) return 'SelectCollection';
    if (isFetching) return null;
    if (view === 'gallery') return 'GalleryView';
    if (videoResources.length) return 'VideoViewer';
    if (audioResources.length) return 'AudioViewer';
    if (textResources.length) return 'TextViewer';
    return 'WindowViewer';
  });
  const viewerComponent = $derived(
    {
      SelectCollection,
      GalleryView,
      VideoViewer,
      AudioViewer,
      TextViewer,
      WindowViewer,
    }[viewerName],
  );
</script>

<div data-testid="test-window" class={ns(['primary-window', className].filter(Boolean))}>
  <Connected name="CompanionArea" component={CompanionArea} targetProps={{ windowId, position: 'far-left' }} />
  {#if isCollectionDialogVisible}
    <Connected name="CollectionDialog" component={CollectionDialog} targetProps={{ windowId }} />
  {/if}
  <div class="viewer-layer">
    <div class="title-layer">
      <Connected name="WindowTopBarTitle" component={WindowTopBarTitle} targetProps={{ windowId }} />
    </div>
    <div class="canvas-row">
      <div class="canvas-layer">
        {#if children}
          {@render children()}
        {:else if viewerComponent}
          <Connected name={viewerName} component={viewerComponent} targetProps={{ windowId }} />
        {/if}
      </div>
      <Connected name="CompanionArea" component={CompanionArea} targetProps={{ windowId, position: 'left' }} />
    </div>
  </div>
</div>

<style>
  .mirador-primary-window {
    container-type: inline-size;
    display: flex;
    flex: 1;
    min-height: 0;
    min-width: 0;
    position: relative;
  }
  .viewer-layer {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    position: relative;
  }
  .title-layer {
    background: var(--mirador-paper, Canvas);
    padding-inline: 12px;
    text-align: end;
  }
  .canvas-row {
    display: flex;
    flex: 1;
    min-height: 0;
    position: relative;
  }
  .canvas-layer {
    display: flex;
    flex: 1;
    min-height: 0;
    min-width: 0;
    position: relative;
  }
</style>

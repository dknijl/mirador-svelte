<script>
  import { getContext } from 'svelte';
  import OpenSeadragon from 'openseadragon';
  import Connected from '../svelte/Connected.svelte';
  import Overlay from './AnnotationsOverlay.svelte';
  import ImageFailureMessage from './ImageFailureMessage.svelte';
  import Viewport from './OpenSeadragonView.svelte';
  import TileSource from './TileSource.svelte';
  import { OSDReferences } from '../plugins/OSDReferences';
  import ns from '../config/css-ns';
  import { windowViewerContext } from '../svelte/windowViewerContext';

  let {
    windowId,
    canvasWorld,
    infoResponses = [],
    nonTiledImages = [],
    osdConfig = {},
    viewerConfig,
    t,
    label,
    notifyFailure,
    fallbackImage,
    updateViewport,
    onViewer,
    children,
    failedImages,
    drawAnnotations = false,
    store,
    plugins,
  } = $props();

  const description = $props.id();
  const windowViewer = getContext(windowViewerContext);
  let viewer = $state.raw(null);
  const reference = {
    get current() {
      return viewer;
    },
  };
  $effect(() => {
    OSDReferences.set(windowId, reference);
    return () => OSDReferences.remove(windowId);
  });

  function ready(instance) {
    viewer = instance;
    if (windowViewer) windowViewer.current = instance;
    onViewer?.(instance);
  }

  function zoomToWorld(immediately = true) {
    viewer?.viewport.fitBounds(new OpenSeadragon.Rect(...canvasWorld.worldBounds()), immediately);
  }

  $effect(() => {
    if (!windowViewer) return;
    windowViewer.zoomToWorld = zoomToWorld;
    windowViewer.current = viewer;
    return () => {
      windowViewer.current = null;
      windowViewer.zoomToWorld = () => {};
    };
  });

  function saveViewport({ flip, rotation, x, y, zoom }) {
    updateViewport(windowId, { flip, rotation, x, y, zoom });
  }

  const initialViewport = $derived(viewerConfig ?? (canvasWorld.hasDimensions() ? { bounds: canvasWorld.worldBounds() } : {}));

  function coordinates(resource) {
    return {
      fitBounds: canvasWorld.contentResourceToWorldCoordinates(resource),
      index: canvasWorld.layerIndexOfImageResource(resource),
      opacity: canvasWorld.layerOpacityOfImageResource(resource),
    };
  }

  function isImage(resource) {
    const type = resource.getProperty('type');
    return type === 'Image' || type === 'dctypes:Image' || resource.getProperty('format')?.startsWith('image/');
  }
</script>

<section id={description} class={ns('osd-container')} aria-label={t('item', { label })} aria-live="polite">
  <Viewport
    restoreOnMount={canvasWorld.hasDimensions()}
    {osdConfig}
    viewerConfig={initialViewport}
    onUpdateViewport={saveViewport}
    setViewer={ready}
    describedBy={description}
    label={t('digitizedView')}
  />
  {#if viewer}
    {#each infoResponses as info (info.id)}
      {@const resource = canvasWorld.contentResource(info.id)}
      {#if resource}
        <TileSource {viewer} tileSource={info.json} {...coordinates(resource)} {notifyFailure} {fallbackImage} />
      {/if}
    {/each}
    {#each nonTiledImages as resource (resource.id)}
      {#if isImage(resource)}
        <TileSource {viewer} url={resource.id} {...coordinates(resource)} {notifyFailure} {fallbackImage} />
      {/if}
    {/each}
  {/if}
  {@render children?.(viewer, zoomToWorld)}
  {#if viewer && drawAnnotations}
    <Connected name="AnnotationsOverlay" component={Overlay} {store} {plugins} {t} targetProps={{ windowId, viewer }} />
  {/if}
  <ImageFailureMessage {t} {failedImages} imageUrls={[...infoResponses, ...nonTiledImages].map((resource) => resource.id)} />
</section>

<style>
  section {
    cursor: grab;
    flex: 1;
    position: relative;
  }
</style>

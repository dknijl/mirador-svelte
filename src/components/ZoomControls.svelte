<script>
  let {
    windowId = '',
    updateViewport = () => {},
    viewer = {},
    zoomToWorld = () => {},
    osdViewer = undefined,
    t = (key) => key,
  } = $props();
  const viewport = $derived(osdViewer?.current?.viewport);
  const currentZoom = $derived(viewport?.zoomSpring?.target?.value ?? viewer?.zoom);
  const minZoom = $derived(viewport?.getMinZoom?.());
  const maxZoom = $derived(viewport?.getMaxZoom?.());
  const currentRotation = $derived(viewport?.getRotation?.() ?? viewer?.rotation ?? 0);
  function zoomIn() {
    updateViewport(windowId, { zoom: maxZoom == null ? currentZoom * 2 : Math.min(currentZoom * 2, maxZoom) });
  }
  function zoomOut() {
    updateViewport(windowId, { zoom: minZoom == null ? currentZoom / 2 : Math.max(currentZoom / 2, minZoom) });
  }
  function rotate() {
    updateViewport(windowId, { rotation: (((currentRotation + 90) % 360) + 360) % 360 });
  }
</script>

<div class="mirador-zoom-controls">
  <button type="button" aria-label={t('zoomIn')} disabled={maxZoom != null && currentZoom >= maxZoom} onclick={zoomIn}>+</button>
  <button type="button" aria-label={t('zoomOut')} disabled={minZoom != null && currentZoom <= minZoom} onclick={zoomOut}>
    −
  </button>
  <button type="button" aria-label={t('zoomReset')} onclick={() => zoomToWorld(false)}>⌂</button>
  <button type="button" aria-label={t('rotate')} onclick={rotate}>↻</button>
</div>

<style>
  .mirador-zoom-controls {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  button {
    background: transparent;
    border: 0;
    border-radius: 50%;
    color: inherit;
    cursor: pointer;
    font: 24px/1 sans-serif;
    height: 38px;
    width: 38px;
  }
  button:hover:not(:disabled) {
    background: rgb(127 127 127 / 18%);
  }
  button:disabled {
    cursor: default;
    opacity: 0.45;
  }
</style>

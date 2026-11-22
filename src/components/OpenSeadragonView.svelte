<script>
  import { onMount } from 'svelte';
  import OpenSeadragon from 'openseadragon';
  import debounce from 'lodash/debounce';
  import applyExplicitViewport from '../lib/applyExplicitViewport';

  let { osdConfig = {}, viewerConfig = {}, onUpdateViewport, setViewer, label, describedBy, restoreOnMount = false } = $props();
  let element;
  let viewer = $state.raw(null);
  let initialized = false;
  let initialConfig;
  let lastBounds;
  let pendingFit;
  let grabbing = $state(false);

  function clearPendingFit() {
    if (pendingFit) viewer.removeHandler('tile-loaded', pendingFit);
    pendingFit = undefined;
  }

  function restore() {
    clearPendingFit();
    initialized = true;
    const viewport = viewer.viewport;
    applyExplicitViewport(viewport, viewerConfig, true);
    lastBounds = viewerConfig.bounds;
    if (viewerConfig.x == null && viewerConfig.y == null && viewerConfig.zoom == null) {
      if (lastBounds) viewport.fitBounds(new OpenSeadragon.Rect(...lastBounds), true);
      else viewport.goHome(true);
    }
  }

  function report({ eventSource: { viewport } }) {
    if (!initialized || pendingFit) return;
    onUpdateViewport?.({
      bounds: viewport.getBounds(),
      flip: viewport.getFlip(),
      rotation: viewport.getRotation(),
      x: Math.round(viewport.centerSpringX.target.value),
      y: Math.round(viewport.centerSpringY.target.value),
      zoom: viewport.zoomSpring.target.value,
    });
  }

  onMount(() => {
    const osd = OpenSeadragon({ ...osdConfig, element });
    initialConfig = viewerConfig;
    viewer = osd;
    const move = debounce((event) => osd.raiseEvent('mouse-move', event), 10);
    osd.innerTracker.moveHandler = move;
    osd.addHandler('canvas-drag', () => (grabbing = true));
    osd.addHandler('canvas-drag-end', () => (grabbing = false));
    osd.addHandler('canvas-double-click', ({ position, shift }) => {
      const factor = osdConfig.zoomPerDoubleClick;
      if (factor)
        osd.viewport.zoomTo(osd.viewport.getZoom() * (shift ? 1 / factor : factor), osd.viewport.pointFromPixel(position), false);
    });
    osd.addHandler('animation-finish', report);
    osd.world.addHandler('add-item', restore);
    osd.world.addHandler('remove-item', restore);
    if (restoreOnMount) restore();
    setViewer?.(osd);
    return () => {
      move.cancel();
      osd.removeAllHandlers();
      osd.destroy();
      viewer = null;
      setViewer?.(null);
    };
  });

  $effect(() => {
    const bounds = viewerConfig.bounds;
    const { x, y, zoom } = viewerConfig;
    if (!viewer) return;
    if (!initialized) {
      if (initialConfig !== viewerConfig) restore();
      return;
    }
    if (bounds && (!lastBounds || bounds.some((n, i) => n !== lastBounds[i]))) {
      clearPendingFit();
      lastBounds = bounds;
      pendingFit = () => {
        viewer.viewport.fitBoundsWithConstraints(new OpenSeadragon.Rect(...bounds), true);
        pendingFit = undefined;
      };
      viewer.addOnceHandler('tile-loaded', pendingFit);
    } else if (x != null && y != null && zoom != null) {
      applyExplicitViewport(viewer.viewport, viewerConfig, false);
    }
  });

  $effect(() => {
    const canvas = viewer?.canvas?.firstElementChild;
    if (canvas) {
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', label);
      if (describedBy) canvas.setAttribute('aria-describedby', describedBy);
    }
  });
</script>

<div class="osd" bind:this={element} class:grabbing></div>

<style>
  .osd {
    position: absolute;
    inset: 0;
    cursor: grab;
  }
  .grabbing {
    cursor: grabbing;
  }
</style>

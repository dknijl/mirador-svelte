<script>
  import listenToViewer from '../lib/listenToViewer';
  import debounce from 'lodash/debounce';
  import sortBy from 'lodash/sortBy';
  import xor from 'lodash/xor';
  import OpenSeadragonCanvasOverlay from '../lib/OpenSeadragonCanvasOverlay';
  import { drawAnnotationsToContext } from '../lib/drawAnnotationsToContext';
  import { buildPath2D, svgShapeElements } from '../lib/svgShapesToPath';

  let {
    annotations = [],
    canvasWorld,
    deselectAnnotation = () => {},
    drawAnnotations = true,
    drawSearchAnnotations = true,
    highlightAllAnnotations = false,
    hoverAnnotation = () => {},
    hoveredAnnotationIds = [],
    palette = {},
    searchAnnotations = [],
    selectAnnotation = () => {},
    selectedAnnotationId = null,
    viewer = null,
    windowId,
  } = $props();
  let element = $state.raw(null);
  const osdCanvasOverlay = $derived(viewer && element && new OpenSeadragonCanvasOverlay(viewer, { current: element }));

  function isAnnotationAtPoint(canvasWorld, osdCanvasOverlay, resource, canvas, point) {
    const [canvasX, canvasY] = canvasWorld.canvasToWorldCoordinates(canvas.id);
    // point is already in OSD viewport/world units (see onCanvasClick's use of
    // viewport.pointFromPixel), so only the world -> native-pixel conversion
    // is needed here -- unlike CanvasAnnotationDisplay's drawing code, there's
    // no separate screen-pixel step (overlayScale) left to undo.
    const scale = canvasWorld.canvasScale(canvas.id);
    const relativeX = (point.x - canvasX) / scale;
    const relativeY = (point.y - canvasY) / scale;

    if (resource.svgSelector) {
      const context = osdCanvasOverlay.context2d;
      const svgPaths = svgShapeElements(resource);
      return [...svgPaths].some((path) => context.isPointInPath(buildPath2D(path), relativeX, relativeY));
    }

    if (resource.fragmentSelector) {
      const [x, y, w, h] = resource.fragmentSelector;
      return x <= relativeX && relativeX <= x + w && y <= relativeY && relativeY <= y + h;
    }
    return false;
  }

  /**
   * See: https://openseadragon.github.io/docs/OpenSeadragon.Viewer.html#.event:canvas-click
   * Gestures returned from this method are likely viewer interactions such as pan and zoom,
   * not taps and clicks targeted to an annotation.
   * In deciding whether to change the display of the annotation overlay,
   * we want to ignore these irrelevant gestures.
   * @private
   */
  function isIgnoredGesture(event) {
    const pointerType = event.originalEvent?.pointerType;
    return (pointerType === 'touch' || pointerType === 'pen') && event.quick === false;
  }

  function toggleAnnotation(id) {
    if (selectedAnnotationId === id) {
      deselectAnnotation(windowId, id);
    } else {
      selectAnnotation(windowId, id);
    }
  }

  function annotationsToContext(renderedAnnotations, currentPalette) {
    drawAnnotationsToContext(renderedAnnotations, currentPalette, {
      canvasWorld,
      highlightAllAnnotations,
      hoveredAnnotationIds,
      osdCanvasOverlay,
      selectedAnnotationId,
    });
  }

  function renderAnnotations() {
    if (drawSearchAnnotations) {
      annotationsToContext(searchAnnotations, palette.search);
    }

    if (drawAnnotations) {
      annotationsToContext(annotations, palette.annotations);
    }
  }

  function updateCanvas() {
    if (!osdCanvasOverlay) return;

    osdCanvasOverlay.clear();
    osdCanvasOverlay.resize();
    osdCanvasOverlay.canvasUpdate(renderAnnotations);
  }

  function annotationsAtPoint(canvas, point) {
    const lists = [...annotations, ...searchAnnotations];
    const annos = lists
      .flatMap((l) => l.resources)
      .filter((resource) => {
        if (canvas.id !== resource.targetId) return false;

        return isAnnotationAtPoint(canvasWorld, osdCanvasOverlay, resource, canvas, point);
      });

    return annos;
  }

  function onCanvasClick(event) {
    if (isIgnoredGesture(event)) return;

    const {
      position: webPosition,
      eventSource: { viewport },
    } = event;
    const point = viewport.pointFromPixel(webPosition);

    const canvas = canvasWorld.canvasAtPoint(point);
    if (!canvas) return;
    const [, , canvasWidth, canvasHeight] = canvasWorld.canvasToWorldCoordinates(canvas.id);

    // get all the annotations that contain the click
    const annos = annotationsAtPoint(canvas, point);

    if (annos.length > 0) {
      event.preventDefaultAction = true;
    }

    if (annos.length === 1) {
      toggleAnnotation(annos[0].id);
    } else if (annos.length > 0) {
      /**
       * Try to find the "right" annotation to select after a click.
       *
       * This is perhaps a naive method, but seems to deal with rectangles and SVG shapes:
       *
       * - figure out how many points around a circle are inside the annotation shape
       * - if there's a shape with the fewest interior points, it's probably the one
       *       with the closest boundary?
       * - if there's a tie, make the circle bigger and try again.
       */
      const annosWithClickScore = (radius) => {
        const degreesToRadians = Math.PI / 180;

        return (anno) => {
          let score = 0;
          for (let degrees = 0; degrees < 360; degrees += 1) {
            const x = Math.cos(degrees * degreesToRadians) * radius + point.x;
            const y = Math.sin(degrees * degreesToRadians) * radius + point.y;

            if (isAnnotationAtPoint(canvasWorld, osdCanvasOverlay, anno, canvas, { x, y })) score += 1;
          }

          return { anno, score };
        };
      };

      let radius = 1;
      let annosWithScore = sortBy(annos.map(annosWithClickScore(radius)), 'score');

      while (radius < Math.max(canvasWidth, canvasHeight) && annosWithScore[0].score === annosWithScore[1].score) {
        radius *= 2;
        annosWithScore = sortBy(annos.map(annosWithClickScore(radius)), 'score');
      }

      toggleAnnotation(annosWithScore[0].anno.id);
    }
  }

  function onCanvasMouseMove(event) {
    if (annotations.length === 0 && searchAnnotations.length === 0) return;

    const { position: webPosition } = event;
    const point = viewer.viewport.pointFromPixel(webPosition);

    const canvas = canvasWorld.canvasAtPoint(point);
    if (!canvas) {
      hoverAnnotation(windowId, []);
      return;
    }

    const annos = annotationsAtPoint(canvas, point);

    if (
      xor(
        hoveredAnnotationIds,
        annos.map((a) => a.id),
      ).length > 0
    ) {
      hoverAnnotation(
        windowId,
        annos.map((a) => a.id),
      );
    }
  }

  $effect(() => {
    const osd = viewer;
    if (!osd || !osdCanvasOverlay) return;
    const move = debounce(onCanvasMouseMove, 10);
    const exit = () => {
      move.cancel();
      hoverAnnotation(windowId, []);
    };
    const handlers = { 'canvas-click': onCanvasClick, 'canvas-exit': exit, 'mouse-move': move, 'update-viewport': updateCanvas };
    const listeners = Object.entries(handlers).map(([event, handler]) => listenToViewer(osd, event, handler));
    return () => {
      move.cancel();
      listeners.forEach((remove) => remove());
    };
  });

  const paints = $derived({
    annotations,
    searchAnnotations,
    drawAnnotations,
    drawSearchAnnotations,
    highlightAllAnnotations,
    hoveredAnnotationIds,
    selectedAnnotationId,
    palette,
    canvasWorld,
  });
  $effect(() => {
    if (paints && osdCanvasOverlay) viewer.forceRedraw();
  });
  function attachOverlay(node) {
    viewer.canvas.appendChild(node);
    element = node;
    return () => {
      element = null;
      node.remove();
    };
  }
</script>

{#if viewer}
  <div class="overlay" style:cursor={hoveredAnnotationIds.length ? 'pointer' : undefined} {@attach attachOverlay}>
    <canvas></canvas>
  </div>
{/if}

<style>
  .overlay {
    position: absolute;
    inset: 0;
  }
</style>

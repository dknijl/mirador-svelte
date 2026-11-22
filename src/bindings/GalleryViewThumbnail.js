import * as actions from '../state/actions';
import {
  getSearchAnnotationsForWindow,
  getCurrentCanvas,
  getConfig,
  getPresentAnnotationsOnSelectedCanvases,
  getCompanionWindowsForContent,
} from '../state/selectors';

/** */
export const mapStateToProps = (state, { canvas, windowId }) => {
  const currentCanvas = getCurrentCanvas(state, { windowId });
  const searchAnnotations = getSearchAnnotationsForWindow(state, { windowId });

  const canvasAnnotations = searchAnnotations.flatMap((a) => a.resources).filter((a) => a.targetId === canvas.id);

  const hasOpenAnnotationsWindow = getCompanionWindowsForContent(state, { content: 'annotations', windowId }).length > 0;

  return {
    annotationsCount: (() => {
      if (!hasOpenAnnotationsWindow) return undefined;
      const annotations = getPresentAnnotationsOnSelectedCanvases(state, { canvasId: canvas.id });

      return annotations.reduce((v, a) => v + a.resources.filter((r) => r.targetId === canvas.id).length, 0);
    })(),
    config: getConfig(state).galleryView,
    searchAnnotationsCount: canvasAnnotations.length,
    selected: currentCanvas && currentCanvas.id === canvas.id,
  };
};

export const mapDispatchToProps = (dispatch, { canvas, id, windowId }) => ({
  focusOnCanvas: () => dispatch(actions.setWindowViewType(windowId, 'single')),
  requestCanvasAnnotations: () => dispatch(actions.requestCanvasAnnotations(windowId, canvas.id)),
  setCanvas: (...args) => dispatch(actions.setCanvas(windowId, ...args)),
});

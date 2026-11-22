import * as actions from '../state/actions';
import {
  getWindow,
  getSearchAnnotationsForWindow,
  getCompanionWindowsForContent,
  getTheme,
  getConfig,
  getPresentAnnotationsOnSelectedCanvases,
  getSelectedAnnotationId,
  getCurrentCanvasWorld,
} from '../state/selectors';

export const mapStateToProps = (state, { windowId }) => ({
  annotations: getPresentAnnotationsOnSelectedCanvases(state, { windowId }),
  canvasWorld: getCurrentCanvasWorld(state, { windowId }),
  drawAnnotations:
    getConfig(state).window.forceDrawAnnotations ||
    getCompanionWindowsForContent(state, { content: 'annotations', windowId }).length > 0,
  drawSearchAnnotations:
    getConfig(state).window.forceDrawAnnotations ||
    getCompanionWindowsForContent(state, { content: 'search', windowId }).length > 0,
  highlightAllAnnotations: getWindow(state, { windowId })?.highlightAllAnnotations,
  hoveredAnnotationIds: getWindow(state, { windowId })?.hoveredAnnotationIds,
  palette: getTheme(state).palette,
  searchAnnotations: getSearchAnnotationsForWindow(state, { windowId }),
  selectedAnnotationId: getSelectedAnnotationId(state, { windowId }),
});

export const mapDispatchToProps = {
  deselectAnnotation: actions.deselectAnnotation,
  hoverAnnotation: actions.hoverAnnotation,
  selectAnnotation: actions.selectAnnotation,
};

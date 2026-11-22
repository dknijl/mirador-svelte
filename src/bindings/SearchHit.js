import * as actions from '../state/actions';
import {
  getCanvasLabel,
  getVisibleCanvasIds,
  getResourceAnnotationForSearchHit,
  getResourceAnnotationLabel,
  getSelectedContentSearchAnnotationIds,
  getSelectedAnnotationId,
} from '../state/selectors';

export const mapStateToProps = (state, { annotationId, hit = { annotations: [] }, companionWindowId, windowId }) => {
  const realAnnoId = annotationId || hit.annotations[0];
  const hitAnnotation = getResourceAnnotationForSearchHit(state, {
    annotationUri: realAnnoId,
    companionWindowId,
    windowId,
  });

  const annotationLabel = getResourceAnnotationLabel(state, {
    annotationUri: realAnnoId,
    companionWindowId,
    windowId,
  });
  const selectedCanvasIds = getVisibleCanvasIds(state, { windowId });

  const selectedContentSearchAnnotationsIds = getSelectedContentSearchAnnotationIds(state, {
    companionWindowId,
    windowId,
  });

  const windowSelectedAnnotationId = getSelectedAnnotationId(state, { windowId });

  const allAnnoIds = [annotationId, ...hit.annotations];

  return {
    adjacent: selectedCanvasIds.includes(hitAnnotation?.targetId),
    annotation: hitAnnotation,
    annotationId: realAnnoId,
    annotationLabel: annotationLabel[0],
    canvasLabel:
      hitAnnotation &&
      getCanvasLabel(state, {
        canvasId: hitAnnotation.targetId,
        windowId,
      }),
    selected: selectedContentSearchAnnotationsIds[0] && allAnnoIds.includes(selectedContentSearchAnnotationsIds[0]),
    windowSelected: windowSelectedAnnotationId && allAnnoIds.includes(windowSelectedAnnotationId),
  };
};

export const mapDispatchToProps = (dispatch, { windowId }) => ({
  selectAnnotation: (...args) => dispatch(actions.selectAnnotation(windowId, ...args)),
});

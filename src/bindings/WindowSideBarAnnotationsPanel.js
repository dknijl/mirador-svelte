import { getVisibleCanvasIds, getAnnotationResourcesByMotivation } from '../state/selectors';

export const mapStateToProps = (state, { windowId }) => ({
  annotationCount: getAnnotationResourcesByMotivation(state, { windowId }).length,
  canvasIds: getVisibleCanvasIds(state, { windowId }),
});

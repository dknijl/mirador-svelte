import * as actions from '../state/actions';
import { getAnnotationResourcesDataForCanvas, getCanvasLabel, getSelectedAnnotationId, getConfig } from '../state/selectors';

/** For connect */
export const mapStateToProps = (state, { canvasId, windowId }) => ({
  annotations: getAnnotationResourcesDataForCanvas(state, { canvasId, windowId }),
  htmlSanitizationRuleSet: getConfig(state).annotations.htmlSanitizationRuleSet,
  label: getCanvasLabel(state, {
    canvasId,
    windowId,
  }),
  selectedAnnotationId: getSelectedAnnotationId(state, { windowId }),
});

export const mapDispatchToProps = {
  deselectAnnotation: actions.deselectAnnotation,
  hoverAnnotation: actions.hoverAnnotation,
  selectAnnotation: actions.selectAnnotation,
};

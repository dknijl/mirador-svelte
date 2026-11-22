import * as actions from '../state/actions';
import { getAnnotationResourcesByMotivation, getWindow } from '../state/selectors';

/**
 * Mapping redux state to component props using connect
 */
export const mapStateToProps = (state, { windowId }) => ({
  displayAll: getWindow(state, { windowId })?.highlightAllAnnotations,
  displayAllDisabled: getAnnotationResourcesByMotivation(state, { windowId }).length < 1,
});

/**
 * Mapping redux action dispatches to component props using connect
 */
export const mapDispatchToProps = (dispatch, { windowId }) => ({
  toggleAnnotationDisplay: () => {
    dispatch(actions.toggleAnnotationDisplay(windowId));
  },
});

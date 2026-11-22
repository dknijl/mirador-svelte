import * as actions from '../state/actions';
import {
  getSelectedContentSearchAnnotationIds,
  getSearchNumTotal,
  getSortedSearchHitsForCompanionWindow,
  getThemeDirection,
} from '../state/selectors';

export const mapStateToProps = (state, { companionWindowId, windowId }) => ({
  direction: getThemeDirection(state),
  numTotal: getSearchNumTotal(state, { companionWindowId, windowId }),
  searchHits: getSortedSearchHitsForCompanionWindow(state, { companionWindowId, windowId }),
  selectedContentSearchAnnotation: getSelectedContentSearchAnnotationIds(state, {
    companionWindowId,
    windowId,
  }),
});

export const mapDispatchToProps = (dispatch, { windowId }) => ({
  selectAnnotation: (...args) => dispatch(actions.selectAnnotation(windowId, ...args)),
});

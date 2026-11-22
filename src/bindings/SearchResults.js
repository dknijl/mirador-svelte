import * as actions from '../state/actions';
import {
  getNextSearchId,
  getSearchQuery,
  getSearchIsFetching,
  getSearchNumTotal,
  getSortedSearchHitsForCompanionWindow,
  getSortedSearchAnnotationsForCompanionWindow,
} from '../state/selectors';

export const mapStateToProps = (state, { companionWindowId, windowId }) => ({
  isFetching: getSearchIsFetching(state, { companionWindowId, windowId }),
  nextSearch: getNextSearchId(state, { companionWindowId, windowId }),
  query: getSearchQuery(state, { companionWindowId, windowId }),
  searchAnnotations: getSortedSearchAnnotationsForCompanionWindow(state, {
    companionWindowId,
    windowId,
  }),
  searchHits: getSortedSearchHitsForCompanionWindow(state, { companionWindowId, windowId }),
  searchNumTotal: getSearchNumTotal(state, { companionWindowId, windowId }),
});

export const mapDispatchToProps = {
  fetchSearch: actions.fetchSearch,
};

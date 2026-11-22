import * as actions from '../state/actions';
import { getManifestSearchService, getSearchQuery, getWindow } from '../state/selectors';

/** */
export const mapStateToProps = (state, { id, windowId }) => ({
  query: getSearchQuery(state, { companionWindowId: id, windowId }),
  searchService: getManifestSearchService(state, { windowId }),
  suggestedSearches: getWindow(state, { windowId })?.suggestedSearches,
});

/** */
export const mapDispatchToProps = (dispatch, props) => ({
  fetchSearch: (searchId, query) => dispatch(actions.fetchSearch(props.windowId, props.id, searchId, query)),
  removeSearch: () => dispatch(actions.removeSearch(props.windowId, props.id)),
});

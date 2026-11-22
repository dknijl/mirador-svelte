import * as actions from '../state/actions';
import {
  getManifestAutocompleteService,
  getManifestSearchService,
  getSearchIsFetching,
  getSearchQuery,
} from '../state/selectors';

export const mapStateToProps = (state, { companionWindowId, windowId }) => ({
  autocompleteService: getManifestAutocompleteService(state, { windowId }),
  query: getSearchQuery(state, { companionWindowId, windowId }),
  searchIsFetching: getSearchIsFetching(state, { companionWindowId, windowId }),
  searchService: getManifestSearchService(state, { windowId }),
});

export const mapDispatchToProps = {
  fetchSearch: actions.fetchSearch,
};

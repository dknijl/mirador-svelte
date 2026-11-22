import { getManifestStatus, getManifestTitle, getWindowConfig } from '../state/selectors';

/** mapStateToProps */
export const mapStateToProps = (state, { windowId }) => ({
  error: getManifestStatus(state, { windowId }).error,
  hideWindowTitle: getWindowConfig(state, { windowId }).hideWindowTitle,
  isFetching: getManifestStatus(state, { windowId }).isFetching,
  manifestTitle: getManifestTitle(state, { windowId }),
});

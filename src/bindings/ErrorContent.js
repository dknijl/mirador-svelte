import { getCompanionWindow, getManifest, getWindow, getViewer, getConfig } from '../state/selectors';

/** mapStateToProps */
export const mapStateToProps = (state, { companionWindowId, windowId }) => ({
  metadata: {
    companionWindow: companionWindowId && getCompanionWindow(state, { companionWindowId }),
    manifest: getManifest(state, { windowId }),
    viewer: getViewer(state, { windowId }),
    window: getWindow(state, { windowId }),
  },
  showJsError: getConfig(state).window.showJsError,
});

import { getManifestSummary, getManifestTitle, getManifestMetadata } from '../state/selectors';

export const mapStateToProps = (state, { companionWindowId, manifestId, windowId }) => ({
  manifestLabel: getManifestTitle(state, { companionWindowId, manifestId, windowId }),
  manifestMetadata: getManifestMetadata(state, { companionWindowId, manifestId, windowId }),
  manifestSummary: getManifestSummary(state, {
    companionWindowId,
    manifestId,
    windowId,
  }),
});

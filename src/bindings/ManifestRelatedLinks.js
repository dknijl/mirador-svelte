import {
  getManifestHomepage,
  getManifestRelated,
  getManifestRenderings,
  getManifestSeeAlso,
  getManifestUrl,
} from '../state/selectors';

export const mapStateToProps = (state, { companionWindowId, windowId }) => ({
  homepage: getManifestHomepage(state, { windowId }),
  manifestUrl: getManifestUrl(state, { windowId }),
  related: getManifestRelated(state, { windowId }),
  renderings: getManifestRenderings(state, { windowId }),
  seeAlso: getManifestSeeAlso(state, { windowId }),
});

import { getManifestTitle } from '../state/selectors';

/** */
export const mapStateToProps = (state, { windowId }) => ({
  title: getManifestTitle(state, { windowId }),
});

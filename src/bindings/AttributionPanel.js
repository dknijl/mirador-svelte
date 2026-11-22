import { getManifestLogo, getRequiredStatement, getRights } from '../state/selectors';

export const mapStateToProps = (state, { id, windowId }) => ({
  manifestLogo: getManifestLogo(state, { windowId }),
  requiredStatement: getRequiredStatement(state, { windowId }),
  rights: getRights(state, { windowId }),
});

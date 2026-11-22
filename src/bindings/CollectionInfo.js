import { getManifestTitle, getWindow } from '../state/selectors';
import * as actions from '../state/actions';

export const mapStateToProps = (state, { windowId }) => {
  const { collectionPath } = getWindow(state, { windowId }) || {};
  const manifestId = collectionPath[collectionPath.length - 1];

  return {
    collectionLabel: getManifestTitle(state, { manifestId }),
    collectionPath,
  };
};

export const mapDispatchToProps = {
  showCollectionDialog: actions.showCollectionDialog,
};

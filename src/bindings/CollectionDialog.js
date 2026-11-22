import * as actions from '../state/actions';
import { getManifest, getManifestoInstance, getSequenceBehaviors, getWindow } from '../state/selectors';

export const mapDispatchToProps = {
  addWindow: actions.addWindow,
  hideCollectionDialog: actions.hideCollectionDialog,
  setWorkspaceAddVisibility: actions.setWorkspaceAddVisibility,
  showCollectionDialog: actions.showCollectionDialog,
  updateWindow: actions.updateWindow,
};

export const mapStateToProps = (state, { windowId }) => {
  const window = getWindow(state, { windowId }) || {};
  const { collectionManifestId: manifestId, dialogCollectionPath = [] } = window;
  const manifest = manifestId ? getManifest(state, { manifestId }) : undefined;

  const collectionId = dialogCollectionPath && dialogCollectionPath[dialogCollectionPath.length - 1];
  const collection = collectionId && getManifest(state, { manifestId: collectionId });

  return {
    collection: collection && getManifestoInstance(state, { manifestId: collection.id }),
    dialogCollectionPath,
    error: manifest && manifest.error,
    isMultipart: getSequenceBehaviors(state, { manifestId }).includes('multi-part'),
    manifest: manifest && getManifestoInstance(state, { manifestId }),
    manifestId,
    open: Boolean(state.workspace?.collectionDialogOn && window.id),
    ready: manifest && !!manifest.json,
    windowId,
  };
};

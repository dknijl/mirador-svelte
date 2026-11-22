import * as actions from '../state/actions';
import { getCompanionWindow, getManifest, getManifestoInstance, getDefaultSidebarVariant, getWindow } from '../state/selectors';

export const mapStateToProps = (state, { id, windowId }) => {
  const window = getWindow(state, { windowId });
  const companionWindow = getCompanionWindow(state, { companionWindowId: id });
  const { collectionPath: localCollectionPath } = companionWindow;
  const collectionPath = localCollectionPath || window.collectionPath;
  const collectionId = collectionPath && collectionPath[collectionPath.length - 1];
  const parentCollectionId = collectionPath && collectionPath[collectionPath.length - 2];
  const collection = collectionId && getManifest(state, { manifestId: collectionId });
  const parentCollection = parentCollectionId && getManifest(state, { manifestId: parentCollectionId });
  const manifest = getManifest(state, { windowId });

  return {
    canvasNavigation: state.config.canvasNavigation,
    collection: collection && getManifestoInstance(state, { manifestId: collection.id }),
    collectionId,
    collectionPath,
    error: collection && collection.error,
    isFetching: collection && collection.isFetching,
    manifestId: manifest && manifest.id,
    parentCollection: parentCollection && getManifestoInstance(state, { manifestId: parentCollection.id }),
    ready: collection && !!collection.json,
    variant: companionWindow.variant || getDefaultSidebarVariant(state, { windowId }),
  };
};

export const mapDispatchToProps = (dispatch, { id, windowId }) => ({
  updateCompanionWindow: (...args) => dispatch(actions.updateCompanionWindow(windowId, id, ...args)),
  updateWindow: (...args) => dispatch(actions.updateWindow(windowId, ...args)),
});

import * as actions from '../state/actions';
import { getWindow } from '../state/selectors';

/** */
export const mapStateToProps = (state, { windowId }) => {
  const { collectionPath, manifestId } = getWindow(state, { windowId }) || {};

  return {
    collectionPath,
    manifestId,
  };
};

export const mapDispatchToProps = {
  showCollectionDialog: actions.showCollectionDialog,
};

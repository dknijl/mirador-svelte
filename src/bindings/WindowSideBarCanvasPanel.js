import * as actions from '../state/actions';
import {
  getCompanionWindow,
  getDefaultSidebarVariant,
  getSequenceTreeStructure,
  getWindow,
  getManifestoInstance,
  getSequence,
  getSequences,
} from '../state/selectors';

export const mapStateToProps = (state, { id, windowId }) => {
  const treeStructure = getSequenceTreeStructure(state, { windowId });
  const window = getWindow(state, { windowId });
  const { config } = state;
  const companionWindow = getCompanionWindow(state, { companionWindowId: id });
  const collectionPath = window.collectionPath || [];
  const collectionId = collectionPath && collectionPath[collectionPath.length - 1];
  const sequence = getSequence(state, { windowId });
  return {
    collection: collectionId && getManifestoInstance(state, { manifestId: collectionId }),
    config,
    sequenceId: sequence && sequence.id,
    sequences: getSequences(state, { windowId }),
    showToc: treeStructure && treeStructure.nodes && treeStructure.nodes.length > 0,
    variant: companionWindow.variant || getDefaultSidebarVariant(state, { windowId }),
  };
};

export const mapDispatchToProps = (dispatch, { id, windowId }) => ({
  showMultipart: () => dispatch(actions.addOrUpdateCompanionWindow(windowId, { content: 'collection', position: 'right' })),
  updateSequence: (sequenceId) => dispatch(actions.updateWindow(windowId, { sequenceId })),
  updateVariant: (variant) => dispatch(actions.updateCompanionWindow(windowId, id, { variant })),
});

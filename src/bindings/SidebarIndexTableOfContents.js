import {
  getLocalizedSequenceTreeStructure,
  getVisibleNodeIds,
  getExpandedNodeIds,
  getNodeIdToScrollTo,
} from '../state/selectors';
import * as actions from '../state/actions';

export const mapStateToProps = (state, { id, windowId }) => ({
  expandedNodeIds: getExpandedNodeIds(state, { companionWindowId: id, windowId }),
  nodeIdToScrollTo: getNodeIdToScrollTo(state, { companionWindowId: id, windowId }),
  treeStructure: getLocalizedSequenceTreeStructure(state, { windowId }),
  visibleNodeIds: getVisibleNodeIds(state, { companionWindowId: id, windowId }),
});

export const mapDispatchToProps = (dispatch, { id, windowId }) => ({
  expandNodes: (nodeIds) => dispatch(actions.expandNodes(windowId, id, nodeIds)),
  setCanvas: (...args) => dispatch(actions.setCanvas(...args)),
  toggleNode: (nodeId) => dispatch(actions.toggleNode(windowId, id, nodeId)),
});

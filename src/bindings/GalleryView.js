import { getCanvases, getSequenceViewingDirection } from '../state/selectors';

export const mapStateToProps = (state, { windowId }) => ({
  canvases: getCanvases(state, { windowId }),
  viewingDirection: getSequenceViewingDirection(state, { windowId }),
});

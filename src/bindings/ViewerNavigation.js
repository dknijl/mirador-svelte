import * as actions from '../state/actions';
import { getSequenceViewingDirection, getNextCanvasGrouping, getPreviousCanvasGrouping } from '../state/selectors';

/** */
export const mapStateToProps = (state, { windowId }) => ({
  hasNextCanvas: !!getNextCanvasGrouping(state, { windowId }),
  hasPreviousCanvas: !!getPreviousCanvasGrouping(state, { windowId }),
  viewingDirection: getSequenceViewingDirection(state, { windowId }),
});

export const mapDispatchToProps = (dispatch, { windowId }) => ({
  setNextCanvas: (...args) => dispatch(actions.setNextCanvas(windowId)),
  setPreviousCanvas: (...args) => dispatch(actions.setPreviousCanvas(windowId)),
});

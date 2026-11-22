import * as actions from '../state/actions';
import {
  getCompanionWindow,
  getWindow,
  getNextCanvasGrouping,
  getPreviousCanvasGrouping,
  getCanvasGroupings,
  getCanvasIndex,
  getWindowViewType,
  getSequenceViewingDirection,
  getConfig,
} from '../state/selectors';

export const mapStateToProps = (state, { windowId }) => ({
  canvasGroupings: getCanvasGroupings(state, { windowId }),
  canvasIndex: getCanvasIndex(state, { windowId }),
  hasNextCanvas: !!getNextCanvasGrouping(state, { windowId }),
  hasPreviousCanvas: !!getPreviousCanvasGrouping(state, { windowId }),
  position: getCompanionWindow(state, {
    companionWindowId: getWindow(state, { windowId })?.thumbnailNavigationId,
  }).position,
  thumbnailColumns: getWindow(state, { windowId })?.thumbnailColumns,
  thumbnailNavigation: getConfig(state).thumbnailNavigation,
  view: getWindowViewType(state, { windowId }),
  viewingDirection: getSequenceViewingDirection(state, { windowId }),
});

export const mapDispatchToProps = (dispatch, { windowId }) => ({
  setNextCanvas: (...args) => dispatch(actions.setNextCanvas(windowId)),
  setPreviousCanvas: (...args) => dispatch(actions.setPreviousCanvas(windowId)),
});

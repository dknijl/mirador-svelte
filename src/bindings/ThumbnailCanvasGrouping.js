import * as actions from '../state/actions';
import { getCurrentCanvas, getConfig } from '../state/selectors';

export const mapDispatchToProps = (dispatch, { windowId }) => ({
  setCanvas: (...args) => dispatch(actions.setCanvas(windowId, ...args)),
});

export const mapStateToProps = (state, { windowId }) => ({
  currentCanvasId: (getCurrentCanvas(state, { windowId }) || {}).id,
  showThumbnailLabels: getConfig(state).thumbnailNavigation.showThumbnailLabels,
});

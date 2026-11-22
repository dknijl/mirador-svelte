import {
  getConfig,
  getVisibleCanvasCaptions,
  getVisibleCanvasVideoResources,
  getCurrentCanvas,
  getWindow,
} from '../state/selectors';

/** */
export const mapStateToProps = (state, { windowId }) => ({
  captions: getVisibleCanvasCaptions(state, { windowId }) || [],
  canvasId: getCurrentCanvas(state, { windowId }).id,
  startTime: getWindow(state, { windowId })?.startTime,
  videoOptions: getConfig(state).videoOptions,
  videoResources: getVisibleCanvasVideoResources(state, { windowId }) || [],
});

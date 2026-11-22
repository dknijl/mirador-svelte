import {
  getConfig,
  getVisibleCanvasAudioResources,
  getVisibleCanvasCaptions,
  getCurrentCanvas,
  getWindow,
} from '../state/selectors';

/** */
export const mapStateToProps = (state, { windowId }) => ({
  audioOptions: getConfig(state).audioOptions,
  audioResources: getVisibleCanvasAudioResources(state, { windowId }) || [],
  captions: getVisibleCanvasCaptions(state, { windowId }) || [],
  canvasId: getCurrentCanvas(state, { windowId }).id,
  startTime: getWindow(state, { windowId })?.startTime,
});

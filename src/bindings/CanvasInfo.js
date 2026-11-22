import { getCanvasMetadata, getCanvasLabel, getCanvasDescription } from '../state/selectors';

export const mapStateToProps = (state, { canvasId, companionWindowId, windowId }) => ({
  canvasDescription: getCanvasDescription(state, { canvasId, companionWindowId, windowId }),
  canvasLabel: getCanvasLabel(state, { canvasId, companionWindowId, windowId }),
  canvasMetadata: getCanvasMetadata(state, { canvasId, companionWindowId, windowId }),
});

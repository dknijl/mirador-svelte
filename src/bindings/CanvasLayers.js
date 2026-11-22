import * as actions from '../state/actions';
import { getCanvasLabel, getLayers, getSortedLayers } from '../state/selectors';

/** For connect */
export const mapStateToProps = (state, { canvasId, companionWindowId, windowId }) => ({
  label: getCanvasLabel(state, { canvasId, companionWindowId, windowId }),
  layerMetadata: getLayers(state, { canvasId, companionWindowId, windowId }),
  layers: getSortedLayers(state, { canvasId, companionWindowId, windowId }),
});

export const mapDispatchToProps = {
  updateLayers: actions.updateLayers,
};

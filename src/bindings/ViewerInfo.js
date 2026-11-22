import { getCanvasLabel, getCanvases, getCanvasIndex, getCurrentCanvas } from '../state/selectors';

export const mapStateToProps = (state, props) => {
  const { windowId } = props;
  const canvases = getCanvases(state, { windowId });
  const canvasIndex = getCanvasIndex(state, { windowId });
  const canvasId = (getCurrentCanvas(state, { windowId }) || {}).id;

  return {
    canvasCount: canvases.length,
    canvasIndex,
    canvasLabel: getCanvasLabel(state, {
      canvasId,
      windowId,
    }),
  };
};

import { getVisibleCanvasIds } from '../state/selectors';

export const mapStateToProps = (state, { id, windowId }) => ({
  canvasIds: getVisibleCanvasIds(state, { windowId }),
});

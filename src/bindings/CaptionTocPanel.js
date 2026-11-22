import * as actions from '../state/actions';
import { getCaptionTocEntries, getVisibleCanvasIds } from '../state/selectors';

/** */
export const mapStateToProps = (state, { windowId }) => ({
  entries: getCaptionTocEntries(state, { windowId }),
  selectedCanvasIds: getVisibleCanvasIds(state, { windowId }),
});

/** */
export const mapDispatchToProps = (dispatch) => ({
  setCanvas: (...args) => dispatch(actions.setCanvas(...args)),
});

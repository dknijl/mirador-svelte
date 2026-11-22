import * as actions from '../state/actions';
import { getWindowConfig } from '../state/selectors';

/** mapStateToProps */
export const mapStateToProps = (state, { windowId }) => ({
  allowClose: getWindowConfig(state, { windowId }).allowClose,
  allowWindowSideBar: getWindowConfig(state, { windowId }).allowWindowSideBar,
});

export const mapDispatchToProps = (dispatch, { windowId }) => ({
  removeWindow: () => dispatch(actions.removeWindow(windowId)),
});

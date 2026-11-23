import * as actions from '../state/actions';
import { getConfig, getWindowConfig, isFocused, getWindow } from '../state/selectors';

/** mapStateToProps */
export const mapStateToProps = (state, { windowId }) => {
  const config = getWindowConfig(state, { windowId });

  return {
    allowClose: config.allowClose,
    allowFullscreen: config.allowFullscreen && !getConfig(state).workspaceControlPanel.enabled,
    allowMaximize: config.allowMaximize,
    allowTopMenuButton: config.allowTopMenuButton,
    allowWindowSideBar: config.allowWindowSideBar,
    focused: isFocused(state, { windowId }),
    maximized: config.maximized,
    sideBarOpen: (getWindow(state, { windowId }) || {}).sideBarOpen,
  };
};

export const mapDispatchToProps = (dispatch, { windowId }) => ({
  focusWindow: () => dispatch(actions.focusWindow(windowId)),
  maximizeWindow: () => dispatch(actions.maximizeWindow(windowId)),
  minimizeWindow: () => dispatch(actions.minimizeWindow(windowId)),
  removeWindow: () => dispatch(actions.removeWindow(windowId)),
  toggleWindowSideBar: () => dispatch(actions.toggleWindowSideBar(windowId)),
});

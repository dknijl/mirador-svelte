import * as actions from '../state/actions';
import { getCompanionWindow, getThemeDirection, getWindowConfig } from '../state/selectors';

export const mapStateToProps = (state, { id, windowId }) => {
  const companionWindow = getCompanionWindow(state, { companionWindowId: id });
  const { defaultSidebarPanelHeight, defaultSidebarPanelWidth } = getWindowConfig(state, {
    windowId,
  });

  return {
    ...companionWindow,
    defaultSidebarPanelHeight,
    defaultSidebarPanelWidth,
    direction: getThemeDirection(state),
    isDisplayed: companionWindow && companionWindow.content && companionWindow.content.length > 0,
  };
};

export const mapDispatchToProps = (dispatch, { windowId, id }) => ({
  onCloseClick: () => dispatch(actions.removeCompanionWindow(windowId, id)),
  updateCompanionWindow: (...args) => dispatch(actions.updateCompanionWindow(windowId, id, ...args)),
});

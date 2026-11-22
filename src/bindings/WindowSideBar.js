import { getThemeDirection, getWindow } from '../state/selectors';

export const mapStateToProps = (state, { windowId }) => ({
  direction: getThemeDirection(state),
  sideBarOpen: (getWindow(state, { windowId }) || {}).sideBarOpen,
  sideBarPanel: (getWindow(state, { windowId }) || {}).sideBarPanel,
});

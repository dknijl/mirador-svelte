import { getCompanionWindowIdsForPosition, getCompanionAreaVisibility, getThemeDirection, getWindow } from '../state/selectors';
import * as actions from '../state/actions';

/** */
export const mapStateToProps = (state, { windowId, position }) => ({
  companionAreaOpen: getCompanionAreaVisibility(state, { position, windowId }),
  companionWindowIds: getCompanionWindowIdsForPosition(state, { position, windowId }),
  direction: getThemeDirection(state),
  sideBarOpen: (getWindow(state, { windowId }) || {}).sideBarOpen,
});

export const mapDispatchToProps = {
  setCompanionAreaOpen: actions.setCompanionAreaOpen,
};

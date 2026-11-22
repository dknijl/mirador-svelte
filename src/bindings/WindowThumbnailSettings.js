import * as actions from '../state/actions';
import { getThumbnailNavigationPosition, getThemeDirection, getWindow } from '../state/selectors';

export const mapDispatchToProps = {
  updateWindow: actions.updateWindow,
  setWindowThumbnailPosition: actions.setWindowThumbnailPosition,
};

export const mapStateToProps = (state, { windowId }) => ({
  thumbnailColumns: getWindow(state, { windowId })?.thumbnailColumns,
  direction: getThemeDirection(state),
  thumbnailNavigationPosition: getThumbnailNavigationPosition(state, { windowId }),
});

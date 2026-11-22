import * as actions from '../state/actions';
import {
  getManifestStatus,
  getManifestTitle,
  getThumbnailNavigationPosition,
  getWindow,
  getFocusedWindowId,
  getWindowIds,
  getWorkspaceType,
  getWindowDraggability,
  getWindowViewType,
  getManifestError,
} from '../state/selectors';

export const mapStateToProps = (state, { windowId }) => ({
  hostsWorkspaceControls: windowId === (getFocusedWindowId(state) || getWindowIds(state)[0]),
  isFetching: getManifestStatus(state, { windowId }).isFetching,
  label: getManifestTitle(state, { windowId }),
  manifestError: getManifestError(state, { windowId }),
  maximized: (getWindow(state, { windowId }) || {}).maximized,
  sideBarOpen: (getWindow(state, { windowId }) || {}).sideBarOpen,
  thumbnailNavigationPosition: getThumbnailNavigationPosition(state, { windowId }),
  view: getWindowViewType(state, { windowId }),
  windowDraggable: getWindowDraggability(state, { windowId }),
  workspaceType: getWorkspaceType(state),
});

export const mapDispatchToProps = (dispatch, { windowId }) => ({
  focusWindow: () => dispatch(actions.focusWindow(windowId)),
});

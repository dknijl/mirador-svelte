import { getShowZoomControlsConfig, getWorkspace } from '../state/selectors';

/** */
export const mapStateToProps = (state, { windowId }) => ({
  showZoomControls: getShowZoomControlsConfig(state),
  visible: getWorkspace(state).focusedWindowId === windowId,
});

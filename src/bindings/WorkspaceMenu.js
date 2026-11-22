import * as actions from '../state/actions';
import { getShowZoomControlsConfig, getThemeIds, getWorkspace } from '../state/selectors';

export const mapDispatchToProps = {
  toggleZoomControls: actions.toggleZoomControls,
};

export const mapStateToProps = (state) => ({
  isWorkspaceAddVisible: getWorkspace(state).isWorkspaceAddVisible,
  showThemePicker: getThemeIds(state).length > 0,
  showZoomControls: getShowZoomControlsConfig(state),
});

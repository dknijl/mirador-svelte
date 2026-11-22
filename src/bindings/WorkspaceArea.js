import { getConfig, getWindowIds, getWorkspace } from '../state/selectors';

export const mapStateToProps = (state) => ({
  controlPanelVariant: getWorkspace(state).isWorkspaceAddVisible || getWindowIds(state).length > 0 ? undefined : 'wide',
  isWorkspaceAddVisible: getWorkspace(state).isWorkspaceAddVisible,
  isWorkspaceControlPanelVisible: getConfig(state).workspaceControlPanel.enabled,
  lang: getConfig(state).language,
});

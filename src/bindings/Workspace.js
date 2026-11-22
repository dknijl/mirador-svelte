import { getMaximizedWindowsIds, getWindowIds, getWorkspaceType, getConfig, getWorkspace } from '../state/selectors';
import * as actions from '../state/actions';

export const mapStateToProps = (state) => ({
  allowNewWindows: getConfig(state).workspace.allowNewWindows,
  maximizedWindowIds: getMaximizedWindowsIds(state),
  windowIds: getWindowIds(state),
  workspaceId: getWorkspace(state).id,
  workspaceType: getWorkspaceType(state),
});

export const mapDispatchToProps = {
  addWindow: actions.addWindow,
};

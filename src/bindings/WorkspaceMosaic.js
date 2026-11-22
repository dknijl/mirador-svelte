import { getManifestTitle, getWorkspace } from '../state/selectors';
import * as actions from '../state/actions';

export const mapStateToProps = (state) => ({
  getWindowLabel: (windowId) => getManifestTitle(state, { windowId }) || windowId,
  layout: getWorkspace(state).layout,
  windowIds: getWorkspace(state).windowIds,
  workspaceId: getWorkspace(state).id,
});

export const mapDispatchToProps = { updateWorkspaceMosaicLayout: actions.updateWorkspaceMosaicLayout };

import * as actions from '../state/actions';
import { getWorkspaceType } from '../state/selectors';

export const mapDispatchToProps = {
  updateWorkspace: actions.updateWorkspace,
};

export const mapStateToProps = (state) => ({ workspaceType: getWorkspaceType(state) });

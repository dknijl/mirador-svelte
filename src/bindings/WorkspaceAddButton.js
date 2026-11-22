import * as actions from '../state/actions';
import { getWindowIds, getWorkspace } from '../state/selectors';

export const mapStateToProps = (state, { width }) => {
  const { isWorkspaceAddVisible } = getWorkspace(state);
  return {
    isWorkspaceAddVisible,
    useExtendedFab: !isWorkspaceAddVisible && getWindowIds(state).length === 0,
  };
};

export const mapDispatchToProps = { setWorkspaceAddVisibility: actions.setWorkspaceAddVisibility };

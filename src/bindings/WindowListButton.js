import { getWindowIds, getWorkspace } from '../state/selectors';

/** */
export const mapStateToProps = (state) => ({
  disabled: getWorkspace(state).isWorkspaceAddVisible,
  windowCount: getWindowIds(state).length,
});

import * as actions from '../state/actions';
import { getCatalog } from '../state/selectors';

export const mapStateToProps = (state) => ({ catalog: getCatalog(state) });

export const mapDispatchToProps = {
  addResource: actions.addResource,
  setWorkspaceAddVisibility: actions.setWorkspaceAddVisibility,
};

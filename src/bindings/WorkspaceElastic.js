import * as actions from '../state/actions';
import { getElasticLayout, getWorkspace } from '../state/selectors';

export const mapStateToProps = (state) => ({
  elasticLayout: getElasticLayout(state),
  workspace: getWorkspace(state),
});

export const mapDispatchToProps = (dispatch, props) => ({
  setWorkspaceViewportDimensions: (position) => {
    dispatch(actions.setWorkspaceViewportDimensions(position));
  },
  setWorkspaceViewportPosition: (position) => {
    dispatch(actions.setWorkspaceViewportPosition(position));
  },
  updateElasticWindowLayout: (windowId, position) => {
    dispatch(actions.updateElasticWindowLayout(windowId, position));
  },
});

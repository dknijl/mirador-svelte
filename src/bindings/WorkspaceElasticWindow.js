import * as actions from '../state/actions';
import { selectCompanionWindowDimensions, getWorkspace, isFocused, getElasticLayout } from '../state/selectors';

export const mapStateToProps = (state, { windowId }) => ({
  companionWindowDimensions: selectCompanionWindowDimensions(state, { windowId }),
  focused: isFocused(state, { windowId }),
  layout: getElasticLayout(state)[windowId],
  workspace: getWorkspace(state),
});

export const mapDispatchToProps = (dispatch, props) => ({
  focusWindow: () => dispatch(actions.focusWindow(props.windowId)),
  updateElasticWindowLayout: (windowId, position) => {
    dispatch(actions.updateElasticWindowLayout(windowId, position));
  },
});

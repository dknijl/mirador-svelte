import * as actions from '../state/actions';
import { getViewer } from '../state/selectors';

export const mapStateToProps = (state, { windowId }) => ({
  viewer: getViewer(state, { windowId }),
});

export const mapDispatchToProps = { updateViewport: actions.updateViewport };

import * as actions from '../state/actions';
import { getAllowedWindowViewTypes, getWindowViewType } from '../state/selectors';

export const mapDispatchToProps = { setWindowViewType: actions.setWindowViewType };

export const mapStateToProps = (state, { windowId }) => ({
  viewTypes: getAllowedWindowViewTypes(state, { windowId }),
  windowViewType: getWindowViewType(state, { windowId }),
});

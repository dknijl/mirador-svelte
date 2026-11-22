import * as actions from '../state/actions';
import { getFocusedWindowId, getWindowIds, getWindowTitles } from '../state/selectors';

export const mapDispatchToProps = {
  focusWindow: actions.focusWindow,
};

export const mapStateToProps = (state) => ({
  focusedWindowId: getFocusedWindowId(state),
  titles: getWindowTitles(state),
  windowIds: getWindowIds(state),
});

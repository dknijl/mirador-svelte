import * as actions from '../state/actions';
import { getConfig } from '../state/selectors';

export const mapStateToProps = (state) => ({
  showThumbnailNavigationSettings: getConfig(state).thumbnailNavigation.displaySettings,
});

export const mapDispatchToProps = (dispatch) => ({
  toggleDraggingEnabled: () => dispatch(actions.toggleDraggingEnabled()),
});

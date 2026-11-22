import * as actions from '../state/actions';
import { getThemeIds, getConfig } from '../state/selectors';

export const mapDispatchToProps = (dispatch, { windowId }) => ({
  setSelectedTheme: (theme) => dispatch(actions.updateConfig({ selectedTheme: theme })),
});

export const mapStateToProps = (state) => ({
  selectedTheme: getConfig(state).selectedTheme,
  themeIds: getThemeIds(state),
});

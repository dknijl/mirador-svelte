import { getConfig } from '../state/selectors';

export const mapStateToProps = (state, { data }) => ({
  ...(getConfig(state).canvasNavigation || {}),
});

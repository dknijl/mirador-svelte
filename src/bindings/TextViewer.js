import { getConfig, getVisibleCanvasTextResources } from '../state/selectors';

/** */
export const mapStateToProps = (state, { windowId }) => ({
  textOptions: getConfig(state).textOptions,
  textResources: getVisibleCanvasTextResources(state, { windowId }) || [],
});

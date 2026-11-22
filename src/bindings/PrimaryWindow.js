import {
  getManifestoInstance,
  getVisibleCanvasAudioResources,
  getVisibleCanvasTextResources,
  getVisibleCanvasVideoResources,
  getWindow,
} from '../state/selectors';

/** */
export const mapStateToProps = (state, { windowId }) => {
  const manifestoInstance = getManifestoInstance(state, { windowId });
  return {
    audioResources: getVisibleCanvasAudioResources(state, { windowId }) || [],
    isCollection: manifestoInstance && manifestoInstance.isCollection(),
    isCollectionDialogVisible: getWindow(state, { windowId })?.collectionDialogOn,
    textResources: getVisibleCanvasTextResources(state, { windowId }) || [],
    videoResources: getVisibleCanvasVideoResources(state, { windowId }) || [],
  };
};

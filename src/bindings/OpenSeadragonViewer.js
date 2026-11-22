import * as actions from '../state/actions';
import {
  getVisibleCanvasNonTiledResources,
  getCurrentCanvas,
  getCanvasLabel,
  getViewer,
  getConfig,
  getCompanionWindowsForContent,
  selectInfoResponses,
  getCurrentCanvasWorld,
} from '../state/selectors';

export const mapStateToProps = (state, { windowId }) => {
  const canvasWorld = getCurrentCanvasWorld(state, { windowId });
  const infoResponses = selectInfoResponses(state);
  const imageServiceIds = canvasWorld.canvases.flatMap((c) => c.imageServiceIds);

  return {
    canvasWorld,
    drawAnnotations:
      getConfig(state).window.forceDrawAnnotations ||
      getCompanionWindowsForContent(state, { content: 'annotations', windowId }).length > 0 ||
      getCompanionWindowsForContent(state, { content: 'search', windowId }).length > 0,
    infoResponses: imageServiceIds
      .map((id) => infoResponses[id])
      .filter(
        (infoResponse) => infoResponse !== undefined && infoResponse.isFetching === false && infoResponse.error === undefined,
      ),
    label: getCanvasLabel(state, {
      canvasId: (getCurrentCanvas(state, { windowId }) || {}).id,
      windowId,
    }),
    nonTiledImages: getVisibleCanvasNonTiledResources(state, { windowId }),
    osdConfig: getConfig(state).osdConfig,
    viewerConfig: getViewer(state, { windowId }),
  };
};

export const mapDispatchToProps = {
  updateViewport: actions.updateViewport,
};

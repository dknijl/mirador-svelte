import * as actions from '../state/actions';
import {
  getCanvases,
  getCompanionAreaVisibility,
  getVisibleCanvases,
  getCompanionWindowsForPosition,
  getAnnotationResourcesByMotivation,
  getManifestSearchService,
  getMiradorCanvasWrapper,
  getSearchQuery,
  getWindow,
  getWindowConfig,
} from '../state/selectors';

export const mapDispatchToProps = (dispatch, { windowId }) => {
  // The panel menu sits in the window's bottom bar instead of a rail that is
  // already on screen, so choosing a panel is also what reveals it.
  const openPanel = (content) => {
    dispatch(actions.addOrUpdateCompanionWindow(windowId, { content, position: 'left' }));
    dispatch(actions.updateWindow(windowId, { sideBarOpen: true }));
  };

  return {
    addCompanionWindow: openPanel,
    closeSideBar: () => dispatch(actions.updateWindow(windowId, { sideBarOpen: false })),
  };
};

/** */
function hasLayers(canvases, getMiradorCanvas) {
  return canvases && canvases.some((c) => getMiradorCanvas(c).imageResources.length > 1);
}

/** */
function hasAnnotations(canvases, getMiradorCanvas) {
  return (
    canvases &&
    canvases.some((c) => {
      const canvas = getMiradorCanvas(c);

      return canvas.annotationListUris.length > 0 || canvas.canvasAnnotationPages.length > 0;
    })
  );
}

/** */
function hasSearchResults(state, { windowId }) {
  const { suggestedSearches } = getWindow(state, { windowId });
  const companionWindowId = getCompanionWindowsForPosition(state, {
    position: 'left',
    windowId,
  })?.[0]?.id;
  const searchQuery = getSearchQuery(state, { companionWindowId, windowId });

  return Boolean(suggestedSearches || searchQuery);
}

export const mapStateToProps = (state, { windowId }) => ({
  hasAnnotations: getAnnotationResourcesByMotivation(state, { windowId }).length > 0,
  hasAnyAnnotations: hasAnnotations(getCanvases(state, { windowId }), getMiradorCanvasWrapper(state)),
  hasAnyLayers: hasLayers(getCanvases(state, { windowId }), getMiradorCanvasWrapper(state)),
  hasCurrentLayers: hasLayers(getVisibleCanvases(state, { windowId }), getMiradorCanvasWrapper(state)),
  hasSearchResults: hasSearchResults(state, { windowId }),
  hasSearchService: getManifestSearchService(state, { windowId }) !== null,
  panels: getWindowConfig(state, { windowId }).panels,
  sideBarPanel: getCompanionAreaVisibility(state, { position: 'left', windowId })
    ? getCompanionWindowsForPosition(state, { position: 'left', windowId })[0]?.content
    : undefined,
});

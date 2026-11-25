import { all, call, delay, fork, join, put, race, select, take, takeEvery, takeLeading } from 'redux-saga/effects';
import ActionTypes from '../actions/action-types';
import {
  setContentSearchCurrentAnnotation,
  selectAnnotation,
  setWorkspaceViewportPosition,
  updateWindow,
  setCanvas,
  fetchSearch,
  receiveManifest,
  fetchInfoResponse,
  showCollectionDialog,
} from '../actions';
import {
  getSearchForWindow,
  getSearchAnnotationsForCompanionWindow,
  getCanvasGrouping,
  getWindow,
  getManifestoInstance,
  getCompanionWindowIdsForPosition,
  getManifestSearchService,
  getCanvasForAnnotation,
  getSelectedContentSearchAnnotationIds,
  getSortedSearchAnnotationsForCompanionWindow,
  getVisibleCanvasIds,
  getWorkspace,
  getElasticLayout,
  getCanvases,
  getNextCanvasGrouping,
  getRequestsConfig,
  selectInfoResponses,
  getWindowConfig,
  getMiradorCanvasWrapper,
  getMiradorManifestWrapper,
} from '../selectors';
import { fetchManifests, prefetchPublicInfoResponse } from './iiif';
import { getIiifResourceImageService } from '../../lib/iiif';

/** */
export function* fetchWindowManifest(action) {
  const { collectionPath, id, manifestId } = action.payload || action.window;

  if (!manifestId) return;

  if (action.manifest) {
    yield put(receiveManifest(manifestId, action.manifest));
  } else {
    yield call(fetchManifests, manifestId, ...(collectionPath || []));
  }

  yield call(setWindowStartingCanvas, action);
  yield call(setWindowDefaultSearchQuery, action);
  if (!collectionPath) {
    yield call(setCollectionPath, { manifestId, windowId: action.id || action.window.id });
  }
  yield call(determineAndShowCollectionDialog, manifestId, id);
}

/** */
export function* setCanvasOnNewSequence(action) {
  const windowId = action.id;
  if (!action || !action.payload || !action.payload.sequenceId) return;

  const canvases = yield select(getCanvases, { windowId });
  if (!canvases || !canvases[0] || !canvases[0].id) return;

  const thunk = yield call(setCanvas, windowId, canvases[0].id);
  yield put(thunk);
}

/** */
export function* setCollectionPath({ manifestId, windowId }) {
  const manifestoInstance = yield select(getManifestoInstance, { manifestId });

  if (manifestoInstance) {
    const partOfs = manifestoInstance.getProperty('partOf');
    const partOf = Array.isArray(partOfs) ? partOfs[0] : partOfs;

    if (partOf && partOf.id) {
      yield put(updateWindow(windowId, { collectionPath: [partOf.id] }));
    }
  }
}

/** */
export function* fetchCollectionManifests(action) {
  const { collectionPath } = action.payload;
  if (!collectionPath) return;

  yield call(fetchManifests, ...collectionPath);
}

/**
 * @private
 * `canvasIndex` is not an officially documented/supported window setting --
 * prefer `canvasId` (see the example window config in config/settings.js).
 * It's only read here for backwards compatibility with older configs/exported
 * state that may already set it.
 */
export function* setWindowStartingCanvas(action) {
  const { canvasId, canvasIndex, manifestId } = action.payload || action.window;

  const windowId = action.id || action.window.id;

  if (canvasId) {
    // Preserve viewport when initialViewerConfig exists, event if the preserveViewport OSD setting is set to false
    const preserveViewport = !!action.payload || !!action.window?.initialViewerConfig;
    // When canvasId is explicitly provided, always pass preserveViewport flag
    const thunk = yield call(setCanvas, windowId, canvasId, null, { preserveViewport });
    yield put(thunk);
  } else {
    const getMiradorManifest = yield select(getMiradorManifestWrapper);
    const manifestoInstance = yield select(getManifestoInstance, { manifestId });
    if (manifestoInstance) {
      // set the startCanvas
      const miradorManifest = getMiradorManifest(manifestoInstance);
      const startCanvas =
        miradorManifest.startCanvas || miradorManifest.canvasAt(canvasIndex || 0) || miradorManifest.canvasAt(0);
      if (startCanvas) {
        const preserveViewport = !!action.payload || !!action.window?.initialViewerConfig;
        // When canvas is calculated, only pass preserveViewport when true
        const thunk = preserveViewport
          ? yield call(setCanvas, windowId, startCanvas.id, null, { preserveViewport })
          : yield call(setCanvas, windowId, startCanvas.id);
        yield put(thunk);
      }
    }
  }
}

/** @private */
export function* setWindowDefaultSearchQuery(action) {
  // only for a brand new window
  if (!action.window || !action.window.defaultSearchQuery) return;

  const { id: windowId, defaultSearchQuery } = action.window;
  const searchService = yield select(getManifestSearchService, { windowId });
  const companionWindowIds = yield select(getCompanionWindowIdsForPosition, {
    position: 'left',
    windowId,
  });
  const companionWindowId = companionWindowIds[0];

  if (searchService && companionWindowId) {
    const searchId = searchService && `${searchService.id}?${new URLSearchParams({ q: defaultSearchQuery })}`;
    yield put(fetchSearch(windowId, companionWindowId, searchId, defaultSearchQuery));
  }
}

/** @private */
export function getAnnotationsBySearch(state, { canvasIds, companionWindowIds, windowId }) {
  const annotationBySearch = companionWindowIds.reduce((accumulator, companionWindowId) => {
    const annotations = getSearchAnnotationsForCompanionWindow(state, {
      companionWindowId,
      windowId,
    });

    const resourceAnnotations = annotations.resources;
    const hitAnnotation = resourceAnnotations.find((r) => canvasIds.includes(r.targetId));

    // eslint-disable-next-line no-param-reassign
    if (hitAnnotation) accumulator[companionWindowId] = [hitAnnotation.id];

    return accumulator;
  }, {});

  return annotationBySearch;
}

/** @private */
export function* setCurrentAnnotationsOnCurrentCanvas({ annotationId, windowId, visibleCanvases }) {
  const searches = yield select(getSearchForWindow, { windowId });
  const companionWindowIds = Object.keys(searches || {});
  if (companionWindowIds.length === 0) return;

  const annotationBySearch = yield select(getAnnotationsBySearch, {
    canvasIds: visibleCanvases,
    companionWindowIds,
    windowId,
  });

  yield all(
    Object.keys(annotationBySearch).map((companionWindowId) =>
      put(setContentSearchCurrentAnnotation(windowId, companionWindowId, annotationBySearch[companionWindowId])),
    ),
  );

  if (Object.values(annotationBySearch).length > 0) {
    // if the currently selected annotation isn't on this canvas, do a thing.
    yield put(selectAnnotation(windowId, Object.values(annotationBySearch)[0][0]));
  }
}

/** @private */
export function* panToFocusedWindow({ pan, windowId }) {
  if (!pan) return;
  const elasticLayout = yield select(getElasticLayout);
  const { x, y, width, height } = elasticLayout[windowId] || {};

  const {
    viewportPosition: { width: viewWidth, height: viewHeight },
  } = yield select(getWorkspace);

  yield put(
    setWorkspaceViewportPosition({
      x: x + width / 2 - viewWidth / 2,
      y: y + height / 2 - viewHeight / 2,
    }),
  );
}

/** @private */
export function* updateVisibleCanvases({ windowId }) {
  const { canvasId } = yield select(getWindow, { windowId });
  const visibleCanvases = yield select(getCanvasGrouping, { canvasId, windowId });

  const thunk = yield call(
    setCanvas,
    windowId,
    canvasId,
    (visibleCanvases || []).map((c) => c.id),
  );
  yield put(thunk);
}

/** @private */
export function* setCanvasOfFirstSearchResult({ companionWindowId, windowId }) {
  const { switchCanvasOnSearch } = yield select(getWindowConfig, { windowId });
  if (!switchCanvasOnSearch) {
    return;
  }
  const selectedIds = yield select(getSelectedContentSearchAnnotationIds, {
    companionWindowId,
    windowId,
  });

  if (selectedIds.length !== 0) return;

  const annotations = yield select(getSortedSearchAnnotationsForCompanionWindow, {
    companionWindowId,
    windowId,
  });
  if (!annotations || annotations.length === 0) return;

  yield put(selectAnnotation(windowId, annotations[0].id));
}

/** @private */
export function* setCanvasforSelectedAnnotation({ annotationId, windowId }) {
  const canvasIds = yield select(getVisibleCanvasIds, { windowId });
  const canvas = yield select(getCanvasForAnnotation, {
    annotationId,
    windowId,
  });

  if (!canvas || canvasIds.includes(canvas.id)) return;

  const thunk = yield call(setCanvas, windowId, canvas.id);
  yield put(thunk);
}

/** Wait for a speculative request already in flight, then use the normal path if it failed. */
function* finishVisibleInfoResponse(task, infoId, imageResource, windowId) {
  yield join(task);
  const responses = yield select(selectInfoResponses);
  if (!responses[infoId]) yield put(fetchInfoResponse({ imageResource, windowId }));
}

/** Fetch info responses for the visible canvases */
export function* fetchInfoResponses({ visibleCanvases: visibleCanvasIds, windowId }, speculative) {
  const canvases = yield select(getCanvases, { windowId });
  const infoResponses = yield select(selectInfoResponses);
  const visibleCanvases = (canvases || []).filter((c) => visibleCanvasIds.includes(c.id));
  const getMiradorCanvas = yield select(getMiradorCanvasWrapper);

  yield all(
    visibleCanvases.map((canvas) => {
      const miradorCanvas = getMiradorCanvas(canvas);
      return all(
        miradorCanvas.iiifImageResources
          .map((imageResource) => {
            const id = getIiifResourceImageService(imageResource)?.id;
            if (!id || infoResponses[id]) return false;
            const task = speculative?.get(id);
            return task
              ? call(finishVisibleInfoResponse, task, id, imageResource, windowId)
              : put(fetchInfoResponse({ imageResource, windowId }));
          })
          .filter(Boolean),
      );
    }),
  );
}

/** Warm only the next group, after the current group's metadata is ready. */
export function* prefetchNextInfoResponses({ visibleCanvases, windowId }, speculative) {
  if (!visibleCanvases?.length) return;
  const { prefetchNextImageInfo, preprocessors = [], postprocessors = [] } = yield select(getRequestsConfig);
  if (!prefetchNextImageInfo || preprocessors.length || postprocessors.length) return;
  const next = yield select(getNextCanvasGrouping, { windowId });
  if (!next?.length) return;

  const canvases = yield select(getCanvases, { windowId });
  const getMiradorCanvas = yield select(getMiradorCanvasWrapper);
  const currentIds = new Set(
    canvases
      .filter((canvas) => visibleCanvases.includes(canvas.id))
      .flatMap((canvas) => getMiradorCanvas(canvas).iiifImageResources)
      .map((resource) => getIiifResourceImageService(resource)?.id)
      .filter(Boolean),
  );

  // Debounce rapid clicks, and keep speculative requests after foreground metadata.
  yield delay(150);
  while (true) {
    const responses = yield select(selectInfoResponses);
    if ([...currentIds].every((id) => responses[id]?.json && !responses[id].degraded)) break;
    if ([...currentIds].some((id) => responses[id]?.degraded || (!responses[id]?.isFetching && !responses[id]?.json))) {
      return;
    }
    const { settled } = yield race({
      settled: take(
        (action) =>
          currentIds.has(action.infoId) &&
          [
            ActionTypes.RECEIVE_INFO_RESPONSE,
            ActionTypes.RECEIVE_DEGRADED_INFO_RESPONSE,
            ActionTypes.RECEIVE_INFO_RESPONSE_FAILURE,
            ActionTypes.REMOVE_INFO_RESPONSE,
          ].includes(action.type),
      ),
      timeout: delay(10000),
    });
    if (!settled) return;
  }

  const seen = new Set(currentIds);
  for (const canvas of next) {
    for (const resource of getMiradorCanvas(canvas).iiifImageResources) {
      const visibleNow = yield select(getVisibleCanvasIds, { windowId });
      if (visibleNow.length !== visibleCanvases.length || visibleNow.some((id, index) => id !== visibleCanvases[index])) {
        return;
      }
      const service = getIiifResourceImageService(resource);
      if (!service?.id || seen.has(service.id)) continue;
      seen.add(service.id);
      const task = yield fork(prefetchPublicInfoResponse, service);
      speculative.set(service.id, task);
      try {
        yield join(task);
      } finally {
        speculative.delete(service.id);
      }
    }
  }
}

/** */
export function* determineAndShowCollectionDialog(manifestId, windowId) {
  const manifestoInstance = yield select(getManifestoInstance, { manifestId });
  if (manifestoInstance && manifestoInstance.isCollection()) {
    yield put(showCollectionDialog(manifestId, [], windowId));
  }
}

/** Imported windows own their initial canvas and viewport, even if an older manifest request finishes later. */
function* initializeWindow(action) {
  yield race({
    initialized: call(fetchWindowManifest, action),
    replaced: take(ActionTypes.IMPORT_MIRADOR_STATE),
  });
}

export default function* windowsSaga() {
  const speculative = new Map();
  yield all([
    takeEvery(ActionTypes.ADD_WINDOW, initializeWindow),
    takeEvery(ActionTypes.UPDATE_WINDOW, initializeWindow),
    takeEvery(ActionTypes.UPDATE_WINDOW, setCanvasOnNewSequence),
    takeEvery(ActionTypes.UPDATE_WINDOW, fetchCollectionManifests),
    takeEvery(ActionTypes.SET_CANVAS, setCurrentAnnotationsOnCurrentCanvas),
    takeEvery(ActionTypes.SET_CANVAS, function* fetchVisible(action) {
      yield call(fetchInfoResponses, action, speculative);
    }),
    takeLeading(ActionTypes.SET_CANVAS, function* prefetchNext(action) {
      yield race({
        prefetch: call(prefetchNextInfoResponses, action, speculative),
        replaced: take(ActionTypes.IMPORT_MIRADOR_STATE),
      });
    }),
    takeEvery(ActionTypes.UPDATE_COMPANION_WINDOW, fetchCollectionManifests),
    takeEvery(ActionTypes.SET_WINDOW_VIEW_TYPE, updateVisibleCanvases),
    takeEvery(ActionTypes.RECEIVE_SEARCH, setCanvasOfFirstSearchResult),
    takeEvery(ActionTypes.SELECT_ANNOTATION, setCanvasforSelectedAnnotation),
    takeEvery(ActionTypes.FOCUS_WINDOW, panToFocusedWindow),
  ]);
}

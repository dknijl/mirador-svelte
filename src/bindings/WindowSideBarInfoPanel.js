import * as actions from '../state/actions';
import {
  getCompanionWindow,
  getManifestLocale,
  getMetadataLocales,
  getVisibleCanvasIds,
  getWindowConfig,
  getWindow,
} from '../state/selectors';

export const mapStateToProps = (state, { id, windowId }) => ({
  availableLocales: getMetadataLocales(state, { companionWindowId: id, windowId }),
  canvasIds: getVisibleCanvasIds(state, { windowId }),
  collectionPath: (getWindow(state, { windowId }) || {}).collectionPath,
  locale: getCompanionWindow(state, { companionWindowId: id }).locale || getManifestLocale(state, { windowId }),
  showLocalePicker: getWindowConfig(state, { windowId }).showLocalePicker,
});

/** */
export const mapDispatchToProps = (dispatch, { windowId, id }) => ({
  setLocale: (locale) => dispatch(actions.updateCompanionWindow(windowId, id, { locale })),
});

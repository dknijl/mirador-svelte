import omit from 'lodash/omit';
import mergeConfig from '../../lib/mergeConfig';
import ActionTypes from '../actions/action-types';

/**
 * configReducer - does a deep merge of the config
 */
export const layersReducer = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_LAYERS:
      return {
        ...state,
        [action.windowId]: {
          ...state[action.windowId],
          [action.canvasId]: mergeConfig((state[action.windowId] || {})[action.canvasId] || {}, action.payload),
        },
      };
    case ActionTypes.REMOVE_WINDOW:
      return omit(state, [action.windowId]);
    default:
      return state;
  }
};

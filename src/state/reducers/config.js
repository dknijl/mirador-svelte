import mergeConfig from '../../lib/mergeConfig';
import settings from '../../config/settings';
import ActionTypes from '../actions/action-types';

const initialState = { ...settings };

/**
 * configReducer - does a deep merge of the config
 */
export const configReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_CONFIG:
    case ActionTypes.IMPORT_CONFIG:
      return mergeConfig(state, action.config, { replaceArrays: true });
    case ActionTypes.SET_CONFIG:
      return action.config;
    case ActionTypes.IMPORT_MIRADOR_STATE:
      return {
        ...(action.state.config || {}),
        export: mergeConfig(state.export || {}, action.state.config?.export || {}, {
          replaceArrays: true,
        }),
        requests: mergeConfig(state.requests || {}, action.state.config?.requests || {}, {
          replaceArrays: true,
        }),
        theme: mergeConfig(state.theme || {}, action.state.config?.theme || {}, {
          replaceArrays: true,
        }),
        themes: mergeConfig(state.themes || {}, action.state.config?.themes || {}, {
          replaceArrays: true,
        }),
      };
    default:
      return state;
  }
};

import mergeConfig from '../lib/mergeConfig';
import createStore from './store';
import { importConfig } from './actions/config';
import {
  filterValidPlugins,
  getConfigFromPlugins,
  getReducersFromPlugins,
  getSagasFromPlugins,
} from '../extend/pluginPreprocessing';

/**
 * Configure Store
 */
function createPluggableStore(config, plugins = []) {
  const filteredPlugins = filterValidPlugins(plugins);

  const store = createStore(getReducersFromPlugins(filteredPlugins), getSagasFromPlugins(filteredPlugins));

  store.dispatch(importConfig(mergeConfig(getConfigFromPlugins(filteredPlugins), config)));

  return store;
}

export default createPluggableStore;

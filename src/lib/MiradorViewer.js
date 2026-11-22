import { flushSync, mount, unmount } from 'svelte';
import Viewer from '../components/Viewer.svelte';
import { filterValidPlugins } from '../extend/pluginPreprocessing';
import createPluggableStore from '../state/pluggableStore';

export default class MiradorViewer {
  constructor(config, viewerConfig = {}) {
    this.config = config;
    this.plugins = filterValidPlugins(viewerConfig.plugins || []);
    this.store = viewerConfig.store || createPluggableStore(config, this.plugins);
    if (config.id) this.renderInto(document.getElementById(config.id));
  }

  renderInto(container, options = {}) {
    if (!container) throw new Error('The viewer requires a DOM container.');
    this.unmount();
    this.container = container;
    this.root = mount(Viewer, { target: container, props: { store: this.store, plugins: this.plugins, ...options } });
    flushSync();
  }

  unmount() {
    if (!this.root) return;
    unmount(this.root);
    this.root = undefined;
    this.container = undefined;
  }
}

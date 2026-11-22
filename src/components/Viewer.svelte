<script>
  import { setContext } from 'svelte';
  import PluginTarget from '../extend/PluginTarget.svelte';
  import Connected from '../svelte/Connected.svelte';
  import { viewerContext, createViewerContext } from '../svelte/viewerContext';
  import AppProviders from './AppProviders.svelte';
  import WorkspaceArea from './WorkspaceArea.svelte';

  let { store, plugins = [], dndManager } = $props();
  const context = $derived(createViewerContext(store, () => plugins));
  setContext(viewerContext, () => context);
</script>

<PluginTarget name="Viewer" {plugins} {store}>
  <Connected name="AppProviders" component={AppProviders} targetProps={{ disableDrop: dndManager === false }}>
    <Connected name="WorkspaceArea" component={WorkspaceArea} />
  </Connected>
</PluginTarget>

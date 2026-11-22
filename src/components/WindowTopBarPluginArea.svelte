<script>
  import PluginTarget from '../extend/PluginTarget.svelte';
  let { store, plugins = [], windowId } = $props();
</script>

<PluginTarget mode="add" name="WindowTopBarPluginArea" {store} {plugins} targetProps={{ windowId }} />

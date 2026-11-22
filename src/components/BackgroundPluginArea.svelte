<script>
  import PluginTarget from '../extend/PluginTarget.svelte';
  let { store, plugins } = $props();
</script>

<div class="mirador-background-plugin-area" hidden><PluginTarget name="BackgroundPluginArea" {plugins} {store} /></div>

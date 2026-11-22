<script>
  import Connected from '../svelte/Connected.svelte';
  import WindowCanvasNavigationControls from './WindowCanvasNavigationControls.svelte';
  let { textOptions = {}, textResources = [], windowId } = $props();
</script>

<div class="mirador-text-viewer">
  <div {...textOptions}>
    {#each textResources as resource (resource.id)}
      <source src={resource.id} type={resource.getFormat()} />
    {/each}
    <Connected name="WindowCanvasNavigationControls" component={WindowCanvasNavigationControls} targetProps={{ windowId }} />
  </div>
</div>

<style>
  .mirador-text-viewer {
    align-items: center;
    display: flex;
    width: 100%;
  }
  .mirador-text-viewer > div {
    max-height: 100%;
    width: 100%;
  }
</style>

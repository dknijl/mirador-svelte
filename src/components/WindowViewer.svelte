<script>
  import Connected from '../svelte/Connected.svelte';
  import ImageViewer from './ImageViewer.svelte';

  let { windowId } = $props();
</script>

<Connected name="OpenSeadragonViewer" component={ImageViewer} targetProps={{ windowId }} />

<style>
  :global(.mirador-osd-container) {
    display: flex;
    min-height: 0;
    min-width: 0;
    width: 100%;
  }
</style>

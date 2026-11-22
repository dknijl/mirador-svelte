<script>
  import MediaViewer from './MediaViewer.svelte';
  let { videoOptions = {}, videoResources = [], captions = [], canvasId = '', startTime } = $props();
</script>

<MediaViewer tag="video" options={videoOptions} resources={videoResources} {captions} {canvasId} {startTime} />

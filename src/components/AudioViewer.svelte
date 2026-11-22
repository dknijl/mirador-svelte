<script>
  import MediaViewer from './MediaViewer.svelte';
  let { audioOptions = {}, audioResources = [], captions = [], canvasId = '', startTime } = $props();
</script>

<MediaViewer tag="audio" options={audioOptions} resources={audioResources} {captions} {canvasId} {startTime} />

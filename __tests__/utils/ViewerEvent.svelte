<script>
  import listenToViewer from '@src/lib/listenToViewer';
  let { viewer, event, handler } = $props();
  $effect(() => listenToViewer(viewer, event, (...args) => handler(...args)));
</script>

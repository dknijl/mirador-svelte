<script>
  import Connected from '../svelte/Connected.svelte';
  import IIIFThumbnail from './IIIFThumbnail.svelte';
  let { canvas, label, height = 100, width = 100 } = $props();
</script>

<Connected
  name="IIIFThumbnail"
  component={IIIFThumbnail}
  targetProps={{ resource: canvas, label, labelled: true, maxHeight: height, maxWidth: width }}
/>

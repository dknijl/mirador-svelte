<script>
  import Connected from '../svelte/Connected.svelte';
  import Thumbnail from './GalleryViewThumbnail.svelte';
  let { canvases = [], viewingDirection, windowId } = $props();
</script>

<section
  aria-label="gallery section"
  dir={viewingDirection === 'right-to-left' ? 'rtl' : 'ltr'}
  id={windowId + '-gallery'}
  class="mirador-gallery-view"
>
  {#each canvases as canvas (canvas.id)}
    <Connected name="GalleryViewThumbnail" component={Thumbnail} targetProps={{ windowId, canvas }} />
  {/each}
</section>

<style>
  section {
    display: flex;
    align-items: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
    overflow: auto;
    width: 100%;
    padding: 50px 0 50px 20px;
  }
</style>

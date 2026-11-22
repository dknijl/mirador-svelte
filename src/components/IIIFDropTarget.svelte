<script>
  import { attachIIIFDrop } from '../lib/iiifDrop';
  let { onDrop, children } = $props();
</script>

<div class="iiif-drop-target" {@attach (element) => attachIIIFDrop(element, onDrop)}>
  {@render children?.()}
</div>

<style>
  .iiif-drop-target {
    position: relative;
    height: 100%;
    width: 100%;
  }
  .iiif-drop-target:global([data-drag-over])::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 9999;
    pointer-events: none;
    background: #0007;
  }
</style>

<script>
  let { children } = $props();
</script>

<section class="companion-window-section">{@render children?.()}</section>

<style>
  .companion-window-section {
    padding-block: 16px 8px;
    padding-inline: 16px 8px;
  }
</style>

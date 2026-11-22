<script>
  let open = $state(false);
</script>

<div id="add-plugin-component-d">
  <input aria-label="Plugin input" value="hello componentD" />
  <button data-testid="plugin-button-d" onclick={() => (open = !open)} aria-expanded={open}>{open ? 'Close' : 'Open'}</button>
  {#if open}<div data-testid="plugin-content-d">Content visible</div>{/if}
</div>

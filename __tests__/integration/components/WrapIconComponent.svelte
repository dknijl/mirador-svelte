<script>
  let { children } = $props();
</script>

<div data-testid="wrapped-plugin-with-adds">
  <svg class="umbrella" viewBox="0 0 32 32">
    <title>Umbrella Icon</title><path d="M2 16a14 14 0 0 1 28 0H17v10a4 4 0 0 1-8 0h2a2 2 0 0 0 4 0V16Z" />
  </svg>{@render children()}
</div>

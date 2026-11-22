<script>
  let { src, alt, fallback, notifyFailure, store, plugins, t, failedImages, fallbackImage, ...rest } = $props();
  let failed = $state(null);
  function error() {
    failed = src;
    notifyFailure?.(src);
  }
</script>

{#if failed && src === failed}{@render fallback?.()}{:else}<img {src} {alt} {...rest} onerror={error} />{/if}

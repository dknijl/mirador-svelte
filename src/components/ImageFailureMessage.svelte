<script>
  let { imageUrls = [], failedImages, t } = $props();
</script>

{#if imageUrls.some((url) => failedImages?.has(url))}
  <p role="status" aria-live="polite">{t('imageFailedToLoad')}</p>
{/if}

<style>
  p {
    position: absolute;
    inset-block-start: 1rem;
    inset-inline-start: 50%;
    transform: translateX(-50%);
    background: var(--mirador-primary);
    color: white;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    z-index: 2;
    pointer-events: none;
  }
</style>

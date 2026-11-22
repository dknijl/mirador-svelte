<script>
  let { error = null, hideWindowTitle = false, isFetching = false, manifestTitle = '' } = $props();
</script>

{#if isFetching}
  <h2 class="title" aria-label="Loading" aria-busy="true"><span class="skeleton"></span></h2>
{:else if error}
  <svg aria-hidden="true" class="error-icon" viewBox="0 0 24 24">
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2Zm0-4h-2V7h2Z" />
  </svg>
  <h2 class="title error" title={error}>{error}</h2>
{:else if hideWindowTitle}
  <div class="empty-title"></div>
{:else}
  <h2 class="title" title={manifestTitle}>{manifestTitle}</h2>
{/if}

<style>
  .title {
    color: inherit;
    flex-grow: 1;
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
    min-width: 0;
    overflow: hidden;
    padding-inline-start: 4px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .empty-title {
    flex-grow: 1;
  }
  .error {
    color: var(--mirador-text-secondary, currentColor);
  }
  .error-icon {
    color: var(--mirador-error, #d32f2f);
    fill: currentColor;
    height: 24px;
    width: 24px;
  }
  .skeleton {
    animation: shimmer 1.5s ease-in-out 0.5s infinite;
    background: currentColor;
    display: block;
    height: 0.6em;
    opacity: 0.12;
    width: 45%;
  }
  @keyframes shimmer {
    50% {
      opacity: 0.25;
    }
  }
</style>

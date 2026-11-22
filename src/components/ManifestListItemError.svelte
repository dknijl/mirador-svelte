<script>
  let { manifestId, onDismissClick = () => {}, onTryAgainClick = () => {}, t = (key) => key } = $props();
</script>

<div class="error">
  <div>
    <strong>{t('manifestError')}</strong>
    <div class="manifest-id">{manifestId}</div>
  </div>
  <div class="actions">
    <button onclick={() => onDismissClick(manifestId)}>{t('dismiss')}</button>
    <button onclick={() => onTryAgainClick(manifestId)}>{t('tryAgain')}</button>
  </div>
</div>

<style>
  .error {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: space-between;
    width: 100%;
  }
  .manifest-id {
    overflow-wrap: anywhere;
  }
  button {
    font: inherit;
    padding: 0.4rem 0.75rem;
  }
</style>

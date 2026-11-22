<script>
  let {
    setWorkspaceAddVisibility = () => {},
    isWorkspaceAddVisible = false,
    useExtendedFab = false,
    t = (key) => key,
  } = $props();
</script>

<button
  id="addBtn"
  type="button"
  aria-label={isWorkspaceAddVisible ? t('closeAddResourceMenu') : t(useExtendedFab ? 'startHere' : 'addResource')}
  aria-pressed={isWorkspaceAddVisible}
  class="add-button"
  class:extended={useExtendedFab}
  onclick={() => setWorkspaceAddVisibility(!isWorkspaceAddVisible)}
>
  <span aria-hidden="true">{isWorkspaceAddVisible ? '×' : '+'}</span>
  {#if useExtendedFab}<span>{t('startHere')}</span>{/if}
</button>

<style>
  .add-button {
    align-items: center;
    background: var(--mirador-primary, #1976d2);
    border: 0;
    border-radius: 24px;
    color: white;
    cursor: pointer;
    display: flex;
    font: inherit;
    gap: 0.5rem;
    height: 36px;
    justify-content: center;
    min-width: 36px;
    padding: 0 0.75rem;
  }
  .add-button.extended {
    min-height: 48px;
    min-width: max-content;
    padding-inline: 1rem;
  }
  .add-button span:first-child {
    font-size: 1.4rem;
    line-height: 1;
  }
</style>

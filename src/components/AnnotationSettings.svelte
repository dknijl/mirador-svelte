<script>
  let { displayAll = false, displayAllDisabled = false, toggleAnnotationDisplay = () => {}, t = (key) => key } = $props();
</script>

<button
  class="annotation-settings"
  type="button"
  aria-label={t(displayAll ? 'displayNoAnnotations' : 'highlightAllAnnotations')}
  disabled={displayAllDisabled}
  onclick={toggleAnnotationDisplay}
>
  {displayAll ? '◉' : '◎'}
</button>

<style>
  .annotation-settings {
    background: transparent;
    border: 0;
    border-radius: 50%;
    color: inherit;
    cursor: pointer;
    min-height: 32px;
    min-width: 32px;
  }
  .annotation-settings:disabled {
    cursor: default;
    opacity: 0.45;
  }
</style>

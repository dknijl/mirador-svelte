<script>
  let { children, id, label, t = (key) => key } = $props();
  let open = $state(true);
</script>

<section class="collapsible-section" {id}>
  <h4>
    <button
      type="button"
      aria-expanded={open}
      aria-controls={`${id}-content`}
      aria-label={t(open ? 'collapseSection' : 'expandSection', { section: label })}
      onclick={() => (open = !open)}
    >
      <span aria-hidden="true">{open ? '⌄' : '›'}</span><span>{label}</span>
    </button>
  </h4>
  {#if open}<div id={`${id}-content`} class="details">{@render children?.()}</div>{/if}
</section>

<style>
  .collapsible-section h4 {
    margin: 0;
  }
  .collapsible-section button {
    align-items: center;
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    display: flex;
    gap: 8px;
    min-height: 40px;
    padding: 8px 16px;
    text-align: start;
    text-transform: uppercase;
    width: 100%;
  }
  .details {
    padding: 8px 16px;
  }
</style>

<script>
  let { languages = [], handleClick = () => {} } = $props();
</script>

{#each languages as language (language.locale)}
  <button
    role="menuitem"
    aria-current={language.current ? 'true' : undefined}
    lang={language.locale}
    onclick={() => handleClick(language.locale)}
  >
    <span aria-hidden="true">{language.current ? '✓' : ''}</span>{language.label}
  </button>
{/each}

<style>
  button {
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    font: inherit;
    padding: 0.7rem;
    text-align: start;
  }
  button:hover,
  button:focus-visible {
    background: color-mix(in srgb, CanvasText 10%, Canvas);
  }
  span {
    display: inline-block;
    width: 1.5rem;
  }
</style>

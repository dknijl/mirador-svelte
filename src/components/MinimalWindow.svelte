<script>
  import Connected from '../svelte/Connected.svelte';
  import MiradorMenuButton from './MiradorMenuButton.svelte';
  let {
    allowClose = true,
    allowWindowSideBar = true,
    ariaLabel = true,
    children,
    label = '',
    removeWindow = () => {},
    t = (key) => key,
    windowId,
  } = $props();
</script>

<section id={windowId} class="mirador-placeholder-window" aria-label={label && ariaLabel ? t('window', { label }) : undefined}>
  {@render children?.()}
  <div class="bottom-bar">
    <div class="mirador-window-top-bar">
      <h2>{label}</h2>
      {#if allowWindowSideBar}
        <button type="button" aria-label={t('toggleWindowSideBar')} disabled>
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 4h18v16H3z M15 4v16" /></svg>
        </button>
      {/if}
      {#if allowClose && removeWindow}
        <Connected
          name="MiradorMenuButton"
          component={MiradorMenuButton}
          targetProps={{ class: 'mirador-window-close', 'aria-label': t('closeWindow'), onclick: removeWindow }}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </Connected>
      {/if}
    </div>
  </div>
</section>

<style>
  .mirador-placeholder-window {
    background: var(--mirador-background, #222);
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    width: 100%;
  }
  .bottom-bar {
    background: var(--mirador-paper, Canvas);
    flex-shrink: 0;
    position: relative;
  }
  .mirador-window-top-bar {
    align-items: center;
    background: var(--mirador-paper, transparent);
    display: flex;
    gap: 4px;
    min-height: 48px;
    padding: 0 8px;
  }
  h2 {
    flex: 1;
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
    overflow: hidden;
    padding-inline-start: 8px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  button {
    align-items: center;
    background: none;
    border: 0;
    border-radius: 50%;
    color: inherit;
    cursor: pointer;
    display: grid;
    height: 40px;
    place-items: center;
    width: 40px;
  }
  button:disabled {
    opacity: 0.5;
  }
  svg {
    fill: none;
    height: 24px;
    stroke: currentColor;
    stroke-width: 2;
    width: 24px;
  }
</style>

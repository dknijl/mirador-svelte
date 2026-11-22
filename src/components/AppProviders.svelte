<script>
  let { theme, language, children, disableDrop = false } = $props();
  let root;
  let fullscreen = $state(false);
  const palette = $derived(theme?.palette ?? {});
</script>

<svelte:document onfullscreenchange={() => (fullscreen = document.fullscreenElement === root)} />
<div
  bind:this={root}
  class="mirador-viewer-root fullscreen"
  class:fullscreen-enabled={fullscreen}
  lang={language}
  dir={theme?.direction ?? 'ltr'}
  data-disable-iiif-drop={disableDrop ? '' : undefined}
  style:color-scheme={palette.mode ?? 'light'}
  style:--mirador-divider={palette.divider}
  style:--mirador-error={palette.error?.main}
  style:--mirador-secondary={palette.secondary?.main}
  style:--mirador-secondary-contrast={palette.secondary?.contrastText}
  style:--mirador-text-secondary={palette.text?.secondary}
  style:--mirador-modal-z-index={theme?.zIndex?.modal}
  style:--mirador-primary={palette.primary?.main}
  style:--mirador-paper={palette.background?.paper ?? palette.shades?.main}
  style:--mirador-background={palette.shades?.dark}
  style:--mirador-text={palette.text?.primary ?? (palette.mode === 'dark' ? '#fff' : '#222')}
  style:font-family={theme?.typography?.fontFamily ?? 'Roboto, Arial, sans-serif'}
>
  {@render children?.()}
</div>

<style>
  .mirador-viewer-root {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    color: var(--mirador-text);
    background: var(--mirador-background);
  }
  .mirador-viewer-root.fullscreen-enabled {
    width: 100%;
    height: 100%;
  }
  .mirador-viewer-root :global(button),
  .mirador-viewer-root :global(input),
  .mirador-viewer-root :global(select) {
    font: inherit;
  }
  .mirador-viewer-root :global(button) {
    cursor: pointer;
  }
  .mirador-viewer-root :global(:focus-visible) {
    outline: 2px solid var(--mirador-primary);
    outline-offset: -2px;
  }
</style>

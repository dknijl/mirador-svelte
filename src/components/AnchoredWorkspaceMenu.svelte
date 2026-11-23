<script>
  let { anchorEl, label, id, handleClose, children } = $props();

  function position(layer) {
    function update() {
      const bounds = layer.getBoundingClientRect();
      const anchor = anchorEl?.getBoundingClientRect();
      const above = anchor ? anchor.top - bounds.top : 0;
      const below = anchor ? bounds.bottom - anchor.bottom : bounds.height;
      const opensAbove = above >= below;
      layer.style.setProperty('--anchor-left', `${anchor ? anchor.left - bounds.left : 8}px`);
      layer.style.setProperty('--menu-space', `${Math.max(0, Math.max(above, below) - 14)}px`);
      layer.style.setProperty('--menu-top', opensAbove ? 'auto' : `${bounds.height - below + 6}px`);
      layer.style.setProperty('--menu-bottom', opensAbove ? `${bounds.height - above + 6}px` : 'auto');
    }

    update();
    const observer = new ResizeObserver(update);
    observer.observe(layer);
    if (anchorEl) observer.observe(anchorEl);
    window.addEventListener('scroll', update, true);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', update, true);
    };
  }
</script>

<div class="layer" {@attach position}>
  <div class="backdrop" onclick={handleClose} role="presentation"></div>
  <div
    class="menu"
    role="menu"
    tabindex="-1"
    aria-label={label}
    {id}
    onkeydown={(event) => event.key === 'Escape' && handleClose()}
  >
    {@render children()}
  </div>
</div>

<style>
  .layer {
    inset: 0;
    position: fixed;
    z-index: 1300;
  }
  .backdrop {
    inset: 0;
    position: absolute;
  }
  .menu {
    --menu-width: min(16rem, calc(100% - 16px));
    background: Canvas;
    bottom: var(--menu-bottom);
    box-shadow: 0 4px 16px #0004;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    left: clamp(8px, var(--anchor-left), calc(100% - var(--menu-width) - 8px));
    max-height: var(--menu-space);
    overflow: auto;
    overflow-wrap: anywhere;
    padding: 0.35rem;
    position: absolute;
    top: var(--menu-top);
    white-space: normal;
    width: var(--menu-width);
  }
  .menu > :global(*) {
    flex-shrink: 0;
  }
</style>

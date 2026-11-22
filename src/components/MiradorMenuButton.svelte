<script>
  let {
    selected = false,
    children,
    class: className = '',
    store,
    plugins,
    t,
    failedImages,
    fallbackImage,
    notifyFailure,
    targetProps,
    badge = false,
    BadgeProps = {},
    TooltipProps = {},
    title,
    onfocus: onFocus,
    onblur: onBlur,
    ...rest
  } = $props();
  let hovered = $state(false);
  const attributes = $derived(
    Object.fromEntries(
      Object.entries(rest).filter(
        ([key]) =>
          key.startsWith('aria-') ||
          key.startsWith('data-') ||
          ['id', 'title', 'type', 'name', 'disabled', 'tabindex', 'role', 'onclick', 'onkeydown', 'onfocus', 'onblur'].includes(
            key,
          ),
      ),
    ),
  );
</script>

<button
  class="menu-button {className}"
  class:selected
  {...attributes}
  title={title || attributes['aria-label']}
  onmouseenter={() => (hovered = true)}
  onmouseleave={() => (hovered = false)}
  onfocus={(event) => {
    hovered = true;
    onFocus?.(event);
  }}
  onblur={(event) => {
    hovered = false;
    onBlur?.(event);
  }}
>
  <span class="content">{@render children?.()}</span>
  {#if badge && BadgeProps.badgeContent !== undefined}<span class="badge">{BadgeProps.badgeContent}</span>{/if}
</button>
{#if hovered && !attributes.disabled && (title || attributes['aria-label'])}
  <span class="tooltip" role="tooltip" style:--tooltip-placement={TooltipProps.placement || 'top'}>
    {title || attributes['aria-label']}
  </span>
{/if}

<style>
  .menu-button {
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: 50%;
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    height: 40px;
    justify-content: center;
    min-width: 40px;
    padding: 0.5rem;
  }
  .menu-button:hover,
  .menu-button:focus-visible {
    background: rgb(127 127 127 / 18%);
  }
  .menu-button.selected {
    background: rgb(127 127 127 / 24%);
  }
  .content {
    display: contents;
  }
  .badge {
    border-radius: 1rem;
    font-size: 0.7em;
    padding-inline: 0.3rem;
  }
  .tooltip {
    pointer-events: none;
    background: #222;
    border-radius: 0.2rem;
    color: #fff;
    padding: 0.25rem 0.5rem;
    position: fixed;
    z-index: 1500;
  }
</style>

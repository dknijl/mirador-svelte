<script>
  let { children, icon, label, t, store, plugins, failedImages, fallbackImage, notifyFailure, ...attributes } = $props();
  let open = $state(false);
</script>

<button {...attributes} type="button" role="menuitem" aria-expanded={open} onclick={() => (open = !open)}>
  {#if icon}<span aria-hidden="true">
      {#if typeof icon === 'function'}{@render icon()}{:else}{icon}{/if}
    </span>{/if}
  <span>{label}</span><span aria-hidden="true">{open ? '▴' : '▾'}</span>
</button>
{#if open}{@render children?.()}{/if}

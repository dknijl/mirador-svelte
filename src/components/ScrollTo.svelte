<script>
  let { children, container, scrollTo, offsetTop = 0 } = $props();
  let marker;
  $effect(() => {
    if (!scrollTo) return;
    const item = marker?.nextElementSibling;
    const viewport = container ?? item?.closest('.companion-window-content, .mirador-scrollto-scrollable');
    if (!viewport || !item) return;
    const bounds = viewport.getBoundingClientRect();
    const row = item.getBoundingClientRect();
    if (row.top < bounds.top + offsetTop || row.bottom > bounds.bottom)
      viewport.scrollTo(0, viewport.scrollTop + row.top - bounds.top - bounds.height / 2 + offsetTop);
  });
</script>

<span hidden bind:this={marker}></span>{@render children?.()}

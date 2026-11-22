<script>
  /**
   * Handles IIIF Auth token validation using iframe message events.
   *
   * Svelte port of the former IIIFIFrameCommunication.jsx. Defaults mirror the
   * old default props; any extra attribute (including `aria-hidden`, `title`)
   * is forwarded to the iframe through `rest`.
   */
  let {
    frameBorder = 0,
    handleReceiveMessage = undefined,
    height = 1,
    name = undefined,
    scrolling = undefined,
    src,
    style = { visibility: 'hidden' },
    width = 1,
    ...rest
  } = $props();

  // Attaches the 'message' event listener to the window.
  $effect(() => {
    const handler = handleReceiveMessage;

    if (!handler) return undefined;

    window.addEventListener('message', handler);

    // cleanup function
    return () => window.removeEventListener('message', handler, false);
  });
</script>

<!-- iframe "title" attribute is passed in via props for accessibility -->
<iframe {frameBorder} {height} {name} {scrolling} {src} {style} {width} {...rest}></iframe>

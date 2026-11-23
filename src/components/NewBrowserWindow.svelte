<script>
  /**
   * Opens a browser window for a IIIF authentication flow and reports when it
   * closes.
   */
  let { depWindow = undefined, features = undefined, name = undefined, onClose, url } = $props();

  $effect(() => {
    const browserWindow = (depWindow || window).open(url, name, features);
    let released = false;

    const checkIfWindowClosed = setInterval(() => {
      if (!released && (!browserWindow || browserWindow.closed)) {
        released = true;
        clearInterval(checkIfWindowClosed);
        onClose(url);
      }
    }, 250);

    return () => {
      clearInterval(checkIfWindowClosed);
      if (browserWindow) browserWindow.close();
    };
  });
</script>

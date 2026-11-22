<script>
  let { incSomeNumber, manifestId } = $props();
</script>

<button id="plugin-button" onclick={incSomeNumber} type="button">Plugin:{manifestId}</button>

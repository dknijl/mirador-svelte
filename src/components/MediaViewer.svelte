<script>
  let { tag, options, resources, captions, canvasId, startTime } = $props();

  function seek(element) {
    if (startTime === undefined) return;
    const time = startTime;
    const apply = () => {
      element.currentTime = time;
    };
    if (element.readyState >= element.HAVE_METADATA) {
      apply();
      return;
    }
    element.addEventListener('loadedmetadata', apply);
    return () => element.removeEventListener('loadedmetadata', apply);
  }
</script>

<div class="media-player">
  {#key canvasId}
    <svelte:element this={tag} {...options} {@attach seek}>
      {#each resources as resource (resource.id)}
        <source src={resource.id} type={resource.getFormat()} />
      {/each}
      {#each captions as caption (caption.id)}
        <track src={caption.id} label={caption.getDefaultLabel()} srclang={caption.getProperty('language')} />
      {/each}
    </svelte:element>
  {/key}
</div>

<style>
  .media-player {
    align-items: center;
    display: flex;
    width: 100%;
  }
  .media-player > :global(audio),
  .media-player > :global(video) {
    width: 100%;
  }
  .media-player > :global(video) {
    max-height: 100%;
  }
</style>

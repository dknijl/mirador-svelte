<script>
  let {
    children,
    classes = {},
    className = '',
    class: extraClass = '',
    t,
    store,
    plugins,
    failedImages,
    fallbackImage,
    notifyFailure,
    ...attributes
  } = $props();
</script>

<div {...attributes} class={['scroll-content', className, extraClass, classes.shadowScrollDialog]}>{@render children?.()}</div>

<style>
  .scroll-content {
    overflow-y: auto;
    background:
      linear-gradient(var(--mirador-paper, Canvas) 30%, transparent),
      linear-gradient(transparent, var(--mirador-paper, Canvas) 70%) 0 100%,
      radial-gradient(farthest-side at 50% 0, #0003, transparent),
      radial-gradient(farthest-side at 50% 100%, #0003, transparent) 0 100%;
    background-attachment: local, local, scroll, scroll;
    background-repeat: no-repeat;
    background-size:
      100% 40px,
      100% 40px,
      100% 14px,
      100% 14px;
  }
</style>

<script>
  import ns from '../config/css-ns';
  let {
    canvasCount = 0,
    canvasIndex = 0,
    canvasLabel,
    t = (key, options) => `${options.current} of ${options.total}`,
  } = $props();
</script>

<div class={ns('osd-info')}>
  <span class={ns('canvas-count')} role="status">{t('pagination', { current: canvasIndex + 1, total: canvasCount })}</span>
  <span class={ns('canvas-label')} role="status">{canvasLabel ? ` • ${canvasLabel}` : ''}</span>
</div>

<style>
  .mirador-osd-info {
    box-sizing: border-box;
    overflow: hidden;
    padding: 0 16px 0.5px;
    text-overflow: ellipsis;
    unicode-bidi: plaintext;
    white-space: nowrap;
    width: 100%;
  }
</style>

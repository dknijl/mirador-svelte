<script>
  import { untrack } from 'svelte';
  import Connected from '../svelte/Connected.svelte';
  import ElasticWindow from './WorkspaceElasticWindow.svelte';
  let { workspace, elasticLayout, setWorkspaceViewportDimensions, setWorkspaceViewportPosition, tile } = $props();
  let gesture;
  let preview = $state.raw(null);
  const position = $derived(preview ?? workspace.viewportPosition ?? { x: 0, y: 0 });
  function measure(element) {
    let width, height;
    function measureRect(rect) {
      if (rect.width === width && rect.height === height) return;
      width = rect.width;
      height = rect.height;
      untrack(() => setWorkspaceViewportDimensions(rect));
    }
    measureRect(element.getBoundingClientRect());
    const observer = new ResizeObserver(([entry]) => measureRect(entry.contentRect));
    observer.observe(element);
    return () => observer.disconnect();
  }
  function start(event) {
    if (!workspace.draggingEnabled || event.button !== 0 || event.target !== event.currentTarget) return;
    gesture = { x: position.x + event.clientX, y: position.y + event.clientY, id: event.pointerId };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }
  function move(event) {
    if (gesture && gesture.id === event.pointerId) preview = { x: gesture.x - event.clientX, y: gesture.y - event.clientY };
  }
  function end(event) {
    if (!gesture || gesture.id !== event.pointerId) return;
    move(event);
    setWorkspaceViewportPosition(preview);
    cancel();
  }
  function cancel() {
    gesture = null;
    preview = null;
  }
</script>

<div class="elastic-viewport" {@attach measure}>
  <div
    class="mirador-workspace"
    role="group"
    style:width={workspace.width + 'px'}
    style:height={workspace.height + 'px'}
    style:left={-position.x - workspace.width / 2 + 'px'}
    style:top={-position.y - workspace.height / 2 + 'px'}
    onpointerdown={start}
    onpointermove={move}
    onpointerup={end}
    onpointercancel={cancel}
    onlostpointercapture={cancel}
  >
    {#each Object.keys(elasticLayout) as windowId (windowId)}
      <Connected name="WorkspaceElasticWindow" component={ElasticWindow} targetProps={{ windowId }}>
        {@render tile?.(windowId)}
      </Connected>
    {/each}
  </div>
</div>

<style>
  .elastic-viewport {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }
  .mirador-workspace {
    position: absolute;
    touch-action: none;
  }
</style>

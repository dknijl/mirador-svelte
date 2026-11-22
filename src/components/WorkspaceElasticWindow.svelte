<script>
  let {
    layout,
    workspace,
    companionWindowDimensions = { height: 0, width: 0 },
    focused = false,
    focusWindow,
    updateElasticWindowLayout,
    children,
  } = $props();
  let gesture;
  let preview = $state.raw(null);
  const box = $derived(preview ?? layout);
  const directions = ['n', 's', 'w', 'e', 'nw', 'ne', 'sw', 'se'];
  function start(event) {
    if (event.button !== 0) return;
    const side = event.target.closest('[data-resize]')?.dataset.resize;
    if (!side && (!event.target.closest('.mirador-window-top-bar') || event.target.closest('button, a, input'))) return;
    focusWindow?.();
    gesture = { side, box: { ...layout }, x: event.clientX, y: event.clientY, id: event.pointerId };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }
  function calculate(event) {
    const { box: original, side } = gesture;
    let dx = event.clientX - gesture.x;
    let dy = event.clientY - gesture.y;
    const xMin = -workspace.width / 2;
    const yMin = -workspace.height / 2;
    const xMax = -xMin - original.width - companionWindowDimensions.width;
    const yMax = -yMin - original.height - companionWindowDimensions.height;
    const result = { ...original };
    if (!side || side.includes('w')) {
      dx = Math.max(xMin - original.x, Math.min(dx, side ? original.width - 1 : xMax - original.x));
      result.x += dx;
      if (side) result.width -= dx;
    }
    if (!side || side.includes('n')) {
      dy = Math.max(yMin - original.y, Math.min(dy, side ? original.height - 1 : yMax - original.y));
      result.y += dy;
      if (side) result.height -= dy;
    }
    if (side?.includes('e')) result.width = Math.max(1, original.width + Math.min(dx, xMax - original.x));
    if (side?.includes('s')) result.height = Math.max(1, original.height + Math.min(dy, yMax - original.y));
    return result;
  }
  function move(event) {
    if (gesture && gesture.id === event.pointerId) preview = calculate(event);
  }
  function finish(event) {
    if (!gesture || gesture.id !== event.pointerId) return;
    const { x, y, width, height } = calculate(event);
    updateElasticWindowLayout(layout.windowId, gesture.side ? { x, y, width, height } : { x, y });
    cancel();
  }
  function cancel() {
    gesture = null;
    preview = null;
  }
</script>

<div
  role="group"
  class="elastic-window"
  class:focused
  style:left={box.x + workspace.width / 2 + 'px'}
  style:top={box.y + workspace.height / 2 + 'px'}
  style:height={box.height + companionWindowDimensions.height + 'px'}
  style:width={box.width + companionWindowDimensions.width + 'px'}
  onpointerdown={start}
  onpointermove={move}
  onpointerup={finish}
  onpointercancel={cancel}
  onlostpointercapture={cancel}
>
  {@render children?.()}
  {#each directions as side (side)}
    <div class="resize" data-resize={side} style:cursor={side + '-resize'}></div>
  {/each}
</div>

<style>
  .elastic-window {
    position: absolute;
  }
  .focused {
    z-index: 1;
  }
  .resize {
    position: absolute;
    touch-action: none;
  }
  [data-resize*='w'] {
    left: -4px;
    width: 8px;
  }
  [data-resize*='e'] {
    right: -4px;
    width: 8px;
  }
  [data-resize*='n'] {
    top: -4px;
    height: 8px;
  }
  [data-resize*='s'] {
    bottom: -4px;
    height: 8px;
  }
  [data-resize='n'],
  [data-resize='s'] {
    left: 4px;
    right: 4px;
  }
  [data-resize='w'],
  [data-resize='e'] {
    top: 4px;
    bottom: 4px;
  }
  .elastic-window :global(.mirador-window-top-bar) {
    touch-action: none;
  }
</style>

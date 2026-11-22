<script>
  let {
    canvasId,
    index = 0,
    label = '',
    layers = [],
    layerMetadata = {},
    totalSize = 1,
    updateLayers = () => {},
    windowId,
    t = (key) => key,
  } = $props();
  let draggingLayerId = $state(null);
  function patch(layer, values) {
    updateLayers(windowId, canvasId, { [layer.id]: values });
  }
  function move(layer, offset) {
    const from = layers.findIndex(({ id }) => id === layer.id);
    const to = Math.max(0, Math.min(layers.length - 1, from + offset));
    const ordered = [...layers];
    const [item] = ordered.splice(from, 1);
    ordered.splice(to, 0, item);
    updateLayers(
      windowId,
      canvasId,
      Object.fromEntries(ordered.map((resource, layerIndex) => [resource.id, { index: layerIndex }])),
    );
  }
  function reorderWithKeyboard(event, layer) {
    if (event.code === 'Space') {
      event.preventDefault();
      draggingLayerId = draggingLayerId === layer.id ? null : layer.id;
      return;
    }
    const key = event.key || event.code;
    if (draggingLayerId !== layer.id || !['ArrowUp', 'ArrowDown'].includes(key)) return;
    event.preventDefault();
    move(layer, key === 'ArrowUp' ? -1 : 1);
  }
  function resourceLabel(resource) {
    const labelValue = resource.getLabel?.();
    return labelValue?.getValue?.('') || resource.id;
  }
</script>

{#if totalSize > 1}<h4>{t('annotationCanvasLabel', { context: `${index + 1}/${totalSize}`, label })}</h4>{/if}
<ul>
  {#each layers as resource, i (resource.id)}
    {@const layer = { opacity: 1, visibility: Boolean(resource.preferred), ...(layerMetadata[resource.id] || {}) }}
    <li>
      <div class="layer-head">
        <strong>{resourceLabel(resource) || i + 1}</strong>
        <button
          type="button"
          aria-label={t(layer.visibility ? 'layer_hide' : 'layer_show')}
          onclick={() => patch(resource, { visibility: !layer.visibility })}
        >
          {layer.visibility ? '◉' : '○'}
        </button>
        <button
          type="button"
          data-rfd-drag-handle-draggable-id={resource.id}
          onkeydown={(event) => reorderWithKeyboard(event, resource)}
          disabled={i === 0}
          aria-label={t('layer_moveToBackground')}
          onclick={() => move(resource, -i)}
        >
          ↑
        </button>
        <button
          type="button"
          disabled={i === layers.length - 1}
          aria-label={t('layer_moveToFront')}
          onclick={() => move(resource, layers.length - 1 - i)}
        >
          ↓
        </button>
      </div>
      <label>
        {t('layer_opacity')}
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={Math.round(layer.opacity * 100)}
          disabled={!layer.visibility}
          oninput={(event) => patch(resource, { opacity: Number(event.currentTarget.value) / 100 })}
        />
        <input
          type="number"
          aria-label={t('layer_opacity')}
          min="0"
          max="100"
          value={Math.round(layer.opacity * 100)}
          disabled={!layer.visibility}
          oninput={(event) => patch(resource, { opacity: Number(event.currentTarget.value) / 100 })}
          onchange={(event) => patch(resource, { opacity: Number(event.currentTarget.value) / 100 })}
        />%
      </label>
    </li>
  {/each}
</ul>

<style>
  h4 {
    font-size: 0.75rem;
    font-weight: 500;
    padding: 16px 8px 4px;
    text-transform: uppercase;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    border-bottom: 1px solid color-mix(in srgb, currentColor 15%, transparent);
    padding: 12px 16px;
  }
  .layer-head,
  label {
    align-items: center;
    display: flex;
    gap: 6px;
  }
  .layer-head strong {
    flex: 1;
  }
  button {
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    min-height: 30px;
    min-width: 30px;
  }
  label {
    font-size: 0.85rem;
    margin-top: 8px;
  }
  input[type='range'] {
    flex: 1;
  }
  input[type='number'] {
    width: 4em;
  }
</style>

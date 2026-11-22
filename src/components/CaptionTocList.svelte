<script>
  let { emptyLabel, entries = [], selectedCanvasIds = [], windowId, onSelectCanvas = () => {} } = $props();
  const currentCanvasIds = $derived(new Set(selectedCanvasIds));
</script>

<div class="caption-toc">
  {#if entries.length === 0}
    <p>{emptyLabel}</p>
  {:else}
    <ul>
      {#each entries as entry (entry.id)}
        {@const current = Boolean(entry.canvasId && currentCanvasIds.has(entry.canvasId))}
        <li>
          <button
            type="button"
            class:current
            class:range={entry.kind === 'range'}
            style:padding-inline-start={`${12 + entry.depth * 20}px`}
            aria-current={current ? 'true' : undefined}
            onclick={() => onSelectCanvas(windowId, entry.canvasId)}
          >
            {entry.label || '—'}
            {#if entry.kind === 'range' && entry.canvasCount > 1}<span>({entry.canvasCount})</span>{/if}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .caption-toc {
    padding-block: 4px;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  button {
    background: none;
    border: 0;
    color: inherit;
    cursor: pointer;
    display: block;
    font: inherit;
    padding: 8px 12px 8px 0;
    text-align: start;
    width: 100%;
  }
  button:hover {
    background: color-mix(in srgb, currentColor 8%, transparent);
  }
  button.current,
  button.range {
    font-weight: 600;
  }
  button span {
    font-weight: 400;
    margin-inline-start: 0.35em;
    opacity: 0.75;
  }
  p {
    margin: 0;
    padding: 12px;
  }
</style>

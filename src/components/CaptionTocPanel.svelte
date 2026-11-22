<script>
  /**
   * Right-pane table of contents built from the manifest's caption data
   * (IIIF structures plus canvas labels).
   *
   * `entries` comes from `buildCaptionToc` (see src/svelte/captionToc.js) and
   * is already flat: `depth` carries the nesting, `canvasId` the target canvas.
   * User-facing strings arrive as props so this component never has to reach
   * for the React i18n instance.
   */
  let { emptyLabel, entries = [], selectedCanvasIds = [], windowId, onSelectCanvas = () => {} } = $props();

  const currentCanvasIds = $derived(new Set(selectedCanvasIds));

  /** @param {object} entry */
  const isCurrent = (entry) => Boolean(entry.canvasId && currentCanvasIds.has(entry.canvasId));
</script>

<div class="mirador-caption-toc">
  {#if entries.length === 0}
    <p class="mirador-caption-toc-empty">{emptyLabel}</p>
  {:else}
    <ul class="mirador-caption-toc-list">
      {#each entries as entry (entry.id)}
        <li>
          <button
            type="button"
            class="mirador-caption-toc-entry"
            class:mirador-caption-toc-entry-current={isCurrent(entry)}
            class:mirador-caption-toc-entry-range={entry.kind === 'range'}
            style:padding-inline-start={`${0.75 + entry.depth * 1.25}rem`}
            aria-current={isCurrent(entry) ? 'true' : undefined}
            onclick={() => onSelectCanvas?.(windowId, entry.canvasId)}
          >
            {entry.label || '—'}
            {#if entry.kind === 'range' && entry.canvasCount > 1}
              <span class="mirador-caption-toc-count">({entry.canvasCount})</span>
            {/if}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .mirador-caption-toc {
    padding-block: 0.25rem;
  }

  .mirador-caption-toc-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .mirador-caption-toc-entry {
    background: none;
    border: 0;
    color: inherit;
    cursor: pointer;
    display: block;
    font: inherit;
    padding-block: 0.5rem;
    padding-inline-end: 0.75rem;
    text-align: start;
    width: 100%;
  }

  .mirador-caption-toc-entry:hover {
    background-color: rgb(0 0 0 / 6%);
  }

  .mirador-caption-toc-entry:focus-visible {
    outline: 2px solid currentcolor;
    outline-offset: -2px;
  }

  .mirador-caption-toc-entry-current,
  .mirador-caption-toc-entry-range {
    font-weight: 600;
  }

  .mirador-caption-toc-count {
    font-weight: 400;
    margin-inline-start: 0.35em;
    opacity: 0.75;
  }

  .mirador-caption-toc-empty {
    margin: 0;
    padding: 0.75rem;
  }

  @media (prefers-color-scheme: dark) {
    .mirador-caption-toc-entry:hover {
      background-color: rgb(255 255 255 / 12%);
    }
  }
</style>

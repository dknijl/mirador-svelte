<script>
  import Connected from '../svelte/Connected.svelte';
  import CompanionWindow from './CompanionWindow.svelte';
  import SidebarIndexTableOfContents from './SidebarIndexTableOfContents.svelte';
  import SidebarIndexList from './SidebarIndexList.svelte';
  let {
    canvases = [],
    selectedCanvasIds = [],
    setCanvas = () => {},
    collection = null,
    id,
    showMultipart = () => {},
    sequenceId = null,
    sequences = [],
    variant = 'item',
    showToc = false,
    updateSequence = () => {},
    updateVariant = () => {},
    windowId,
    t = (key) => key,
  } = $props();
  const resourceLabel = (resource) => resource?.getLabel?.()?.getValue?.('') || resource?.id || '';
</script>

{#snippet titleControls()}
  {#if (sequences ?? []).length > 1}
    <label class="sequence">
      <span class="sr-only">{t('sequence')}</span><select
        name="sequenceId"
        value={sequenceId}
        data-testid="sequence-select"
        onchange={(event) => updateSequence(event.currentTarget.value)}
      >
        {#each sequences ?? [] as sequence (sequence.id)}<option value={sequence.id}>{resourceLabel(sequence)}</option>{/each}
      </select>
    </label>
  {/if}
  <div class="tabs" role="tablist">
    {#if showToc}<button
        type="button"
        role="tab"
        aria-selected={variant === 'tableOfContents'}
        aria-label={t('tableOfContentsList')}
        onclick={() => updateVariant('tableOfContents')}
      >
        ☷
      </button>{/if}
    <button
      type="button"
      role="tab"
      aria-selected={variant === 'item'}
      aria-label={t('itemList')}
      onclick={() => updateVariant('item')}
    >
      ☰
    </button>
    <button
      type="button"
      role="tab"
      aria-selected={variant === 'thumbnail'}
      aria-label={t('thumbnailList')}
      onclick={() => updateVariant('thumbnail')}
    >
      ▦
    </button>
  </div>
{/snippet}

{#snippet body()}
  {#if collection}<button class="collection" type="button" onclick={showMultipart}>{resourceLabel(collection)} →</button>{/if}
  {#if variant === 'tableOfContents'}
    <Connected name="SidebarIndexTableOfContents" component={SidebarIndexTableOfContents} targetProps={{ id, windowId }} />
  {:else}
    <Connected
      name="SidebarIndexList"
      component={SidebarIndexList}
      targetProps={{ id, windowId, canvases, selectedCanvasIds, setCanvas, variant }}
    />
  {/if}
{/snippet}

<Connected
  name="CompanionWindow"
  component={CompanionWindow}
  targetProps={{ title: t('contents'), windowId, id, titleControls }}
  children={body}
/>

<style>
  .tabs {
    display: flex;
  }
  .tabs button {
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    min-height: 32px;
    min-width: 32px;
  }
  .tabs button[aria-selected='true'] {
    border-bottom: 2px solid currentcolor;
  }
  .collection {
    align-items: center;
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    padding: 12px;
    width: 100%;
  }
  .sr-only {
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    width: 1px;
  }
</style>

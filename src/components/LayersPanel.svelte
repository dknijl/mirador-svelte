<script>
  import Connected from '../svelte/Connected.svelte';
  import CompanionWindow from './CompanionWindow.svelte';
  import CanvasLayers from './CanvasLayers.svelte';
  let { canvasIds = [], id, windowId, t = (key) => key } = $props();
</script>

{#snippet body()}
  {#each canvasIds as canvasId, index (canvasId)}
    <Connected
      name="CanvasLayers"
      component={CanvasLayers}
      targetProps={{ canvasId, index, totalSize: canvasIds.length, windowId }}
    />
  {/each}
{/snippet}

<Connected name="CompanionWindow" component={CompanionWindow} targetProps={{ title: t('layers'), id, windowId }}>
  {@render body()}
</Connected>

<script>
  import Connected from '../svelte/Connected.svelte';
  import CompanionWindow from './CompanionWindow.svelte';
  import CompanionWindowSection from './CompanionWindowSection.svelte';
  import AnnotationSettings from './AnnotationSettings.svelte';
  import CanvasAnnotations from './CanvasAnnotations.svelte';
  let { annotationCount = 0, canvasIds = [], windowId, id, t = (key) => key } = $props();
</script>

{#snippet titleControls()}
  <Connected name="AnnotationSettings" component={AnnotationSettings} targetProps={{ windowId }} />
{/snippet}

{#snippet body()}
  <CompanionWindowSection>
    <p>{t('showingNumAnnotations', { count: annotationCount, number: annotationCount })}</p>
  </CompanionWindowSection>
  {#each canvasIds as canvasId, index (canvasId)}
    <Connected
      name="CanvasAnnotations"
      component={CanvasAnnotations}
      targetProps={{ canvasId, index, totalSize: canvasIds.length, windowId }}
    />
  {/each}
{/snippet}

<Connected
  name="CompanionWindow"
  component={CompanionWindow}
  targetProps={{
    title: t('annotations'),
    paperClassName: 'mirador-window-sidebar-annotation-panel',
    windowId,
    id,
    titleControls,
  }}
>
  {@render body()}
</Connected>

<style>
  p {
    font-size: 0.875rem;
    margin: 0;
  }
</style>

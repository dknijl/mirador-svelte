<script>
  import Connected from '../svelte/Connected.svelte';
  import CaptionTocList from './CaptionTocList.svelte';
  import CompanionWindow from './CompanionWindow.svelte';

  let { entries = [], id, selectedCanvasIds = [], setCanvas = () => {}, windowId, t = (key) => key } = $props();
</script>

{#snippet panel()}
  <CaptionTocList emptyLabel={t('noTableOfContents')} {entries} onSelectCanvas={setCanvas} {selectedCanvasIds} {windowId} />
{/snippet}

<Connected name="CompanionWindow" component={CompanionWindow} targetProps={{ id, windowId, title: t('tableOfContentsList') }}>
  {@render panel()}
</Connected>

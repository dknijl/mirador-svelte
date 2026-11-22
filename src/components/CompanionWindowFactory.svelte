<script>
  import Connected from '../svelte/Connected.svelte';
  import AnnotationPanel from './WindowSideBarAnnotationsPanel.svelte';
  import AttributionPanel from './AttributionPanel.svelte';
  import CanvasPanel from './WindowSideBarCanvasPanel.svelte';
  import CaptionTocPanel from './CaptionTocPanel.svelte';
  import CollectionPanel from './WindowSideBarCollectionPanel.svelte';
  import CustomPanel from './CustomPanel.svelte';
  import InfoPanel from './WindowSideBarInfoPanel.svelte';
  import LayersPanel from './LayersPanel.svelte';
  import SearchPanel from './SearchPanel.svelte';
  import ThumbnailNavigation from './ThumbnailNavigation.svelte';
  import SveltePlugin from '../extend/SveltePlugin.svelte';

  let { content, id, windowId, plugins = [], store } = $props();
  const builtinPanels = {
    annotations: [AnnotationPanel, 'WindowSideBarAnnotationsPanel'],
    attribution: [AttributionPanel, 'AttributionPanel'],
    canvas: [CanvasPanel, 'WindowSideBarCanvasPanel'],
    captionToc: [CaptionTocPanel, 'CaptionTocPanel'],
    collection: [CollectionPanel, 'WindowSideBarCollectionPanel'],
    custom: [CustomPanel, 'CustomPanel'],
    info: [InfoPanel, 'WindowSideBarInfoPanel'],
    layers: [LayersPanel, 'LayersPanel'],
    search: [SearchPanel, 'SearchPanel'],
    thumbnailNavigation: [ThumbnailNavigation, 'ThumbnailNavigation'],
  };
  const selected = $derived(plugins.find((plugin) => plugin.companionWindowKey === content));
  const builtin = $derived(builtinPanels[content] || []);
  const Component = $derived(selected?.component || builtin[0]);
  const target = $derived(selected ? 'CompanionWindowFactory' : builtin[1]);
</script>

{#if Component && target}
  {#if selected}
    <SveltePlugin plugin={selected} {store} targetProps={{ id, windowId }} />
  {:else}
    <Connected name={target} component={Component} targetProps={{ id, windowId }} />
  {/if}
{/if}

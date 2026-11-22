<script>
  import PluginTarget from '../extend/PluginTarget.svelte';
  import CollapsibleSection from './CollapsibleSection.svelte';
  import LabelValueMetadata from './LabelValueMetadata.svelte';
  import SanitizedHtml from './SanitizedHtml.svelte';
  let {
    canvasDescription = null,
    canvasLabel = null,
    canvasMetadata = [],
    index = 0,
    totalSize = 1,
    plugins = [],
    store,
    t = (key) => key,
    ...rest
  } = $props();
</script>

<CollapsibleSection id={`canvas-${index}`} label={t('currentItem', { context: `${index + 1}/${totalSize}` })} {t}>
  {#if canvasLabel}<h5>{canvasLabel}</h5>{/if}
  {#if canvasDescription}<p><SanitizedHtml htmlString={canvasDescription} ruleSet="iiif" /></p>{/if}
  {#if canvasMetadata?.length}<LabelValueMetadata labelValuePairs={canvasMetadata} />{/if}
  <PluginTarget
    mode="add"
    name="CanvasInfo"
    {plugins}
    {store}
    targetProps={{ canvasDescription, canvasLabel, canvasMetadata, index, totalSize, t, ...rest }}
  >
    <span></span>
  </PluginTarget>
</CollapsibleSection>

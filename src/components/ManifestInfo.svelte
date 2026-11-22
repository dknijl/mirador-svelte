<script>
  import CollapsibleSection from './CollapsibleSection.svelte';
  import LabelValueMetadata from './LabelValueMetadata.svelte';
  import SanitizedHtml from './SanitizedHtml.svelte';
  import PluginTarget from '../extend/PluginTarget.svelte';
  let {
    manifestLabel = null,
    manifestMetadata = [],
    manifestSummary = null,
    plugins = [],
    store,
    t = (key) => key,
    ...rest
  } = $props();
</script>

<CollapsibleSection id="manifest-resource" label={t('resource')} {t}>
  {#if manifestLabel}<h5 class="manifest-label">{manifestLabel}</h5>{/if}
  {#if manifestSummary}<p><SanitizedHtml htmlString={manifestSummary} ruleSet="iiif" /></p>{/if}
  {#if manifestMetadata.length}<LabelValueMetadata labelValuePairs={manifestMetadata} />{/if}
  <PluginTarget
    mode="add"
    name="ManifestInfo"
    {plugins}
    {store}
    targetProps={{ manifestLabel, manifestMetadata, manifestSummary, ...rest, t }}
  >
    <span></span>
  </PluginTarget>
</CollapsibleSection>

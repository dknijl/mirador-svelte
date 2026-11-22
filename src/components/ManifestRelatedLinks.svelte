<script>
  import PluginTarget from '../extend/PluginTarget.svelte';
  import CollapsibleSection from './CollapsibleSection.svelte';
  let { homepage, manifestUrl, related, renderings, seeAlso, plugins = [], store, t = (key) => key, ...rest } = $props();
  const groups = $derived(
    [
      ['iiif_homepage', homepage],
      ['iiif_renderings', renderings],
      ['iiif_related', related],
      ['iiif_seeAlso', seeAlso],
      ['iiif_manifest', manifestUrl ? [{ label: manifestUrl, value: manifestUrl }] : null],
    ].filter(([, items]) => (Array.isArray(items) ? items.length : items)),
  );
</script>

<CollapsibleSection id="manifest-links" label={t('related')} {t}>
  <h5>{t('links')}</h5>
  <dl>
    {#each groups as [label, items] (label)}
      <dt>{t(label)}</dt>
      {@const links = Array.isArray(items) ? items : []}
      {#each links as item (item.value)}
        <dd>
          <a target="_blank" rel="noopener noreferrer" href={item.value}>{item.label || item.value}</a>{#if item.format}
            ({item.format}){/if}
        </dd>
      {/each}
    {/each}
  </dl>
  <PluginTarget
    mode="add"
    name="ManifestRelatedLinks"
    {plugins}
    {store}
    targetProps={{ homepage, manifestUrl, related, renderings, seeAlso, t, ...rest }}
  >
    <span></span>
  </PluginTarget>
</CollapsibleSection>

<style>
  h5 {
    margin: 0 0 8px;
  }
  dl {
    margin: 0;
  }
  dt {
    font-weight: 500;
  }
  dd {
    margin: 0 0 0.5em;
    overflow-wrap: anywhere;
  }
</style>

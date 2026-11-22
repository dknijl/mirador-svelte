<script>
  import Connected from '../svelte/Connected.svelte';
  import CompanionWindow from './CompanionWindow.svelte';
  import CompanionWindowSection from './CompanionWindowSection.svelte';
  import LabelValueMetadata from './LabelValueMetadata.svelte';
  import PluginTarget from '../extend/PluginTarget.svelte';

  let {
    manifestLogo = null,
    requiredStatement = null,
    rights = null,
    windowId,
    id,
    plugins = [],
    store,
    t = (key) => key,
  } = $props();
</script>

{#snippet body()}
  <CompanionWindowSection>
    {#if requiredStatement}<LabelValueMetadata labelValuePairs={requiredStatement} defaultLabel={t('attribution')} />{/if}
    {#if rights?.length}
      <dl class="rights">
        <dt>{t('rights')}</dt>
        {#each rights as right (right)}<dd><a href={right} target="_blank" rel="noopener noreferrer">{right}</a></dd>{/each}
      </dl>
    {/if}
  </CompanionWindowSection>
  {#if manifestLogo}
    <CompanionWindowSection><img src={manifestLogo} alt="" /></CompanionWindowSection>
  {/if}
  <PluginTarget
    mode="add"
    name="AttributionPanel"
    {plugins}
    {store}
    targetProps={{ manifestLogo, requiredStatement, rights, windowId, id, t }}
  >
    <span></span>
  </PluginTarget>
{/snippet}

<Connected
  name="CompanionWindow"
  component={CompanionWindow}
  targetProps={{ title: t('attributionTitle'), paperClassName: 'mirador-attribution-panel', windowId, id }}
>
  {@render body()}
</Connected>

<style>
  .rights {
    margin: 0;
  }
  .rights dd {
    margin: 0 0 0.5em;
    overflow-wrap: anywhere;
  }
  img {
    height: auto;
    max-width: 100%;
  }
</style>

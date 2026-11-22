<script>
  import LocalePicker from './LocalePicker.svelte';
  import Connected from '../svelte/Connected.svelte';
  import CompanionWindow from './CompanionWindow.svelte';
  import CompanionWindowSection from './CompanionWindowSection.svelte';
  import CanvasInfo from './CanvasInfo.svelte';
  import CollectionInfo from './CollectionInfo.svelte';
  import ManifestInfo from './ManifestInfo.svelte';
  import ManifestRelatedLinks from './ManifestRelatedLinks.svelte';

  let {
    windowId,
    id,
    canvasIds = [],
    collectionPath = [],
    locale = '',
    setLocale,
    availableLocales = [],
    showLocalePicker = false,
    t = (key) => key,
  } = $props();
</script>

{#snippet body()}
  {#each canvasIds as canvasId, index (canvasId)}
    <CompanionWindowSection>
      <Connected
        name="CanvasInfo"
        component={CanvasInfo}
        targetProps={{ canvasId, companionWindowId: id, index, totalSize: canvasIds.length, windowId }}
      />
    </CompanionWindowSection>
  {/each}
  {#if collectionPath.length}<CompanionWindowSection>
      <Connected name="CollectionInfo" component={CollectionInfo} targetProps={{ companionWindowId: id, windowId }} />
    </CompanionWindowSection>{/if}
  <CompanionWindowSection>
    <Connected name="ManifestInfo" component={ManifestInfo} targetProps={{ companionWindowId: id, windowId }} />
  </CompanionWindowSection>
  <CompanionWindowSection>
    <Connected name="ManifestRelatedLinks" component={ManifestRelatedLinks} targetProps={{ companionWindowId: id, windowId }} />
  </CompanionWindowSection>
{/snippet}

{#snippet titleControls()}
  {#if showLocalePicker}
    <LocalePicker {availableLocales} {locale} {setLocale} {t} />
  {/if}
{/snippet}

<Connected
  name="CompanionWindow"
  component={CompanionWindow}
  targetProps={{ title: t('aboutThisItem'), paperClassName: 'mirador-window-sidebar-info-panel', windowId, id, titleControls }}
>
  {@render body()}
</Connected>

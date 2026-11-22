<script>
  import Connected from '../svelte/Connected.svelte';
  import Workspace from './Workspace.svelte';
  import Add from './WorkspaceAdd.svelte';
  import Controls from './WorkspaceControlPanel.svelte';
  import Errors from './ErrorDialog.svelte';
  import Background from './BackgroundPluginArea.svelte';
  let { store, plugins, controlPanelVariant, isWorkspaceAddVisible, isWorkspaceControlPanelVisible, lang, t } = $props();
</script>

{#snippet controls(part)}
  {#if isWorkspaceControlPanelVisible}
    <Connected name="WorkspaceControlPanel" component={Controls} targetProps={{ part, variant: controlPanelVariant }} />
  {/if}
{/snippet}
{#snippet workspaceControls()}{@render controls('primary')}{/snippet}
{#snippet workspaceOptions()}{@render controls('options')}{/snippet}
<main class="mirador-viewer" {lang} aria-label={t('workspace')}>
  {#if isWorkspaceAddVisible}
    <Connected name="WorkspaceAdd" component={Add} />
  {:else}
    <Connected name="Workspace" component={Workspace} targetProps={{ workspaceControls, workspaceOptions }} />
  {/if}
  <Connected name="ErrorDialog" component={Errors} />
  <Background {store} {plugins} />
</main>
{#if isWorkspaceAddVisible || controlPanelVariant === 'wide'}
  {@render controls('all')}
{/if}

<style>
  main {
    flex: 1;
    min-height: 0;
    min-width: 0;
    position: relative;
  }
</style>

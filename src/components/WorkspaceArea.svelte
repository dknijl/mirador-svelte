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
{#snippet workspaceControls()}{#if !isWorkspaceAddVisible}{@render controls('primary')}{/if}{/snippet}
{#snippet workspaceOptions()}{#if !isWorkspaceAddVisible}{@render controls('options')}{/if}{/snippet}
<main class="mirador-viewer" {lang} aria-label={t('workspace')}>
  <div class="reader" class:covered={isWorkspaceAddVisible} inert={isWorkspaceAddVisible}>
    <Connected name="Workspace" component={Workspace} targetProps={{ workspaceControls, workspaceOptions }} />
  </div>
  {#if isWorkspaceAddVisible}
    <Connected name="WorkspaceAdd" component={Add} />
  {/if}
  <Connected name="ErrorDialog" component={Errors} />
  <Background {store} {plugins} />
</main>
{#if isWorkspaceAddVisible || controlPanelVariant === 'wide'}
  {@render controls('all')}
{/if}

<style>
  .reader {
    position: absolute;
    inset: 0;
  }
  .covered {
    visibility: hidden;
  }
  main {
    flex: 1;
    min-height: 0;
    min-width: 0;
    position: relative;
  }
</style>

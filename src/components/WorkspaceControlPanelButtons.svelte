<script>
  import Connected from '../svelte/Connected.svelte';
  import FullScreenButton from './FullScreenButton.svelte';
  import WorkspaceMenuButton from './WorkspaceMenuButton.svelte';
  import WorkspaceOptionsButton from './WorkspaceOptionsButton.svelte';
  import WindowListButton from './WindowListButton.svelte';
  import PluginTarget from '../extend/PluginTarget.svelte';

  let { part = 'all', plugins = [], store, t } = $props();
  const showsPrimary = $derived(part === 'all' || part === 'primary');
  const showsOptions = $derived(part === 'all' || part === 'options');
</script>

{#if showsPrimary}
  <Connected name="WindowListButton" component={WindowListButton} {plugins} {store} {t} />
  <Connected name="WorkspaceMenuButton" component={WorkspaceMenuButton} {plugins} {store} {t} />
{/if}
{#if showsOptions}
  <Connected name="WorkspaceOptionsButton" component={WorkspaceOptionsButton} {plugins} {store} {t} />
  <Connected name="FullScreenButton" component={FullScreenButton} {plugins} {store} {t} />
  <PluginTarget mode="add" name="WorkspaceControlPanelButtons" {plugins} {store} />
{/if}

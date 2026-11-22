<script>
  import Connected from '../svelte/Connected.svelte';
  import WorkspaceAddButton from './WorkspaceAddButton.svelte';
  import WorkspaceControlPanelButtons from './WorkspaceControlPanelButtons.svelte';
  import Branding from './Branding.svelte';

  let {
    part = 'all',
    variant = 'default',
    isWorkspaceAddVisible = false,
    setWorkspaceAddVisibility = () => {},
    useExtendedFab = false,
    plugins = [],
    store,
    t = (key) => key,
  } = $props();
  const showsPrimary = $derived(part === 'all' || part === 'primary');
  const showsOptions = $derived(part === 'all' || part === 'options');
</script>

<nav class="workspace-controls" aria-label={t('workspaceNavigation')} data-variant={variant} data-part={part}>
  {#if showsPrimary}
    <Connected
      name="WorkspaceAddButton"
      component={WorkspaceAddButton}
      {plugins}
      {store}
      {t}
      targetProps={{ isWorkspaceAddVisible, setWorkspaceAddVisibility, useExtendedFab }}
    />
    <Connected name="Branding" component={Branding} {plugins} {store} {t} targetProps={{ variant }} />
    <Connected
      name="WorkspaceControlPanelButtons"
      component={WorkspaceControlPanelButtons}
      {plugins}
      {store}
      {t}
      targetProps={{ part: 'primary' }}
    />
  {/if}
  {#if showsOptions}
    <WorkspaceControlPanelButtons part="options" {plugins} {store} {t} />
  {/if}
</nav>

<style>
  .workspace-controls {
    align-items: center;
    display: flex;
    gap: 0.25rem;
    padding: 0.25rem;
  }
  .workspace-controls[data-part='options'] {
    margin-left: auto;
  }
</style>

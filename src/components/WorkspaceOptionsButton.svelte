<script>
  import Connected from '../svelte/Connected.svelte';
  import WorkspaceOptionsMenu from './WorkspaceOptionsMenu.svelte';
  import MiradorMenuButton from './MiradorMenuButton.svelte';
  let { plugins = [], store, t = (key) => key } = $props();
  let open = $state(false);
  let anchorEl = $state(null);
  function close() {
    open = false;
    anchorEl = null;
  }
</script>

<MiradorMenuButton
  aria-haspopup="menu"
  aria-label={t('workspaceOptions')}
  aria-expanded={open}
  selected={open}
  onclick={(event) => {
    anchorEl = open ? null : event.currentTarget;
    open = !open;
  }}
>
  <span aria-hidden="true">⋯</span>
</MiradorMenuButton>
<Connected
  name="WorkspaceOptionsMenu"
  component={WorkspaceOptionsMenu}
  {plugins}
  {store}
  {t}
  targetProps={{ open, anchorEl, handleClose: close }}
/>

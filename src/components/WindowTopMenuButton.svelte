<script>
  import { tick } from 'svelte';
  import Connected from '../svelte/Connected.svelte';
  import MiradorMenuButton from './MiradorMenuButton.svelte';
  import WindowTopMenu from './WindowTopMenu.svelte';
  let { windowId, t = (key) => key, store, plugins = [] } = $props();
  let open = $state(false);
  const menuId = $props.id();
  async function toggleMenu() {
    open = !open;
    if (!open) return;
    await tick();
    document.getElementById(menuId)?.focus();
  }
</script>

<Connected
  name="MiradorMenuButton"
  component={MiradorMenuButton}
  targetProps={{
    'aria-expanded': open,
    'aria-haspopup': 'true',
    'aria-label': t('windowMenu'),
    'aria-controls': open ? menuId : undefined,
    'aria-owns': open ? menuId : undefined,
    selected: open,
    onclick: toggleMenu,
  }}
>
  <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z" /></svg>
</Connected>
{#if open}
  <Connected
    name="WindowTopMenu"
    component={WindowTopMenu}
    plugins={[]}
    targetProps={{ windowId, id: menuId, handleClose: () => (open = false), pluginList: plugins, store }}
  />
{/if}

<style>
  svg {
    fill: none;
    height: 24px;
    stroke: currentColor;
    stroke-width: 2;
    width: 24px;
  }
</style>

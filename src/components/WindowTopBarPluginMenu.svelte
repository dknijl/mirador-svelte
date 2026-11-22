<script>
  import { tick } from 'svelte';
  import PluginTarget from '../extend/PluginTarget.svelte';
  import { createTargetToPluginMapping } from '../extend/pluginMapping';
  let { store, plugins = [], windowId, t = (key) => key, pluginTarget = 'WindowTopBarPluginMenu' } = $props();
  let open = $state(false);
  let menu = $state();
  const hasPlugins = $derived.by(() => {
    const target = createTargetToPluginMapping(plugins)[pluginTarget];
    return Boolean(target?.add?.length || target?.wrap?.length);
  });
  function closeMenu() {
    open = false;
  }
  async function showMenu() {
    open = true;
    await tick();
    menu?.focus();
  }
</script>

{#if hasPlugins}
  <button
    type="button"
    class="menu-toggle"
    aria-label={t('windowPluginMenu')}
    aria-haspopup="true"
    aria-expanded={open}
    onclick={showMenu}
  >
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" />
    </svg>
  </button>
  {#if open}
    <div class="menu-backdrop" role="presentation" onclick={(event) => event.target === event.currentTarget && closeMenu()}>
      <div
        bind:this={menu}
        class="plugin-menu"
        role="menu"
        tabindex="-1"
        aria-label={t('windowPluginMenu')}
        onkeydown={(event) => event.key === 'Escape' && closeMenu()}
      >
        <PluginTarget name={pluginTarget} {store} {plugins} targetProps={{ windowId, handleClose: closeMenu }} />
      </div>
    </div>
  {/if}
{/if}

<style>
  .menu-toggle {
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: 50%;
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    height: 40px;
    justify-content: center;
    min-width: 40px;
  }
  .menu-toggle:hover {
    background: rgb(127 127 127 / 18%);
  }
  svg {
    fill: currentColor;
    height: 24px;
    width: 24px;
  }
  .menu-backdrop {
    inset: 0;
    position: fixed;
    z-index: 1401;
  }
  .plugin-menu {
    background: var(--mirador-paper, Canvas);
    border-radius: 4px;
    box-shadow: 0 4px 18px rgb(0 0 0 / 24%);
    max-height: 80vh;
    overflow: auto;
    padding: 8px;
    position: absolute;
    right: 12px;
    top: 52px;
  }
</style>

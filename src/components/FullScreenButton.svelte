<script>
  import { onMount } from 'svelte';
  import { createFullscreenHandle } from '../lib/fullscreen.js';

  let { t = (key) => key, class: className = '' } = $props();
  let button = $state();
  let active = $state(false);
  const handle = createFullscreenHandle(() => button?.closest('.mirador-viewer-root') || document.documentElement);

  onMount(() => {
    const update = () => (active = handle.active);
    update();
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  });

  async function toggle() {
    if (handle.active) await handle.exit();
    else await handle.enter();
    active = handle.active;
  }
</script>

{#if typeof document !== 'undefined' && typeof document.createElement('div').requestFullscreen === 'function'}
  <button
    class={className}
    bind:this={button}
    type="button"
    aria-label={t(active ? 'exitFullScreen' : 'workspaceFullScreen')}
    onclick={toggle}
  >
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d={active ? 'M3 8h5V3m8 0v5h5M3 16h5v5m8 0v-5h5' : 'M3 8V3h5m8 0h5v5M3 16v5h5m8 0h5v-5'} />
    </svg>
  </button>
{/if}

<style>
  button {
    border: 0;
    background: transparent;
    color: inherit;
    width: 40px;
    height: 40px;
  }
  svg {
    width: 22px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
  }
</style>

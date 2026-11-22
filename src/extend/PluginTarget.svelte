<script>
  import { createTargetToPluginMapping } from './pluginMapping';
  import SveltePlugin from './SveltePlugin.svelte';

  let { plugins = [], store, name, mode, targetProps = {}, children } = $props();
  const target = $derived(createTargetToPluginMapping(plugins)[name]);
  const wrappers = $derived(mode === 'add' ? [] : (target?.wrap ?? []));
  const additions = $derived(mode === 'wrap' ? [] : (target?.add ?? []));
</script>

{#snippet layer(index)}
  {#if index < wrappers.length}
    <SveltePlugin plugin={wrappers[index]} {store} {targetProps}>
      {@render layer(index + 1)}
    </SveltePlugin>
  {:else}
    {@render children?.()}
    {#each additions as plugin, i (i)}
      <SveltePlugin {plugin} {store} {targetProps} />
    {/each}
  {/if}
{/snippet}

{@render layer(0)}

<script>
  import ns from '../config/css-ns';
  import SanitizedHtml from './SanitizedHtml.svelte';

  let { defaultLabel = '', labelValuePairs, labelValueJoiner = ', ' } = $props();
</script>

{#if labelValuePairs.length}
  <dl class={ns('label-value-metadata')}>
    {#each labelValuePairs as pair (pair)}
      <dt>{pair.label || defaultLabel}</dt>
      <dd><SanitizedHtml htmlString={pair.values.join(labelValueJoiner)} ruleSet="iiif" /></dd>
    {/each}
  </dl>
{/if}

<style>
  dt {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.57;
  }

  dd {
    line-height: 1.5;
    margin: 0 0 0.5em;
  }
</style>

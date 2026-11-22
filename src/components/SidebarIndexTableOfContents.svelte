<script>
  import ScrollTo from './ScrollTo.svelte';
  let {
    treeStructure,
    visibleNodeIds = [],
    expandedNodeIds = [],
    nodeIdToScrollTo,
    windowId,
    setCanvas,
    toggleNode = () => {},
    container,
  } = $props();
  function select(node) {
    if (node.nodes?.length) {
      toggleNode(node.id);
      return;
    }
    const data = node.data?.__jsonld ?? {};
    const target = data.startCanvas ?? data.start?.id ?? data.start?.source ?? node.data?.getCanvasIds?.()?.[0];
    if (typeof target !== 'string') return;
    const [canvasId, fragment = ''] = target.split('#');
    const start = fragment.match(/(?:^|&)t=([\d.]+)/);
    setCanvas?.(windowId, canvasId, null, { startTime: start ? parseFloat(start[1]) : undefined });
  }
  function keydown(event, node) {
    event.stopPropagation();
    const item = event.currentTarget;
    const tree = item.closest('[role=tree]');
    const items = Array.from(tree.querySelectorAll('[role=treeitem]'));
    const expanded = expandedNodeIds.includes(node.id);
    switch (event.key) {
      case 'Enter':
      case ' ':
        select(node);
        break;
      case 'ArrowRight':
        if (node.nodes?.length && !expanded) toggleNode(node.id);
        else item.querySelector('[role=treeitem]')?.focus();
        break;
      case 'ArrowLeft':
        if (expanded) toggleNode(node.id);
        else item.parentElement.closest('[role=treeitem]')?.focus();
        break;
      case 'ArrowDown':
        items[items.indexOf(item) + 1]?.focus();
        break;
      case 'ArrowUp':
        items[items.indexOf(item) - 1]?.focus();
        break;
      case 'Home':
        items[0]?.focus();
        break;
      case 'End':
        items.at(-1)?.focus();
        break;
      default:
        return;
    }
    event.preventDefault();
  }
</script>

{#snippet nodes(children)}
  {#each children ?? [] as node (node.id)}
    <ScrollTo {container} scrollTo={node.id === nodeIdToScrollTo} offsetTop={96}>
      <li
        role="treeitem"
        tabindex="0"
        aria-expanded={node.nodes?.length ? expandedNodeIds.includes(node.id) : undefined}
        aria-selected={visibleNodeIds.includes(node.id)}
        onkeydown={(event) => keydown(event, node)}
        onclick={(event) => {
          event.stopPropagation();
          select(node);
        }}
      >
        {#if node.nodes?.length}<span aria-hidden="true">{expandedNodeIds.includes(node.id) ? '▾' : '▸'}</span>{/if}
        {node.label}
        {#if expandedNodeIds.includes(node.id) && node.nodes?.length}<ul role="group">{@render nodes(node.nodes)}</ul>{/if}
      </li>
    </ScrollTo>
  {/each}
{/snippet}
{#if treeStructure}
  <ul role="tree" aria-label="Table of contents">{@render nodes(treeStructure.nodes)}</ul>
{/if}

<style>
  ul {
    list-style: none;
    padding-inline-start: 1em;
  }
  li {
    cursor: pointer;
    padding-block: 0.25em;
  }
  li[aria-selected='true'] {
    background: color-mix(in srgb, var(--mirador-primary) 20%, transparent);
  }
</style>

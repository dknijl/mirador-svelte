<script>
  import { onMount } from 'svelte';
  import SanitizedHtml from './SanitizedHtml.svelte';
  let {
    annotations = [],
    index = 0,
    label = '',
    selectedAnnotationId,
    totalSize = 1,
    htmlSanitizationRuleSet = 'iiif',
    hoveredAnnotationIds = [],
    deselectAnnotation = () => {},
    selectAnnotation = () => {},
    windowId,
    hoverAnnotation = () => {},
    t = (key) => key,
  } = $props();
  let list = $state();
  onMount(() => {
    list?.querySelector('[role="menuitem"]')?.focus();
  });
  $effect(() => {
    if (!selectedAnnotationId || !list) return;
    Array.from(list.querySelectorAll('[data-annotation-id]'))
      .find((item) => item.dataset.annotationId === selectedAnnotationId)
      ?.scrollIntoView?.({ block: 'nearest' });
  });
  function activate(annotation) {
    if (window.getSelection()?.toString()) return;
    selectedAnnotationId === annotation.id
      ? deselectAnnotation(windowId, annotation.id)
      : selectAnnotation(windowId, annotation.id);
  }
</script>

{#if annotations.length}
  <h4>{t('annotationCanvasLabel', { context: `${index + 1}/${totalSize}`, label })}</h4>
  <ul bind:this={list} role="menu">
    {#each annotations as annotation (annotation.id)}
      <li
        role="menuitem"
        class:selected={selectedAnnotationId === annotation.id}
        class:hovered={hoveredAnnotationIds.includes(annotation.id)}
        data-annotation-id={annotation.id}
        tabindex="0"
        onclick={() => activate(annotation)}
        onkeydown={(event) => {
          if (event.key === 'Enter') activate(annotation);
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            event.currentTarget.nextElementSibling?.focus();
          }
          if (event.key === 'ArrowUp') {
            event.preventDefault();
            event.currentTarget.previousElementSibling?.focus();
          }
        }}
        onfocus={() => hoverAnnotation(windowId, [annotation.id])}
        onblur={() => hoverAnnotation(windowId, [])}
        onmouseenter={() => hoverAnnotation(windowId, [annotation.id])}
        onmouseleave={() => hoverAnnotation(windowId, [])}
      >
        <SanitizedHtml ruleSet={htmlSanitizationRuleSet} htmlString={annotation.content} />
        {#if annotation.tags?.filter(Boolean).length}<div class="tags">
            {#each annotation.tags.filter(Boolean) as tag (tag)}<span>{tag}</span>{/each}
          </div>{/if}
      </li>
    {/each}
  </ul>
{/if}

<style>
  h4 {
    font-size: 0.75rem;
    font-weight: 500;
    padding: 16px 8px 4px 16px;
    text-transform: uppercase;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    border-bottom: 1px solid color-mix(in srgb, currentColor 15%, transparent);
    cursor: pointer;
    padding: 12px 16px;
    user-select: text;
  }
  li:hover,
  li:focus-visible,
  li.selected,
  li.hovered {
    background: color-mix(in srgb, currentColor 8%, transparent);
  }
  .tags {
    display: flex;
    gap: 4px;
    margin-top: 6px;
  }
  .tags span {
    border: 1px solid currentcolor;
    border-radius: 12px;
    font-size: 0.75rem;
    padding: 1px 6px;
  }
</style>

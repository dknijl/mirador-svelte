<script>
  import { untrack } from 'svelte';
  import ScrollTo from './ScrollTo.svelte';
  import SanitizedHtml from './SanitizedHtml.svelte';
  import TruncatedHit from '../lib/TruncatedHit';
  let {
    adjacent = false,
    announcer,
    containerRef,
    total,
    annotation,
    annotationId,
    annotationLabel,
    canvasLabel,
    focused = false,
    hit,
    index = 0,
    selected = false,
    selectAnnotation = () => {},
    showDetails = () => {},
    windowSelected = false,
    t = (key) => key,
  } = $props();
  const id = $props.id();
  const truncatedHit = $derived(hit ? new TruncatedHit(hit, annotation) : null);
  const renderedHit = $derived(focused ? hit : truncatedHit);
  const fullBefore = $derived(hit?.before || annotation?.content || '');
  const fullAfter = $derived(hit?.after || '');
  const truncated = $derived(
    Boolean(hit && renderedHit && (renderedHit.before !== fullBefore || renderedHit.after !== fullAfter)),
  );
  const content = $derived(annotation?.chars || annotation?.content || '');
  $effect(() => {
    if (selected)
      untrack(() => {
        if (announcer && truncatedHit)
          announcer(
            [
              t('pagination', { current: index + 1, total }),
              canvasLabel,
              annotationLabel,
              truncatedHit.before,
              truncatedHit.match,
              truncatedHit.after,
            ].join(' '),
            'polite',
          );
      });
  });
</script>

{#if !focused || selected || hit}
  <ScrollTo container={containerRef?.current} offsetTop={96} scrollTo={windowSelected && !focused}>
    <article
      class:windowSelected
      class="search-hit"
      role="listitem"
      class:adjacent
      class:selected
      class:window-selected={windowSelected}
    >
      {@render header()}{@render result()}
      {#snippet header()}
        <header id={id + '-header'}>
          <span class="counter">{index + 1}</span>{#snippet heading()}
            <h4 {id}>
              {canvasLabel || ''}{#if annotationLabel}<small>{annotationLabel}</small>{/if}
            </h4>
          {/snippet}{@render heading()}
        </header>
      {/snippet}
      {#snippet result()}
        {#if hit && selected}
          <div class="content">
            <SanitizedHtml htmlString={fullBefore} ruleSet="iiif" />
            <strong><SanitizedHtml htmlString={hit.match || ''} ruleSet="iiif" /></strong>
            <SanitizedHtml htmlString={fullAfter} ruleSet="iiif" />
          </div>
        {:else if hit && focused}
          <div class="content">
            <SanitizedHtml htmlString={fullBefore} ruleSet="iiif" />
            <strong><SanitizedHtml htmlString={hit.match || ''} ruleSet="iiif" /></strong>
            <SanitizedHtml htmlString={fullAfter} ruleSet="iiif" />
          </div>
        {:else if hit}
          <button
            type="button"
            id={id + '-content'}
            aria-labelledby={[id + '-header', id + '-content', truncated ? id + '-more' : ''].filter(Boolean).join(' ')}
            onclick={() => annotationId && selectAnnotation(annotationId)}
          >
            <SanitizedHtml htmlString={renderedHit.before || fullBefore} ruleSet="iiif" />
            <strong><SanitizedHtml htmlString={renderedHit.match || ''} ruleSet="iiif" /></strong>
            <SanitizedHtml htmlString={renderedHit.after || ''} ruleSet="iiif" />
          </button>
        {:else if selected}
          <div class="content"><SanitizedHtml htmlString={content} ruleSet="iiif" /></div>
        {:else}
          <button type="button" aria-labelledby={id} onclick={() => annotationId && selectAnnotation(annotationId)}>
            <SanitizedHtml htmlString={content} ruleSet="iiif" />
          </button>
        {/if}
        {#if truncated && !focused && !selected}
          <button id={id + '-more'} class="more" type="button" aria-describedby={id} onclick={showDetails}>{t('more')}</button>
        {/if}
      {/snippet}
    </article>
  </ScrollTo>
{/if}

<style>
  article {
    border-bottom: 1px solid color-mix(in srgb, currentColor 15%, transparent);
    padding: 12px 16px;
  }
  header {
    align-items: baseline;
    display: flex;
    gap: 8px;
  }
  .counter {
    background: color-mix(in srgb, currentColor 12%, transparent);
    border-radius: 16px;
    min-width: 28px;
    padding: 4px;
    text-align: center;
  }
  h4 {
    display: inline;
    margin: 0;
  }
  small {
    display: block;
    font-weight: 400;
    margin-top: 8px;
  }
  button {
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    display: block;
    font: inherit;
    padding: 8px 0;
    text-align: start;
    width: 100%;
  }
  .content :global(.mirador-third-party-html),
  button :global(.mirador-third-party-html) {
    margin-inline-end: 0.2em;
  }
  .adjacent {
    background: color-mix(in srgb, yellow 10%, transparent);
  }
  .window-selected,
  .selected {
    background: color-mix(in srgb, currentColor 9%, transparent);
  }
</style>

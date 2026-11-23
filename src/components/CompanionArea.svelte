<script>
  import Connected from '../svelte/Connected.svelte';
  import CompanionWindowFactory from './CompanionWindowFactory.svelte';

  let {
    companionAreaOpen = false,
    companionWindowIds = [],
    direction = 'ltr',
    position,
    sideBarOpen = false,
    windowId,
    setCompanionAreaOpen = () => {},
    t = (key) => key,
  } = $props();

  const isHorizontal = $derived(position === 'bottom' || position === 'far-bottom');
  const pointsRight = $derived(companionAreaOpen === (direction !== 'rtl'));
  const positionClass = $derived(`mirador-companion-area-${position}`);
  const slideDirection = $derived(
    isHorizontal
      ? 'up'
      : position === 'left' || position === 'far-right'
        ? direction === 'rtl'
          ? 'left'
          : 'right'
        : direction === 'rtl'
          ? 'right'
          : 'left',
  );
</script>

<section
  class={`companion-area ${positionClass}`}
  class:horizontal={isHorizontal}
  class:closed={!companionAreaOpen}
  class:left={position === 'left'}
  class:right={position === 'right'}
  class:bottom={isHorizontal}
  class:panels-open={companionAreaOpen && companionWindowIds.length > 0}
>
  <div
    class="companion-windows mirador-companion-windows"
    class:open={companionAreaOpen}
    class:has-panels={companionWindowIds.length > 0}
    data-slide-direction={slideDirection}
    aria-hidden={!companionAreaOpen}
  >
    {#each companionWindowIds as id (id)}
      <Connected name="CompanionWindowFactory" component={CompanionWindowFactory} targetProps={{ id, windowId }} />
    {/each}
  </div>
  {#if position === 'left' && sideBarOpen && companionWindowIds.length}
    <button
      class="area-toggle"
      type="button"
      aria-expanded={companionAreaOpen}
      aria-label={companionAreaOpen ? t('collapseSidePanel') : t('expandSidePanel')}
      onclick={() => setCompanionAreaOpen(windowId, !companionAreaOpen)}
    >
      <span aria-hidden="true">{pointsRight ? '›' : '‹'}</span>
    </button>
  {/if}
</section>

<style>
  .companion-area {
    display: flex;
    min-height: 0;
    position: relative;
    z-index: 2;
  }
  .companion-area.horizontal,
  .companion-area.bottom {
    flex-direction: column;
    width: 100%;
  }
  .companion-area.mirador-companion-area-far-left {
    flex: 0 0 auto;
    width: 0;
  }
  .companion-area.mirador-companion-area-far-left.panels-open {
    width: max-content;
  }
  .companion-windows {
    display: none;
  }
  .companion-windows.open {
    display: flex;
  }
  .horizontal .companion-windows {
    flex-direction: column;
    width: 100%;
  }
  .left .companion-windows.has-panels {
    min-width: 235px;
  }
  .mirador-companion-area-far-left .companion-windows.open.has-panels {
    width: max-content;
  }
  .area-toggle {
    position: absolute;
    inset-inline-end: 100%;
    margin-top: 1rem;
    padding: 2px;
    width: 23px;
    height: 48px;
    z-index: 3;
    border: 1px solid currentcolor;
    background: Canvas;
    color: inherit;
    cursor: pointer;
  }
</style>

<script>
  import ns from '../config/css-ns';
  let {
    hasNextCanvas = false,
    hasPreviousCanvas = false,
    setNextCanvas = () => {},
    setPreviousCanvas = () => {},
    viewingDirection = '',
    t = (key) => (key === 'previousCanvas' ? 'Previous item' : 'Next item'),
  } = $props();

  const direction = $derived(viewingDirection === 'right-to-left' ? 'rtl' : 'ltr');
  const rotations = $derived.by(() => {
    if (viewingDirection === 'top-to-bottom') return [270, 90];
    if (viewingDirection === 'bottom-to-top') return [90, 270];
    if (viewingDirection === 'right-to-left') return [0, 180];
    return [180, 0];
  });
</script>

<div class={ns('osd-navigation')} dir={direction}>
  <button
    type="button"
    class={ns('previous-canvas-button')}
    aria-label={t('previousCanvas')}
    disabled={!hasPreviousCanvas}
    onclick={() => hasPreviousCanvas && setPreviousCanvas()}
  >
    <svg aria-hidden="true" viewBox="0 0 24 24" style:transform={`rotate(${rotations[0]}deg)`}>
      <path d="M12 4v16m0-16-7 7m7-7 7 7" />
    </svg>
  </button>
  <button
    type="button"
    class={ns('next-canvas-button')}
    aria-label={t('nextCanvas')}
    disabled={!hasNextCanvas}
    onclick={() => hasNextCanvas && setNextCanvas()}
  >
    <svg aria-hidden="true" viewBox="0 0 24 24" style:transform={`rotate(${rotations[1]}deg)`}>
      <path d="M12 4v16m0-16-7 7m7-7 7 7" />
    </svg>
  </button>
</div>

<style>
  .mirador-osd-navigation {
    display: flex;
    flex-shrink: 0;
  }
  button {
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: 50%;
    color: inherit;
    cursor: pointer;
    display: grid;
    height: 38px;
    place-items: center;
    width: 38px;
  }
  button:hover:not(:disabled) {
    background: rgb(127 127 127 / 18%);
  }
  button:disabled {
    cursor: default;
    opacity: 0.45;
  }
  svg {
    fill: none;
    height: 20px;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2;
    width: 20px;
  }
</style>

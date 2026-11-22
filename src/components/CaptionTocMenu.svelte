<script>
  let { handleClose = () => {}, openCaptionToc = () => {}, windowId, t = (key) => key } = $props();
</script>

<h3 role="presentation">{t('tableOfContentsList')}</h3>
<div role="menubar">
  <button
    type="button"
    role="menuitem"
    onclick={() => {
      openCaptionToc(windowId);
      handleClose();
    }}
  >
    <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 5h16M4 10h16M4 15h10M4 20h10" /></svg>{t('openCaptionToc')}
  </button>
</div>

<style>
  h3 {
    font-size: 0.875rem;
    font-weight: 500;
    margin: 8px 12px 4px;
  }
  button {
    align-items: center;
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    display: flex;
    gap: 8px;
    padding: 8px 12px;
    width: 100%;
  }
  button:hover {
    background: rgb(127 127 127 / 15%);
  }
  svg {
    fill: none;
    height: 20px;
    stroke: currentColor;
    stroke-width: 2;
    width: 20px;
  }
</style>

<script>
  import { getContext, tick } from 'svelte';
  import { viewerContext } from '../svelte/viewerContext';
  import { getLanguagesFromConfigWithCurrent } from '../state/selectors/config';

  let { availableLocales = [], locale, setLocale, t = (key) => key } = $props();
  const getViewer = getContext(viewerContext);
  const context = $derived(getViewer?.());
  const id = $props.id();
  const selected = $derived(availableLocales.includes(locale) ? locale : availableLocales[0]);
  const languages = $derived(context ? getLanguagesFromConfigWithCurrent(context.state) : []);
  let open = $state(false);
  let trigger = $state();
  let list = $state();
  function label(code) {
    const configured = languages.find((language) => language.locale === code);
    if (configured) return configured.label;
    try {
      return new Intl.DisplayNames([selected], { type: 'language' }).of(code) || code;
    } catch {
      return code;
    }
  }
  async function expand() {
    open = true;
    await tick();
    list?.querySelector('[aria-selected="true"]')?.focus();
  }
  function close() {
    open = false;
    trigger.focus();
  }
  function navigate(event) {
    if (event.key === 'Escape') close();
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    const options = Array.from(list.children);
    const offset = event.key === 'ArrowDown' ? 1 : -1;
    options[(options.indexOf(document.activeElement) + offset + options.length) % options.length].focus();
  }
</script>

{#if setLocale && availableLocales.length > 1}
  <div
    class="picker"
    onfocusout={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) open = false;
    }}
  >
    <button
      type="button"
      role="combobox"
      bind:this={trigger}
      aria-label={t('language')}
      aria-controls={id}
      aria-expanded={open}
      onclick={() => (open ? close() : expand())}
      onkeydown={(event) => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          expand();
        }
      }}
    >
      {label(selected)}
    </button>
    {#if open}
      <div tabindex="-1" role="listbox" {id} bind:this={list} aria-label={t('language')} onkeydown={navigate}>
        {#each availableLocales as code (code)}
          <button
            type="button"
            role="option"
            aria-selected={code === selected}
            onclick={() => {
              setLocale(code);
              close();
            }}
          >
            {label(code)}
          </button>
        {/each}
      </div>
    {/if}
  </div>
{/if}

<style>
  .picker {
    position: relative;
  }
  [role='listbox'] {
    position: absolute;
    z-index: 1;
    background: Canvas;
  }
  [role='option'] {
    display: block;
    width: 100%;
  }
</style>

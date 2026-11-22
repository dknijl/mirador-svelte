<script>
  import Connected from '../svelte/Connected.svelte';
  import PluginTarget from '../extend/PluginTarget.svelte';
  import SanitizedHtml from './SanitizedHtml.svelte';
  let {
    confirmButton,
    continueLabel,
    header,
    description,
    label,
    ruleSet = 'iiif',
    hasLogoutService = true,
    status,
    ConfirmProps = {},
    onConfirm = () => {},
    t = (key) => key,
    store,
    plugins = [],
  } = $props();
  const pluginProps = $derived({
    confirmButton,
    continueLabel,
    header,
    description,
    label,
    ruleSet,
    hasLogoutService,
    status,
    ConfirmProps,
    onConfirm,
  });
  let open = $state(false);
  function submit() {
    open = false;
    onConfirm();
  }
</script>

{#if status !== 'ok' || hasLogoutService}
  <section class="auth-bar">
    {#if !description && !header}
      <div class="topbar">
        <span aria-hidden="true" class="lock">▣</span>
        <h3>
          {#if ruleSet}<Connected
              name="SanitizedHtml"
              component={SanitizedHtml}
              targetProps={{ htmlString: label, ruleSet }}
            />{:else}{label}{/if}
        </h3>
        <PluginTarget name="WindowAuthenticationBar" {store} {plugins} targetProps={pluginProps} />
        <button type="button" onclick={submit} {...ConfirmProps}>{confirmButton || t('login')}</button>
      </div>
    {:else}
      <button type="button" class="collapser" aria-expanded={open} onclick={() => (open = !open)}>
        <span aria-hidden="true" class="lock">▣</span>
        <h3>
          {#if ruleSet}<Connected
              name="SanitizedHtml"
              component={SanitizedHtml}
              targetProps={{ htmlString: label, ruleSet }}
            />{:else}{label}{/if}
        </h3>
        <PluginTarget name="WindowAuthenticationBar" {store} {plugins} targetProps={pluginProps} />
        {#if !open}<span class="continue">{continueLabel || t('continue')}</span>{/if}
      </button>
      {#if open}
        <div class="details">
          <p>
            {#if ruleSet}<Connected
                name="SanitizedHtml"
                component={SanitizedHtml}
                targetProps={{ htmlString: header, ruleSet }}
              />{:else}{header}{/if}
            {#if header && description}:
            {/if}
            {#if ruleSet}<Connected
                name="SanitizedHtml"
                component={SanitizedHtml}
                targetProps={{ htmlString: description, ruleSet }}
              />{:else}{description}{/if}
          </p>
          <div class="actions">
            <button type="button" onclick={() => (open = false)}>{t('cancel')}</button>
            <button type="button" onclick={submit} {...ConfirmProps}>{confirmButton || t('login')}</button>
          </div>
        </div>
      {/if}
    {/if}
  </section>
{/if}

<style>
  .auth-bar {
    background: var(--mirador-secondary, #9c27b0);
    box-shadow: 0 4px 8px rgb(0 0 0 / 25%);
    color: var(--mirador-secondary-contrast, white);
  }
  .topbar {
    align-items: center;
    display: flex;
    gap: 8px;
    padding: 8px;
  }
  .topbar h3,
  .collapser h3 {
    color: inherit;
    flex: 1;
    font-size: 1rem;
    font-weight: 400;
    margin: 0;
  }
  button {
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    font: inherit;
    padding: 6px 10px;
  }
  .topbar > button,
  .actions > button:last-child {
    background: var(--mirador-secondary-contrast, white);
    color: var(--mirador-secondary, #9c27b0);
    line-height: 1.5rem;
  }
  .collapser {
    align-items: center;
    display: flex;
    gap: 12px;
    justify-content: flex-start;
    text-align: start;
    width: 100%;
  }
  .continue {
    margin-inline-start: auto;
  }
  .details {
    padding: 8px 16px 12px;
  }
  .details p {
    margin: 0;
  }
  .actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    padding-top: 10px;
  }
  .lock {
    font-size: 20px;
  }
</style>

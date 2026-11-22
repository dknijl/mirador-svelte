<script>
  import AccessTokenSender from './AccessTokenSender.svelte';
  import NewBrowserWindow from './NewBrowserWindow.svelte';
  import WindowAuthenticationBar from './WindowAuthenticationBar.svelte';

  let {
    accessTokenServiceId,
    authServiceId,
    confirm,
    description,
    failureDescription,
    failureHeader,
    features = 'centerscreen',
    handleAuthInteraction = () => {},
    header,
    isInteractive = true,
    label,
    logoutConfirm,
    logoutServiceId,
    openWindow,
    resetAuthenticationState = () => {},
    resolveAccessTokenRequest = () => {},
    resolveAuthenticationRequest = () => {},
    status = null,
    windowId,
    t = (key) => key,
    store,
    plugins = [],
  } = $props();

  function onReceiveAccessTokenMessage(payload) {
    resolveAccessTokenRequest(authServiceId, accessTokenServiceId, payload);
  }

  function defaultAuthBarProps() {
    return { authServiceId, hasLogoutService: Boolean(logoutServiceId), status, windowId };
  }

  function performLogout() {
    (openWindow || window.open.bind(window))(logoutServiceId, undefined, features);
    resetAuthenticationState({ authServiceId, tokenServiceId: accessTokenServiceId });
  }
</script>

{#if authServiceId}
  {#if status === null}
    {#if isInteractive}
      <WindowAuthenticationBar
        {header}
        {description}
        {label}
        confirmButton={confirm}
        onConfirm={() => handleAuthInteraction(windowId, authServiceId)}
        {...defaultAuthBarProps()}
        {store}
        {plugins}
        {t}
      />
    {/if}
  {:else if status === 'cookie'}
    {#if isInteractive}
      <WindowAuthenticationBar
        {header}
        {description}
        {label}
        confirmButton={confirm}
        onConfirm={() => handleAuthInteraction(windowId, authServiceId)}
        {...defaultAuthBarProps()}
        {store}
        {plugins}
        {t}
      />
    {/if}
    <NewBrowserWindow
      name="IiifLoginSender"
      url={`${authServiceId}?origin=${window.origin}`}
      {features}
      onClose={() => resolveAuthenticationRequest(authServiceId, accessTokenServiceId)}
    />
  {:else if status === 'token'}
    {#if isInteractive}
      <WindowAuthenticationBar
        {header}
        {description}
        {label}
        confirmButton={confirm}
        onConfirm={() => handleAuthInteraction(windowId, authServiceId)}
        {...defaultAuthBarProps()}
        {store}
        {plugins}
        {t}
      />
    {/if}
    <AccessTokenSender handleAccessTokenMessage={onReceiveAccessTokenMessage} url={accessTokenServiceId} />
  {:else if status === 'failed'}
    <WindowAuthenticationBar
      header={failureHeader}
      description={failureDescription}
      confirmButton={t('retry')}
      onConfirm={() => handleAuthInteraction(windowId, authServiceId)}
      {...defaultAuthBarProps()}
      {store}
      {plugins}
      {t}
    />
  {:else if status === 'ok' && (isInteractive || logoutServiceId)}
    <WindowAuthenticationBar
      confirmButton={logoutConfirm || t('logout')}
      onConfirm={performLogout}
      {...defaultAuthBarProps()}
      {store}
      {plugins}
      {t}
    />
  {/if}
{/if}

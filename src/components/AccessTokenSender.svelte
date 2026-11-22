<script>
  import IIIFIFrameCommunication from './IIIFIFrameCommunication.svelte';

  /** @type {{ handleAccessTokenMessage: (data: object) => void, url?: string }} */
  let { handleAccessTokenMessage, url = undefined } = $props();

  /** @param {MessageEvent} e */
  const onReceiveAccessTokenMessage = (e) => {
    if (e.data && e.data.messageId && e.data.messageId === url) handleAccessTokenMessage(e.data);
  };

  const src = $derived.by(() => {
    if (!url) return undefined;

    const value = new URL(url);
    value.searchParams.append('origin', window.origin);
    value.searchParams.append('messageId', url);

    return value.toString();
  });
</script>

<!-- login, clickthrough/kiosk open @id, wait for close; external, no-op -->
{#if src}
  <IIIFIFrameCommunication {src} title="AccessTokenSender" handleReceiveMessage={onReceiveAccessTokenMessage} />
{/if}

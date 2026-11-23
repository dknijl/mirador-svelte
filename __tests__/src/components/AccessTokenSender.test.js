// Exercise iframe markup and messages without loading the remote auth page.
// @vitest-environment jsdom
import AccessTokenSender from '@src/components/AccessTokenSender.svelte';
import { renderSvelte } from '@tests/utils/render-svelte';

function createWrapper(props) {
  return renderSvelte(AccessTokenSender, { handleAccessTokenMessage: () => {}, ...props });
}

describe('AccessTokenSender', () => {
  it('renders nothing if there is no url', () => {
    const { container } = createWrapper({});
    expect(container).toHaveProperty('childElementCount', 0);
    expect(container).toHaveTextContent(/^$/);
  });

  it('renders properly', () => {
    const { container } = createWrapper({ url: 'http://example.com' });

    expect(container.querySelector('iframe')).toHaveAttribute(
      'src',
      'http://example.com/?origin=http%3A%2F%2Flocalhost&messageId=http%3A%2F%2Fexample.com',
    );
  });

  it('triggers an action when the iframe sends a message', () => {
    const handleAccessTokenMessage = vi.fn();
    createWrapper({ handleAccessTokenMessage, url: 'http://example.com' });
    window.dispatchEvent(new MessageEvent('message', { data: { messageId: 'http://example.com' } }));
    expect(handleAccessTokenMessage).toHaveBeenCalledWith({ messageId: 'http://example.com' });
  });

  it('ignores iframe messages with the wrong messageId', () => {
    const handleAccessTokenMessage = vi.fn();
    createWrapper({ handleAccessTokenMessage, url: 'http://example.com' });
    window.dispatchEvent(new MessageEvent('message', { data: { messageId: 'http://example.com/123' } }));
    expect(handleAccessTokenMessage).not.toHaveBeenCalled();
  });
});

import NewBrowserWindow from '@src/components/NewBrowserWindow.svelte';
import { renderSvelte } from '@tests/utils/render-svelte';

function createWrapper(props) {
  return renderSvelte(NewBrowserWindow, { url: 'http://example.com/', onClose: () => {}, ...props });
}

describe('NewBrowserWindow', () => {
  it('renders properly and runs callbacks when the window closes', () => {
    const mockWindow = { close: vi.fn() };
    const open = vi.fn(() => mockWindow);
    const onClose = vi.fn();
    vi.useFakeTimers();

    createWrapper({ depWindow: { open }, onClose });
    expect(open).toHaveBeenCalledWith('http://example.com/', undefined, undefined);
    vi.runOnlyPendingTimers();
    expect(onClose).not.toBeCalled();
    mockWindow.closed = true;
    vi.runOnlyPendingTimers();
    expect(onClose).toBeCalled();

    vi.useRealTimers();
  });
});

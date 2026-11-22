import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import FullScreenButton from '@src/components/FullScreenButton.svelte';

describe('FullScreenButton', () => {
  let root;
  let requestFullscreen;
  const originalRequest = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'requestFullscreen');
  afterEach(() => {
    if (originalRequest) Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', originalRequest);
    else delete HTMLElement.prototype.requestFullscreen;
    delete document.exitFullscreen;
    Reflect.deleteProperty(document, 'fullscreenElement');
  });

  beforeEach(() => {
    requestFullscreen = vi.fn().mockImplementation(function enterFullscreen() {
      Object.defineProperty(document, 'fullscreenElement', { configurable: true, value: this });
      document.dispatchEvent(new Event('fullscreenchange'));
    });
    Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', { configurable: true, value: requestFullscreen });
    Object.defineProperty(document, 'exitFullscreen', {
      configurable: true,
      value: vi.fn().mockImplementation(() => {
        Object.defineProperty(document, 'fullscreenElement', { configurable: true, value: null });
        document.dispatchEvent(new Event('fullscreenchange'));
      }),
    });
  });

  it('enters and exits fullscreen for its viewer', async () => {
    const view = render(FullScreenButton, { class: 'window-fullscreen' });
    expect(screen.getByRole('button')).toHaveClass('window-fullscreen');
    root = view.container;
    root.classList.add('mirador-viewer-root');
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Full screen' }));
    expect(requestFullscreen).toHaveBeenCalledOnce();
    await user.click(screen.getByRole('button', { name: 'Exit full screen' }));
    expect(document.exitFullscreen).toHaveBeenCalledOnce();
  });
  it('hides the control when the platform cannot fullscreen a viewer', () => {
    __disableMockRequestFullscreen();
    delete HTMLElement.prototype.requestFullscreen;
    try {
      render(FullScreenButton);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    } finally {
      __mockRequestFullscreen();
    }
  });
});

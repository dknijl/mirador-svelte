import { markup, render, screen, fireEvent } from '@tests/utils/test-utils';
import ImageWithFallback from '@src/components/ImageWithFallback.svelte';

describe('ImageWithFallback', () => {
  it('renders the image', () => {
    render(ImageWithFallback, {
      src: 'http://example.org/image.jpg',
      alt: '',
      fallback: markup('<div data-testid="fallback"></div>'),
    });

    expect(screen.getByRole('presentation')).toHaveAttribute('src', 'http://example.org/image.jpg');
  });

  it('renders the fallback when the image fails to load', () => {
    render(ImageWithFallback, {
      src: 'http://example.org/image.jpg',
      alt: '',
      fallback: markup('<div data-testid="fallback"></div>'),
    });

    fireEvent.error(screen.getByRole('presentation'));

    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });

  it('notifies FailedImageContext when the image fails to load', () => {
    const notifyFailure = vi.fn();
    render(ImageWithFallback, {
      src: 'http://example.org/image.jpg',
      alt: '',
      notifyFailure,
      fallback: markup('<div data-testid="fallback"></div>'),
    });

    fireEvent.error(screen.getByRole('presentation'));

    expect(notifyFailure).toHaveBeenCalledWith('http://example.org/image.jpg');
  });

  it('recovers if a later src succeeds after an earlier one failed', () => {
    const { rerender } = render(ImageWithFallback, {
      src: 'http://example.org/bad.jpg',
      alt: '',
      fallback: markup('<div data-testid="fallback"></div>'),
    });

    fireEvent.error(screen.getByRole('presentation'));
    expect(screen.getByTestId('fallback')).toBeInTheDocument();

    rerender({ src: 'http://example.org/good.jpg', alt: '', fallback: markup('<div data-testid="fallback"></div>') });

    expect(screen.getByRole('presentation')).toHaveAttribute('src', 'http://example.org/good.jpg');
  });
});

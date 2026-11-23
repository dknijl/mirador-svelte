import { within, render, screen } from '@tests/utils/test-utils';
import ImageFailureMessage from '@src/components/ImageFailureMessage.svelte';

describe('ImageFailureMessage', () => {
  it('does not render when no images have failed', () => {
    const { container } = render(ImageFailureMessage, { imageUrls: ['https://example.com/image1.jpg'] });

    const contents = container.cloneNode(true);
    contents.normalize();
    expect(contents).toBeEmptyDOMElement();
    expect(within(container).queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders message when a specific image has failed', () => {
    const mockContext = {
      failedImages: new Set(['https://example.com/image1.jpg']),
      fallbackImage: 'data:image/svg+xml,...',
      notifyFailure: vi.fn(),
    };

    render(ImageFailureMessage, { imageUrls: ['https://example.com/image1.jpg'], ...mockContext });

    // Should use the default English translation
    expect(screen.getByText(/Problem loading image/i)).toBeInTheDocument();
    expect(screen.getByText(/See console for details/i)).toBeInTheDocument();
  });

  it('isolates failures per window', () => {
    const mockContext = {
      failedImages: new Set(['https://example.com/manifest-a/canvas-1/image.jpg']),
      fallbackImage: 'data:image/svg+xml,...',
      notifyFailure: vi.fn(),
    };

    // Render Window A with its failed image
    const { container: containerA } = render(ImageFailureMessage, {
      imageUrls: ['https://example.com/manifest-a/canvas-1/image.jpg'],
      ...mockContext,
    });

    expect(containerA).not.toBeEmptyDOMElement();
    expect(screen.getByText(/Problem loading image/i)).toBeInTheDocument();

    // Render Window B with non-failed image
    const { container: containerB } = render(ImageFailureMessage, {
      imageUrls: ['https://example.com/manifest-b/canvas-1/image.jpg'],
      ...mockContext,
    });

    const contents = containerB.cloneNode(true);
    contents.normalize();
    expect(contents).toBeEmptyDOMElement();
    expect(within(containerB).queryByRole('status')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    const mockContext = {
      failedImages: new Set(['https://example.com/image1.jpg']),
      fallbackImage: 'data:image/svg+xml,...',
      notifyFailure: vi.fn(),
    };

    render(ImageFailureMessage, { imageUrls: ['https://example.com/image1.jpg'], ...mockContext });

    const message = screen.getByText(/Problem loading image/i);
    const container = message.closest('[role="status"]'); // eslint-disable-line testing-library/no-node-access

    expect(container).toHaveAttribute('aria-live', 'polite');
  });
});

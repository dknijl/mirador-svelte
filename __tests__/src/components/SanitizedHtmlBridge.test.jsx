import { render, screen } from '@tests/utils/test-utils';
import { SanitizedHtml } from '@src/components/SanitizedHtml';

/**
 * These tests exercise the React -> Svelte bridge itself (prop updates and
 * teardown). happy-dom strips bare text nodes around tags inside DOMPurify, so
 * the assertions stick to plain text and attributes.
 */
describe('Svelte bridge (via SanitizedHtml)', () => {
  it('re-renders the Svelte component when React props change', () => {
    const { rerender } = render(<SanitizedHtml data-testid="subject" htmlString="before" ruleSet="iiif" />);

    expect(screen.getByTestId('subject')).toHaveTextContent('before');

    rerender(<SanitizedHtml data-testid="subject" htmlString="after" ruleSet="iiif" />);

    expect(screen.getByTestId('subject')).toHaveTextContent('after');
  });

  it('removes the Svelte DOM on unmount', () => {
    const { unmount } = render(<SanitizedHtml data-testid="subject" htmlString="gone soon" ruleSet="iiif" />);

    expect(screen.getByTestId('subject')).toBeInTheDocument();

    unmount();

    expect(screen.queryByTestId('subject')).not.toBeInTheDocument();
  });
});

// Use jsdom for this unit test because happy-dom and dompurify do not work together
// See https://github.com/capricorn86/happy-dom/issues/2182
// @vitest-environment jsdom
import { screen } from '@testing-library/dom';
import { mount, unmount } from 'svelte';
import SanitizedHtml from '@src/components/SanitizedHtml.svelte';

describe('SanitizedHtml', () => {
  let component;

  beforeEach(() => {
    component = mount(SanitizedHtml, {
      target: document.body,
      props: {
        'data-testid': 'subject',
        htmlString: `
          <b>Don't worry!</b>
          <a>Some link</a>
          <script data-testid='script' type='module'></script>`,
        ruleSet: 'iiif',
      },
    });
  });

  afterEach(() => unmount(component));

  it('should render needed elements', () => {
    expect(screen.getByTestId('subject')).toHaveProperty('tagName', 'SPAN');
  });

  it('should pass correct class name to root element', () => {
    expect(screen.getByTestId('subject')).toHaveClass('mirador-third-party-html');
  });

  it('renders sanitized HTML and protects links that open a new tab', () => {
    // eslint-disable-next-line testing-library/no-node-access, testing-library/prefer-presence-queries
    expect(screen.getByTestId('subject').querySelector('script')).not.toBeInTheDocument();
    expect(screen.getByText("Don't worry!")).toBeInTheDocument();
    expect(screen.getByText('Some link')).toHaveAttribute('target', '_blank');
    expect(screen.getByText('Some link')).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('removes script tags', () => {
    expect(screen.queryByTestId('script')).not.toBeInTheDocument();
  });
});

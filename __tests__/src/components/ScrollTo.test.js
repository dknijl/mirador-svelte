import { markup, render, screen } from '@tests/utils/test-utils';
import ScrollTo from '@src/components/ScrollTo.svelte';

describe('ScrollTo', () => {
  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
  const originalScrollTo = Element.prototype.scrollTo;
  const originalOffsetTop = Element.prototype.offsetTop;

  beforeEach(() => {
    Element.prototype.getBoundingClientRect = function mockBoundingClientRect() {
      if (this.dataset.mockboundingrect) {
        return JSON.parse(this.dataset.mockboundingrect);
      }

      return originalGetBoundingClientRect.call(this);
    };

    Element.prototype.scrollTo = vi.fn();
  });

  afterEach(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    Element.prototype.scrollTo = originalScrollTo;
    Element.prototype.offsetTop = originalOffsetTop;
  });

  it('renders the children', () => {
    render(ScrollTo, { children: markup('<div data-testid="a" />') });

    expect(screen.getByTestId('a')).toBeInTheDocument();
  });

  it.each([
    [150, 225, true],
    [25, 100, false],
  ])('scrolls only when the child lies outside the viewport (%s, %s)', (top, bottom, expected) => {
    const container = document.createElement('div');
    container.getBoundingClientRect = () => ({ top: 0, height: 100, bottom: 100 });
    render(ScrollTo, {
      container,
      scrollTo: true,
      children: markup(`<div data-mockboundingrect='${JSON.stringify({ top, bottom })}'></div>`),
    });
    expect(container.scrollTo).toHaveBeenCalledTimes(expected ? 1 : 0);
  });
});

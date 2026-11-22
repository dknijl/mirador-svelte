import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/dom';
import { renderSvelte } from '@tests/utils/render-svelte';
import ViewerNavigation from '@src/components/ViewerNavigation.svelte';

function renderNavigation(props = {}) {
  return renderSvelte(ViewerNavigation, {
    t: (key) => ({ previousCanvas: 'Previous item', nextCanvas: 'Next item' })[key],
    ...props,
  });
}

describe('ViewerNavigation', () => {
  it('disables unavailable directions and calls the available canvas action', async () => {
    const setNextCanvas = vi.fn();
    const setPreviousCanvas = vi.fn();
    renderNavigation({ hasNextCanvas: true, setNextCanvas, setPreviousCanvas });

    expect(screen.getByRole('button', { name: 'Next item' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Previous item' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Next item' }));
    expect(setNextCanvas).toHaveBeenCalledOnce();
    expect(setPreviousCanvas).not.toHaveBeenCalled();
  });

  it.each([
    ['right-to-left', 'rtl', 'rotate(180deg)'],
    ['top-to-bottom', 'ltr', 'rotate(90deg)'],
    ['bottom-to-top', 'ltr', 'rotate(270deg)'],
  ])('applies %s navigation direction', (viewingDirection, direction, nextRotation) => {
    renderNavigation({ hasNextCanvas: true, hasPreviousCanvas: true, viewingDirection });
    const next = screen.getByRole('button', { name: 'Next item' });
    // eslint-disable-next-line testing-library/no-node-access -- Verify the rendered element carrying the style or attribute.
    expect(next.parentElement).toHaveAttribute('dir', direction);
    // eslint-disable-next-line testing-library/no-node-access -- Verify the rendered element carrying the style or attribute.
    expect(next.querySelector('svg')).toHaveStyle({ transform: nextRotation });
  });
});

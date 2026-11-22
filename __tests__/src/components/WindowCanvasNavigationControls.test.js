import { render, screen, within } from '@tests/utils/test-utils';
import WindowCanvasNavigationControls from '@src/components/WindowCanvasNavigationControls.svelte';

function createWrapper(props = {}) {
  return render(WindowCanvasNavigationControls, { windowId: 'abc', ...props });
}

describe('WindowCanvasNavigationControls', () => {
  it('renders canvas navigation and info controls', () => {
    const { container } = createWrapper();
    expect(screen.getByRole('button', { name: 'Previous item' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next item' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Window navigation' })).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('.mirador-osd-navigation')).toBeInTheDocument();
  });

  it('keeps zoom, page navigation and the counter in one row', () => {
    const { container } = createWrapper({ showZoomControls: true });
    const controls = screen.getByRole('group', { name: 'Window navigation' });
    expect(within(controls).getByRole('button', { name: 'Zoom in' })).toBeVisible();
    expect(within(controls).getByRole('button', { name: 'Previous item' })).toBeVisible();
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('.mirador-canvas-nav')).toHaveStyle({ display: 'flex', flexWrap: 'nowrap' });
  });

  it('preserves canvas information for screen readers when visually hidden', () => {
    const { container } = createWrapper({ visible: false });
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('.visually-hidden')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('.mirador-osd-info')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('.mirador-canvas-nav')).not.toBeInTheDocument();
  });
});

import { render, screen, within } from '@tests/utils/test-utils';
import { WindowCanvasNavigationControls } from '@src/components/WindowCanvasNavigationControls';

/**
 * create a simple wrapper for rendering our component
 */
function Subject({ ...props }) {
  return <WindowCanvasNavigationControls canvases={[]} canvasLabel="label" windowId="abc" zoomToWorld={vi.fn()} {...props} />;
}

describe('WindowCanvasNavigationControls', () => {
  it('renders properly', async () => {
    const { container } = render(<Subject />);
    expect(screen.getByLabelText('Previous item', { selector: 'button' })).toBeInTheDocument();
    expect(screen.getByLabelText('Next item', { selector: 'button' })).toBeInTheDocument();
    expect(screen.getByText(/1 of/)).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).not.toHaveClass('mirador-canvas-nav-stacked');
  });

  it('renders only a screen-reader accessibile version when visible=false', () => {
    const { container } = render(<Subject visible={false} />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toHaveStyle({ height: '1px', margin: '-1px', width: '1px' });
  });

  it('shows the zoom control component when specified', () => {
    render(<Subject showZoomControls />);
    expect(screen.getByRole('button', { name: 'Zoom in' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zoom out' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset zoom' })).toBeInTheDocument();
  });

  it('keeps zoom, page navigation and the counter in a single row', () => {
    render(<Subject showZoomControls />);
    const controls = screen.getByRole('group', { name: 'Window navigation' });
    expect(controls).toHaveStyle({ display: 'flex', flexWrap: 'nowrap' });
    expect(within(controls).getByRole('button', { name: 'Zoom in' })).toBeVisible();
    expect(within(controls).getByRole('button', { name: 'Previous item' })).toBeVisible();
    expect(within(controls).getByText(/1 of/)).toBeVisible();
  });
});

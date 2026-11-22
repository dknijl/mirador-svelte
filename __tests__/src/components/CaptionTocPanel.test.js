import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import CaptionTocPanel from '@src/components/CaptionTocPanel.svelte';

/** */
function createWrapper(props) {
  return render(
    CaptionTocPanel,
    { id: 'cw-1', windowId: 'window-1', setCanvas: () => {}, ...props },
    {
      preloadedState: { companionWindows: { 'cw-1': { content: 'captionToc', position: 'right' } } },
    },
  );
}

describe('CaptionTocPanel', () => {
  it('renders the caption entries from the manifest', () => {
    createWrapper({
      entries: [
        { canvasCount: 2, canvasId: 'c1', depth: 0, hasChildren: true, id: 'r1', kind: 'range', label: 'Chapter 1' },
        { canvasId: 'c2', depth: 1, hasChildren: false, id: 'r1-0', kind: 'canvas', label: 'Front cover' },
      ],
    });

    expect(screen.getByRole('button', { name: 'Chapter 1 (2)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Front cover' })).toBeInTheDocument();
  });

  it('selects the canvas of the clicked entry', async () => {
    const setCanvas = vi.fn();
    createWrapper({
      entries: [{ canvasId: 'c2', depth: 0, hasChildren: false, id: 'r2', kind: 'canvas', label: 'Front cover' }],
      setCanvas,
    });

    await userEvent.setup().click(screen.getByRole('button', { name: 'Front cover' }));

    expect(setCanvas).toHaveBeenCalledWith('window-1', 'c2');
  });

  it('marks the current canvas', () => {
    createWrapper({
      entries: [{ canvasId: 'c2', depth: 0, hasChildren: false, id: 'r2', kind: 'canvas', label: 'Front cover' }],
      selectedCanvasIds: ['c2'],
    });

    expect(screen.getByRole('button', { name: 'Front cover' })).toHaveAttribute('aria-current', 'true');
  });

  it('shows an empty message when the manifest has no captions', () => {
    createWrapper({ entries: [] });

    expect(screen.getByText('This item has no table of contents.')).toBeInTheDocument();
  });
});

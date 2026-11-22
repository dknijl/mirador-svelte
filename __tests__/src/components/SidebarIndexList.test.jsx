import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { Utils } from 'manifesto.js';

import { SidebarIndexList } from '@src/components/SidebarIndexList';
import manifestJson from '../../fixtures/version-2/019.json';
import fivePageManifest from '../../fixtures/version-2/fg165hz3589.json';

/**
 * Helper function to create a shallow wrapper around SidebarIndexList
 */
function createWrapper(props) {
  const canvases = Utils.parseManifest(manifestJson).getSequences()[0].getCanvases();

  return render(
    <SidebarIndexList
      id="asdf"
      canvases={canvases}
      classes={{}}
      containerRef={{ current: null }}
      windowId="xyz"
      setCanvas={() => {}}
      config={{ canvasNavigation: { height: 100 } }}
      updateVariant={() => {}}
      selectedCanvasIds={[canvases[1].id]}
      {...props}
    />,
  );
}

/**
 * A five canvas manifest, so the grid has a full row and a partial row to
 * exercise boundary moves (there is no sixth tile to land on).
 */
function createFivePageWrapper(props) {
  const canvases = Utils.parseManifest(fivePageManifest).getSequences()[0].getCanvases();

  return render(
    <SidebarIndexList
      canvases={canvases}
      containerRef={{ current: null }}
      setCanvas={() => {}}
      selectedCanvasIds={[canvases[0].id]}
      variant="thumbnail"
      windowId="xyz"
      {...props}
    />,
  );
}

describe('SidebarIndexList', () => {
  let setCanvas;

  beforeEach(() => {
    setCanvas = vi.fn();
  });

  it('renders all needed elements for the thumbnail view', () => {
    const { container } = createWrapper({ variant: 'thumbnail' });

    expect(screen.getByRole('menuitem', { name: 'Test 19 Canvas: 1' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Image 1' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Image 2' })).toBeInTheDocument();

    // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
    expect(container.querySelectorAll('img').length).toBe(3);

    expect(screen.getByRole('menuitem', { name: 'Image 1' })).toHaveClass('Mui-selected');
  });

  it('renders all needed elements for the item view', () => {
    createWrapper({ variant: 'item' });

    expect(screen.getAllByRole('menuitem').length).toBe(3);
    expect(screen.getByRole('menuitem', { name: 'Image 1' })).toHaveClass('Mui-selected');
  });

  it('should call the onClick handler of a list item', async () => {
    const user = userEvent.setup();
    createWrapper({ setCanvas });
    await user.click(screen.getByRole('menuitem', { name: 'Image 2' }));

    expect(setCanvas).toHaveBeenCalledWith('xyz', 'https://purl.stanford.edu/rz176rt6531/iiif/canvas/rz176rt6531_1');
  });

  it('lays out the thumbnail variant as a two-column grid', () => {
    createWrapper({ variant: 'thumbnail' });

    const list = screen.getByRole('menu');
    const styles = getComputedStyle(list);

    expect(styles.display).toBe('grid');
    expect(styles.gridTemplateColumns).toContain('repeat(2');
  });

  it('keeps the item variant as a single-column list', () => {
    createWrapper({ variant: 'item' });

    expect(getComputedStyle(screen.getByRole('menu')).display).not.toBe('grid');
  });

  it('moves focus by grid position in the thumbnail variant', async () => {
    const user = userEvent.setup();
    createFivePageWrapper();

    const items = screen.getAllByRole('menuitem');
    items[0].focus();

    // With two columns, Down moves one row and Left/Right move one tile.
    await user.keyboard('{ArrowDown}');
    expect(items[2]).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(items[3]).toHaveFocus();

    // Right at the end of a row stays in place instead of jumping a row.
    await user.keyboard('{ArrowRight}');
    expect(items[3]).toHaveFocus();

    await user.keyboard('{ArrowLeft}{ArrowUp}');
    expect(items[0]).toHaveFocus();

    // A partial last row cannot be reached by moving down from the left column.
    items[4].focus();
    await user.keyboard('{ArrowDown}');
    expect(items[4]).toHaveFocus();

    await user.keyboard('{End}');
    expect(items[4]).toHaveFocus();

    await user.keyboard('{Home}');
    expect(items[0]).toHaveFocus();
  });

  it('does not apply grid navigation to the item variant', async () => {
    const user = userEvent.setup();
    createWrapper({ variant: 'item' });

    const items = screen.getAllByRole('menuitem');
    items[0].focus();

    await user.keyboard('{ArrowDown}');
    expect(items[1]).toHaveFocus();
  });

  describe('in a right-to-left layout', () => {
    let originalDir;

    beforeEach(() => {
      originalDir = document.documentElement.dir;
      document.documentElement.dir = 'rtl';
    });

    afterEach(() => {
      document.documentElement.dir = originalDir;
    });

    it('mirrors the horizontal arrow keys with the layout direction', async () => {
      const user = userEvent.setup();
      const { container } = createFivePageWrapper();

      // The test DOM does not inherit the document direction on its own; in the
      // app the `dir` attribute comes from the window's viewing direction.
      // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
      container.querySelector('[role="menu"]').setAttribute('dir', 'rtl');

      const items = screen.getAllByRole('menuitem');
      items[0].focus();

      // Column 1 is visually on the left in RTL, so that is where Left goes.
      await user.keyboard('{ArrowLeft}');
      expect(items[1]).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(items[1]).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(items[0]).toHaveFocus();
    });
  });

  it('marks only the current canvas as aria-current', () => {
    createWrapper({ variant: 'thumbnail' });

    expect(screen.getByRole('menuitem', { name: 'Image 1' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('menuitem', { name: 'Image 2' })).not.toHaveAttribute('aria-current');
  });
});

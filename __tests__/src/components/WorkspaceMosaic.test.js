import { createRawSnippet } from 'svelte';
import { render, screen, fireEvent } from '@tests/utils/test-utils';

import WorkspaceMosaic from '@src/components/WorkspaceMosaic.svelte';

const tile = createRawSnippet((id) => ({
  render: () =>
    `<section id="${id()}" aria-label="Window:"><nav data-mosaic-handle draggable="true" aria-label="Window navigation"></nav></section>`,
}));
/** create wrapper */
function createWrapper(props) {
  return render(
    WorkspaceMosaic,
    { tile, classes: {}, windowIds: [], workspaceId: 'foo', updateWorkspaceMosaicLayout: () => {}, ...props },
    {
      preloadedState: {
        windows: {
          1: { companionWindowIds: [] },
          2: { companionWindowIds: [] },
          3: { companionWindowIds: [] },
        },
      },
    },
  );
}

/* eslint-disable testing-library/no-node-access */
describe('WorkspaceMosaic', () => {
  const windowIds = ['1', '2'];
  let wrapper;
  it('should render properly with an initialValue', () => {
    wrapper = createWrapper({ windowIds });
    const tiles = wrapper.container.querySelectorAll('.mosaic-tile');

    expect(tiles).toHaveLength(2);
    expect(tiles[0]).toHaveStyle({
      bottom: '0%',
      left: '0%',
      right: '50%',
      top: '0%',
    });
    expect(tiles[1]).toHaveStyle({
      bottom: '0%',
      left: '50%',
      right: '0%',
      top: '0%',
    });
  });

  describe('componentDidUpdate', () => {
    it('updates the workspace layout when windows change', () => {
      const updateWorkspaceMosaicLayout = vi.fn();
      wrapper = createWrapper({
        updateWorkspaceMosaicLayout,
        windowIds,
      });

      wrapper.rerender({
        classes: {},
        windowIds: ['1', '2', '3'],
        workspaceId: 'foo',
        updateWorkspaceMosaicLayout: updateWorkspaceMosaicLayout,
      });

      expect(updateWorkspaceMosaicLayout).toHaveBeenCalled();
    });
    it('updates the workspace layout when windows are removed', () => {
      const updateWorkspaceMosaicLayout = vi.fn();
      const props = {
        classes: {},
        layout: { type: 'split', direction: 'row', children: ['1', '2'] },
        updateWorkspaceMosaicLayout,
        windowIds,
        workspaceId: 'foo',
      };
      wrapper = createWrapper(props);

      wrapper.rerender({ ...props, windowIds: ['1'] });

      expect(updateWorkspaceMosaicLayout).toHaveBeenLastCalledWith('1');
    });
    it('when no windows remain', () => {
      const updateWorkspaceMosaicLayout = vi.fn();
      wrapper = createWrapper({
        updateWorkspaceMosaicLayout,
        windowIds,
      });

      wrapper.rerender({
        layout: {},
        classes: {},
        windowIds: [],
        workspaceId: 'foo',
        updateWorkspaceMosaicLayout: updateWorkspaceMosaicLayout,
      });
      expect(updateWorkspaceMosaicLayout).toHaveBeenLastCalledWith(null);
    });
    it('when the new and old layouts are the same', () => {
      const updateWorkspaceMosaicLayout = vi.fn();
      wrapper = createWrapper({
        layout: { type: 'split', direction: 'row', children: ['1', '2'] },
        updateWorkspaceMosaicLayout,
        windowIds,
      });

      wrapper.rerender({
        classes: {},
        windowIds: windowIds,
        layout: { type: 'split', direction: 'row', children: ['1', '2'] },
        workspaceId: 'foo',
        updateWorkspaceMosaicLayout: updateWorkspaceMosaicLayout,
      });

      expect(updateWorkspaceMosaicLayout).toHaveBeenCalledTimes(0);
    });
  });
  describe('tile rendering', () => {
    it('when window is available', () => {
      wrapper = createWrapper({ windowIds });

      expect(screen.getAllByLabelText('Window:', { container: 'section' })[0]).toHaveAttribute('id', '1');
      expect(screen.getAllByLabelText('Window:', { container: 'section' })[1]).toHaveAttribute('id', '2');

      expect(wrapper.container.querySelectorAll('.mosaic-window')).toHaveLength(2);
      expect(screen.getByRole('button', { name: 'Resize window widths' })).toBeInTheDocument();
    });
  });
  describe('mosaicChange', () => {
    it('calls the provided prop to update layout', async () => {
      const updateWorkspaceMosaicLayout = vi.fn();

      const { container } = render(
        WorkspaceMosaic,
        {
          tile,
          classes: {},
          windowIds: ['1', '2'],
          workspaceId: 'foo',
          updateWorkspaceMosaicLayout: updateWorkspaceMosaicLayout,
        },
        {
          preloadedState: {
            windows: {
              1: { companionWindowIds: [], maximized: false },
              2: { companionWindowIds: [], maximized: false },
            },
            workspace: {
              type: 'mosaic',
              windowIds: ['1', '2'],
            },
          },
        },
      );

      const dragTarget = screen.getAllByLabelText('Window navigation')[0];

      const dropTarget = container.querySelector('.mirador-mosaic > .drop-target-container > .drop-target.top');

      fireEvent.dragStart(dragTarget);
      fireEvent.drag(dragTarget);
      fireEvent.dragEnter(dropTarget);
      fireEvent.dragOver(dropTarget);
      fireEvent.drop(dropTarget);

      expect(updateWorkspaceMosaicLayout).toHaveBeenLastCalledWith({
        type: 'split',
        direction: 'column',
        children: ['1', '2'],
      });
    });
  });
});

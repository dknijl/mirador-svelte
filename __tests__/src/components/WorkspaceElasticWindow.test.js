import userEvent from '@testing-library/user-event';
import { render, markup } from '@tests/utils/test-utils';

import WorkspaceElasticWindow from '@src/components/WorkspaceElasticWindow.svelte';

/** create wrapper */
function createWrapper(props) {
  return render(
    WorkspaceElasticWindow,
    {
      layout: {},
      children: markup('<nav class="mirador-window-top-bar">Title</nav>'),
      workspace: {
        focusedWindowId: '2',
        height: 5000,
        viewportPosition: {
          x: 20,
          y: 20,
        },
        width: 5000,
      },
      updateElasticWindowLayout: () => {},
      ...props,
    },
    {
      preloadedState: {
        companionWindows: {},
        windows: { 1: { companionWindowIds: [] } },
        workspace: {},
      },
    },
  );
}

/* eslint-disable testing-library/no-node-access */
describe('WorkspaceElasticWindow', () => {
  const layout = {
    height: 200,
    width: 200,
    windowId: '1',
    x: 20,
    y: 20,
  };

  it('should render properly with an initialValue', () => {
    const { container } = createWrapper({ layout });
    const el = container.firstChild;

    expect(el).toHaveClass('elastic-window');
    expect(el).toHaveStyle({
      height: '200px',
      left: '2520px',
      top: '2520px',
      width: '200px',
    });
  });
  describe('focuses the window', () => {
    it('calls focusWindow when clicked', async () => {
      const user = userEvent.setup();
      const mockFocusWindow = vi.fn();
      const { container } = createWrapper({ focusWindow: mockFocusWindow, layout });
      const topBar = container.querySelector('.mirador-window-top-bar');
      await user.click(topBar);

      expect(mockFocusWindow).toHaveBeenCalled();
    });
  });
  describe('window behaviour', () => {
    it('when windows are dragged', async () => {
      const user = userEvent.setup();
      const mockDragStop = vi.fn();
      const { container } = createWrapper({
        layout,
        updateElasticWindowLayout: mockDragStop,
      });

      const el = container.querySelector('.mirador-window-top-bar');

      const coords = {
        clientX: 200,
        clientY: 200,
      };

      await user.pointer([
        { keys: '[MouseLeft>]', target: el },
        { coords, keys: '[/MouseLeft]', target: el },
      ]);

      expect(mockDragStop).toHaveBeenCalledWith('1', {
        x: 20 + 200,
        y: 20 + 200,
      });
    });
    it('when windows are resized', async () => {
      const user = userEvent.setup();
      const mockOnResize = vi.fn();
      const { container } = createWrapper({
        layout,
        updateElasticWindowLayout: mockOnResize,
      });

      container.getBoundingClientRect = () => ({
        left: -2500,
        offsetHeight: 5000,
        offsetWidth: 5000,
        top: -2500,
      });

      const el = container.querySelector('[data-resize="se"]');

      const oldCoords = {
        clientX: 0,
        clientY: 0,
      };

      const coords = {
        clientX: 400,
        clientY: 200,
      };

      await user.pointer([
        { coords: oldCoords, keys: '[MouseLeft>]', target: el },
        { coords },
        { coords, keys: '[/MouseLeft]', target: el },
      ]);
      expect(mockOnResize).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          height: 400,
          width: 600,
        }),
      );
    });
  });
});

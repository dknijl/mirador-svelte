import { render, screen } from '@tests/utils/test-utils';

import Window from '@src/components/Window.svelte';

/** create wrapper */
function createWrapper(props, state, renderOptions) {
  return render(
    Window,
    { windowId: 'xyz', manifestId: 'foo', classes: {}, ...props },
    {
      preloadedState: {
        windows: {
          xyz: {
            collectionDialogOn: false,
            companionWindowIds: [],
          },
        },
      },
    },
    { renderOptions },
  );
}

describe('Window', () => {
  it('should render outer element', () => {
    createWrapper();
    expect(screen.getByLabelText('Window:')).toHaveClass('mirador-window');
  });
  it('should render <WindowTopBar>', () => {
    createWrapper();
    expect(screen.getByRole('navigation', { accessibleName: 'Window navigation' })).toBeInTheDocument();
  });
  it('should render <PrimaryWindow>', () => {
    createWrapper();
    // eslint-disable-next-line testing-library/no-node-access
    expect(document.querySelector('.mirador-primary-window')).toBeInTheDocument();
  });
  // See ErrorContent.test.js for futher testing of this functionality
  it('renders alert box when there is an error', async () => {
    createWrapper({ manifestError: 'Invalid JSON' });
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
  it.each([true, false])('makes the mosaic toolbar draggable when enabled (%s)', (enabled) => {
    createWrapper({ windowDraggable: enabled, workspaceType: 'mosaic' });
    const toolbar = screen.getByRole('navigation', { name: 'Window navigation' });
    if (enabled) expect(toolbar).toHaveAttribute('draggable', 'true');
    else expect(toolbar).not.toHaveAttribute('draggable');
  });
});

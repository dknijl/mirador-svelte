import WindowTopMenuButton from '@src/components/WindowTopMenuButton.svelte';
import WindowTopBarPluginArea from '@src/components/WindowTopBarPluginArea.svelte';
import WindowTopBarPluginMenu from '@src/components/WindowTopBarPluginMenu.svelte';
import ValidPlugin from '@tests/integration/components/ValidPluginA.svelte';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/dom';
import { renderSvelte } from '@tests/utils/render-svelte';
import WindowTopBar from '@src/components/WindowTopBar.svelte';

function renderTopBar(props = {}) {
  return renderSvelte(WindowTopBar, {
    windowId: 'xyz',
    store: { getState: () => ({}), subscribe: () => () => {} },
    t: (key) =>
      ({
        windowNavigation: 'Window navigation',
        showWindowSideBar: 'Show sidebar',
        windowMenu: 'Window menu',
        windowPluginMenu: 'Window plugins',
        maximizeWindow: 'Maximize window',
        closeWindow: 'Close window',
      })[key] ?? key,
    maximizeWindow: vi.fn(),
    minimizeWindow: vi.fn(),
    removeWindow: vi.fn(),
    toggleWindowSideBar: vi.fn(),
    ...props,
  });
}

describe('WindowTopBar', () => {
  it('renders the enabled window controls and calls their actions', async () => {
    const maximizeWindow = vi.fn();
    const toggleWindowSideBar = vi.fn();
    const removeWindow = vi.fn();
    renderTopBar({ maximizeWindow, toggleWindowSideBar, removeWindow });

    await userEvent.click(screen.getByRole('button', { name: 'Show sidebar' }));
    await userEvent.click(screen.getByRole('button', { name: 'Maximize window' }));
    await userEvent.click(screen.getByRole('button', { name: 'Close window' }));

    expect(toggleWindowSideBar).toHaveBeenCalledOnce();
    expect(maximizeWindow).toHaveBeenCalledOnce();
    expect(removeWindow).toHaveBeenCalledOnce();
  });

  it('omits controls disabled by configuration', () => {
    renderTopBar({ allowClose: false, allowMaximize: false, allowWindowSideBar: false, allowTopMenuButton: false });
    expect(screen.queryByRole('button', { name: 'Close window' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Maximize window' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Show sidebar' })).not.toBeInTheDocument();
  });
});

const plugin = {
  component: ValidPlugin,
  mode: 'add',
  target: 'WindowTopBarPluginMenu',
};

describe('Svelte window plugin targets', () => {
  it('renders plugins in the top bar plugin area', () => {
    renderSvelte(WindowTopBarPluginArea, {
      windowId: 'xyz',
      plugins: [{ ...plugin, target: 'WindowTopBarPluginArea' }],
    });
    expect(screen.getByTestId('valid-plugin-a')).toBeInTheDocument();
  });

  it('shows the plugin menu when extensions are registered and closes with Escape', async () => {
    renderSvelte(WindowTopBarPluginMenu, {
      windowId: 'xyz',
      plugins: [plugin],
      t: (key) => ({ windowPluginMenu: 'Window plugins' })[key] ?? key,
    });
    await userEvent.click(screen.getByRole('button', { name: 'Window plugins' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByTestId('valid-plugin-a')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens and closes the window settings menu', async () => {
    renderSvelte(WindowTopMenuButton, {
      windowId: 'xyz',
      t: (key) => ({ windowMenu: 'Window menu' })[key] ?? key,
    });
    await userEvent.click(screen.getByRole('button', { name: 'Window menu' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

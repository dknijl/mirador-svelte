import { render, screen, fireEvent } from '@tests/utils/test-utils';
import AddComponent from '../../integration/components/AddComponentC.svelte';
import WindowTopBarPluginMenu from '@src/components/WindowTopBarPluginMenu.svelte';

const pluginFor = (target) => ({ target, mode: 'add', component: AddComponent });

describe('WindowTopBarPluginMenu', () => {
  it('renders nothing when the target has no plugins', () => {
    const { container } = render(WindowTopBarPluginMenu, { windowId: 'abc123', plugins: [] });
    const contents = container.cloneNode(true);
    contents.normalize();
    expect(contents).toBeEmptyDOMElement();
    expect(screen.queryByRole('button', { name: 'Window options' })).not.toBeInTheDocument();
  });

  it('renders its button when the default target has plugins', () => {
    render(WindowTopBarPluginMenu, {
      windowId: 'abc123',
      plugins: [pluginFor('WindowTopBarPluginMenu')],
    });
    expect(screen.getByRole('button', { name: 'Window options' })).toBeInTheDocument();
  });

  it('opens and closes the plugin menu from the button and Escape', async () => {
    render(WindowTopBarPluginMenu, {
      windowId: 'abc123',
      plugins: [pluginFor('WindowTopBarPluginMenu')],
    });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Window options' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('Plugin C')).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('uses a custom plugin target when provided', async () => {
    render(WindowTopBarPluginMenu, {
      windowId: 'abc123',
      pluginTarget: 'CustomPluginTarget',
      plugins: [pluginFor('CustomPluginTarget')],
    });
    fireEvent.click(screen.getByRole('button', { name: 'Window options' }));
    expect(screen.getByText('Plugin C')).toBeInTheDocument();
  });

  it('ignores plugins registered for other targets', () => {
    render(WindowTopBarPluginMenu, {
      windowId: 'abc123',
      plugins: [pluginFor('WindowTopMenu')],
    });
    expect(screen.queryByRole('button', { name: 'Window options' })).not.toBeInTheDocument();
  });
});

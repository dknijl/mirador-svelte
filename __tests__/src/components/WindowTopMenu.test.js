import { render, screen, within, fireEvent } from '@tests/utils/test-utils';
import AddComponent from '../../integration/components/AddComponentC.svelte';
import WindowTopMenu from '@src/components/WindowTopMenu.svelte';

const makePlugin = { target: 'WindowTopMenu', mode: 'add', component: AddComponent };

describe('WindowTopMenu', () => {
  it('renders its view, thumbnail and caption menu sections', () => {
    render(WindowTopMenu, { windowId: 'xyz', id: 'menu', handleClose: () => {} });
    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();
    expect(within(menu).getByText('View')).toBeInTheDocument();
    expect(within(menu).getByText('Thumbnails')).toBeInTheDocument();
    expect(within(menu).getByText('Table of contents')).toBeInTheDocument();
  });

  it('closes after a view selection', async () => {
    const handleClose = vi.fn();
    render(WindowTopMenu, { windowId: 'xyz', handleClose });
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Single' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('hides thumbnail settings when configured', () => {
    render(WindowTopMenu, { windowId: 'xyz', showThumbnailNavigationSettings: false });
    expect(screen.queryByText('Thumbnails')).not.toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
  });

  it('renders the plugin section and registered plugin', () => {
    render(WindowTopMenu, { windowId: 'xyz', pluginList: [makePlugin] });
    expect(screen.getByText('Options')).toBeInTheDocument();
    expect(screen.getByText('Plugin C')).toBeInTheDocument();
  });
});

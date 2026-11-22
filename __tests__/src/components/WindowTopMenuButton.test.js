import { render, screen, fireEvent } from '@tests/utils/test-utils';
import WindowTopMenuButton from '@src/components/WindowTopMenuButton.svelte';

describe('WindowTopMenuButton', () => {
  const props = { windowId: 'xyz' };

  it('renders the menu button', () => {
    render(WindowTopMenuButton, props);
    expect(screen.getByRole('button', { name: 'Window views & thumbnail display' })).toBeInTheDocument();
  });

  it('toggles the top menu when clicked', async () => {
    render(WindowTopMenuButton, props);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Window views & thumbnail display' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('has no aria-owns reference while closed', () => {
    render(WindowTopMenuButton, props);
    expect(screen.getByRole('button', { name: 'Window views & thumbnail display' })).not.toHaveAttribute('aria-owns');
  });

  it('sets its aria-owns reference while open', async () => {
    render(WindowTopMenuButton, props);
    const button = screen.getByRole('button', { name: 'Window views & thumbnail display' });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-owns');
  });
});

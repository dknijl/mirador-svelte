import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import WindowList from '@src/components/WindowList.svelte';

describe('WindowList', () => {
  it('opens the menu when there are no windows', () => {
    render(WindowList, { windowIds: [] });
    expect(screen.getByRole('menu')).toBeVisible();
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });
  it('renders an open-window menu and focuses the selected window', async () => {
    const focusWindow = vi.fn();
    const handleClose = vi.fn();
    render(WindowList, {
      windowIds: ['one', 'two'],
      titles: { one: 'One', two: 'Two' },
      focusedWindowId: 'two',
      focusWindow,
      handleClose,
    });
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Two' })).toHaveFocus();
    await userEvent.setup().click(screen.getByRole('menuitem', { name: 'One' }));
    expect(focusWindow).toHaveBeenCalledWith('one', true);
    expect(handleClose).toHaveBeenCalled();
  });

  it('uses a fallback title for untitled windows', async () => {
    const focusWindow = vi.fn();
    const handleClose = vi.fn();
    render(WindowList, { windowIds: ['one'], titles: {}, focusWindow, handleClose });
    await userEvent.setup().click(screen.getByRole('menuitem', { name: '[Untitled]' }));
    expect(focusWindow).toHaveBeenCalledWith('one', true);
    expect(handleClose).toHaveBeenCalledOnce();
  });
});

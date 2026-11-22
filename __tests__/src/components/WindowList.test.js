import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import WindowList from '@src/components/WindowList.svelte';

describe('WindowList', () => {
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

  it('uses a fallback title for untitled windows', () => {
    render(WindowList, { windowIds: ['one'], titles: {} });
    expect(screen.getByRole('menuitem', { name: '[Untitled]' })).toBeInTheDocument();
  });
});

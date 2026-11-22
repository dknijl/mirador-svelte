import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import ChangeThemeDialog from '@src/components/ChangeThemeDialog.svelte';

/**
 * Helper function to create a shallow wrapper around ErrorDialog
 */
function createWrapper(props) {
  render(ChangeThemeDialog, {
    classes: { darkColor: '#000000', lightColor: '#ffffff' },
    handleClose: () => {},
    open: true,
    setSelectedTheme: () => {},
    selectedTheme: 'light',
    themeIds: ['light', 'dark'],
    ...props,
  });
}

describe('ChangeThemeDialog', () => {
  it('renders nothing when the dialog is not open', () => {
    createWrapper({ open: false });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders propertly', () => {
    createWrapper();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows up theme selection properly', () => {
    createWrapper();

    const themeButtons = screen.queryAllByRole('button', { name: /theme/i });

    expect(themeButtons).toHaveLength(2);
    expect(themeButtons[0]).toHaveTextContent('Light theme');
    expect(themeButtons[1]).toHaveTextContent('Dark theme');
  });

  it('shows up theme selection properly', async () => {
    const user = userEvent.setup();
    const setSelectedTheme = vi.fn();

    createWrapper({ setSelectedTheme });
    const themeButton = screen.getByRole('button', { name: 'Light theme' });
    expect(themeButton).toBeInTheDocument();

    await user.click(themeButton);

    expect(setSelectedTheme).toHaveBeenCalledWith('light');
  });

  describe('inital focus', () => {
    it('focuses the selected item', () => {
      createWrapper({ selectedTheme: 'light' });

      const themeButton = screen.getByRole('button', { name: 'Light theme' });
      expect(themeButton).toHaveFocus();
    });
  });
});

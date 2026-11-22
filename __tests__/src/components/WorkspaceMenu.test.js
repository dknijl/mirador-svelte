import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import WorkspaceMenu from '@src/components/WorkspaceMenu.svelte';

describe('Workspace settings menu', () => {
  it('renders when open and toggles zoom controls', async () => {
    const toggleZoomControls = vi.fn();
    const handleClose = vi.fn();
    render(WorkspaceMenu, { open: true, handleClose, showZoomControls: false, toggleZoomControls });
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole('menuitem', { name: 'Show zoom controls' }));
    expect(toggleZoomControls).toHaveBeenCalledWith(true);
    expect(handleClose).toHaveBeenCalled();
  });

  it('disables zoom controls while the add panel is visible', () => {
    render(WorkspaceMenu, { open: true, isWorkspaceAddVisible: true });
    expect(screen.getByRole('menuitem', { name: 'Show zoom controls' })).toBeDisabled();
  });

  it('does not render when closed', () => {
    render(WorkspaceMenu, { open: false });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import WorkspaceOptionsMenu from '@src/components/WorkspaceOptionsMenu.svelte';

describe('WorkspaceOptionsMenu', () => {
  it('shows workspace import and export commands when open', () => {
    render(WorkspaceOptionsMenu, { open: true });
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem').map((item) => item.textContent.trim())).toEqual([
      'Export workspace',
      'Import workspace',
    ]);
  });

  it('opens the export dialog', async () => {
    const handleClose = vi.fn();
    render(WorkspaceOptionsMenu, { open: true, handleClose });
    expect(screen.queryByRole('heading', { name: 'Export workspace' })).not.toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole('menuitem', { name: 'Export workspace' }));
    expect(screen.getByRole('dialog', { name: 'Export workspace' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Export workspace' })).toBeInTheDocument();
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('opens the import dialog', async () => {
    const handleClose = vi.fn();
    render(WorkspaceOptionsMenu, { open: true, handleClose });
    expect(screen.queryByRole('heading', { name: 'Import workspace' })).not.toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole('menuitem', { name: 'Import workspace' }));
    expect(screen.getByRole('dialog', { name: 'Import workspace' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Import workspace' })).toBeInTheDocument();
    expect(handleClose).toHaveBeenCalledOnce();
  });
  it('hides the commands when closed', () => {
    render(WorkspaceOptionsMenu, { open: false });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

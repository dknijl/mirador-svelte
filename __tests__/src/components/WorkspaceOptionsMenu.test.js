import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import WorkspaceOptionsMenu from '@src/components/WorkspaceOptionsMenu.svelte';

describe('WorkspaceOptionsMenu', () => {
  it('shows workspace import and export commands when open', () => {
    render(WorkspaceOptionsMenu, { open: true });
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });

  it('opens the export dialog', async () => {
    render(WorkspaceOptionsMenu, { open: true });
    await userEvent.setup().click(screen.getByRole('menuitem', { name: 'Export workspace' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('opens the import dialog', async () => {
    render(WorkspaceOptionsMenu, { open: true });
    await userEvent.setup().click(screen.getByRole('menuitem', { name: 'Import workspace' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

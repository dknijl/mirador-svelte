import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import WorkspaceOptionsButton from '@src/components/WorkspaceOptionsButton.svelte';

describe('WorkspaceOptionsButton', () => {
  it('opens its menu and displays import/export actions', async () => {
    render(WorkspaceOptionsButton, {});
    const button = screen.getByRole('button', { name: 'Workspace options' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await userEvent.setup().click(button);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Export workspace' })).toBeInTheDocument();
    await userEvent.setup().click(button);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

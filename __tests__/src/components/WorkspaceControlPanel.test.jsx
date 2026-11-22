import { render, screen } from '@tests/utils/test-utils';

import { WorkspaceControlPanel } from '@src/components/WorkspaceControlPanel';

describe('WorkspaceControlPanel', () => {
  beforeEach(() => {
    render(<WorkspaceControlPanel />, {
      preloadedState: {
        workspace: { windowIds: ['xyz'] },
      },
    });
  });

  it('renders without an error', () => {
    expect(screen.getByRole('navigation', { name: 'Workspace navigation' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add resource' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Jump to window' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Workspace settings' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Workspace options' })).toBeInTheDocument();
    const logo = screen.getByRole('link', { name: 'Kokudor (GitHub)' });
    expect(logo).toHaveTextContent('K');
    expect(logo).toHaveAttribute('href', 'https://github.com/dknijl/mirador-svelte');
  });
});

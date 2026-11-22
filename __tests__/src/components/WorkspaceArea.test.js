import { render, screen, within } from '@tests/utils/test-utils';

import WorkspaceArea from '@src/components/WorkspaceArea.svelte';

/** */
function createWrapper(props) {
  return render(WorkspaceArea, {
    isWorkspaceControlPanelVisible: true,
    classes: {},
    lang: 'en',
    controlPanelVariant: 'wide',
    ...props,
  });
}

describe('WorkspaceArea', () => {
  it('should render outer element correctly', () => {
    createWrapper();

    expect(screen.getByRole('main')).toHaveClass('mirador-viewer');
    expect(screen.getByRole('main')).toHaveAttribute('lang', 'en');
  });

  it('should render all needed elements', () => {
    const { container } = createWrapper();

    expect(screen.getByRole('button', { name: 'Jump to window' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Workspace settings' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Workspace options' })).toBeInTheDocument();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Kokudor viewer');
    expect(screen.getByRole('main')).toHaveTextContent('Welcome to Kokudor');

    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('.mirador-background-plugin-area')).toBeInTheDocument();
  });

  it('should not render WorkspaceControlPanel when isWorkspaceControlPanelVisible is false', () => {
    createWrapper({ isWorkspaceControlPanelVisible: false });

    expect(screen.queryByRole('button', { name: 'Jump to window' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Workspace settings' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Workspace options' })).not.toBeInTheDocument();
  });

  describe('with isWorkspaceAddVisible', () => {
    it('should render WorkspaceAdd when isWorkspaceAddVisible is true', () => {
      createWrapper({ isWorkspaceAddVisible: true });

      expect(screen.queryByRole('heading', { level: 1, name: 'Kokudor viewer' })).not.toBeInTheDocument();
      expect(screen.getByRole('main')).toHaveTextContent('Your resource list is empty');
      expect(within(screen.getByRole('main')).getByRole('button', { name: 'Add resource' })).toBeInTheDocument();
    });
  });
});

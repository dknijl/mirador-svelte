import { screen, render } from '@tests/utils/test-utils';
import WorkspaceImport from '@src/components/WorkspaceImport.svelte';

describe('WorkspaceImport', () => {
  let handleClose;

  beforeEach(() => {
    handleClose = vi.fn();

    render(WorkspaceImport, { open: true, handleClose: handleClose });
  });

  it('renders without an error', () => {
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
  it('renders TextField props', () => {
    expect(screen.getByRole('textbox')).toHaveFocus();
  });
});

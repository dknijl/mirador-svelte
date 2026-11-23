import { screen, render } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import WorkspaceExport from '@src/components/WorkspaceExport.svelte';

describe('WorkspaceExport', () => {
  let user;
  let handleClose = vi.fn();
  let mockState;

  beforeEach(() => {
    user = userEvent.setup();
    handleClose = vi.fn();
    mockState = {
      companionWindows: {},
      config: {},
      elasticLayout: {},
      viewers: {},
      windows: {},
      workspace: {},
    };

    render(WorkspaceExport, { open: true, handleClose: handleClose, exportableState: mockState });
  });

  it('renders without an error', () => {
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('is closable by clicking the cancel button', async () => {
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(handleClose).toHaveBeenCalled();
  });

  it('reveals a snackbar on copy', async () => {
    // jsdom doesn't support the clipboard API or prompt (used as a fallback)
    // so we mock the prompt at least to avoid a warning in the test output
    vi.stubGlobal(
      'prompt',
      vi.fn(() => true),
    );

    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(screen.getByRole('alert')).toHaveTextContent('The workspace configuration was copied to your clipboard');

    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(handleClose).toHaveBeenCalled();
  });

  it('renders an exportable version of state', async () => {
    await user.click(screen.getByText('View workspace configuration'));
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByRole('region').querySelector('pre')).toHaveTextContent(
      '{ "companionWindows": {}, "config": {}, "elasticLayout": {}, "viewers": {}, "windows": {}, "workspace": {} }',
    );
  });
  it('constrains the dialog to the small width and the available viewport', () => {
    const expected = document.createElement('div');
    expected.style.maxWidth = 'min(600px, calc(100vw - 2rem))';
    document.body.append(expected);
    try {
      expect(getComputedStyle(screen.getByRole('dialog')).maxWidth).toBe(getComputedStyle(expected).maxWidth);
    } finally {
      expected.remove();
    }
  });
});

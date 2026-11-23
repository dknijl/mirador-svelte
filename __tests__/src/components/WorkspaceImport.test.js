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

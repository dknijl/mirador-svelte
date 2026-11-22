import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import CaptionTocMenu from '@src/components/CaptionTocMenu.svelte';

describe('CaptionTocMenu', () => {
  it('opens the caption table of contents for the window and closes the menu', async () => {
    const user = userEvent.setup();
    const openCaptionToc = vi.fn();
    const handleClose = vi.fn();

    render(CaptionTocMenu, { handleClose: handleClose, openCaptionToc: openCaptionToc, windowId: 'window-1' });

    await user.click(screen.getByRole('menuitem', { name: /open table of contents/i }));

    expect(openCaptionToc).toHaveBeenCalledWith('window-1');
    expect(handleClose).toHaveBeenCalled();
  });
});

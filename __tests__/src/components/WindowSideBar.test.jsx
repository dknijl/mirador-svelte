import { render, screen } from '@tests/utils/test-utils';
import { WindowSideBar } from '@src/components/WindowSideBar';

/** create wrapper */
function createWrapper({ ...props } = {}) {
  return render(<WindowSideBar windowId="xyz" {...props} />, {
    preloadedState: {
      windows: {
        xyz: {
          companionWindowIds: [],
          suggestedSearches: null,
        },
      },
    },
  });
}

describe('WindowSideBar', () => {
  it('renders the panel menu inline, leaving the left edge to the thumbnails', () => {
    createWrapper();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(document.querySelector('.MuiDrawer-root')).not.toBeInTheDocument();
  });

  it('shows the panel menus as tabs in a single row', () => {
    createWrapper();
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBeGreaterThan(1);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });
});

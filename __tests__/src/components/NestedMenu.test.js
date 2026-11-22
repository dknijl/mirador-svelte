import { markup, render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import NestedMenu from '@src/components/NestedMenu.svelte';

/**
 * Helper function to wrap creating a NestedMenu component
 */
function createWrapper(props) {
  return render(NestedMenu, { icon: 'GivenIcon', label: 'GivenLabel', children: markup('<span>GivenChildren</span>'), ...props });
}

describe('NestedMenu', () => {
  it('renders the given icon', () => {
    createWrapper();

    expect(screen.getByText('GivenIcon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not render a ListItemIcon if no icon prop is passed', () => {
    createWrapper({ icon: null });

    expect(screen.queryByText('GivenIcon')).not.toBeInTheDocument();
  });

  it('renders the given label as its accessible name', () => {
    createWrapper();

    expect(screen.getByRole('menuitem', { name: 'GivenLabel' })).toBeInTheDocument();
  });

  it('toggles the local open state when clicking the MenuItem', async () => {
    const user = userEvent.setup();
    createWrapper();

    expect(screen.queryByText('GivenChildren')).not.toBeInTheDocument();

    await user.click(screen.getByRole('menuitem'));
    expect(screen.getByText('GivenChildren')).toBeInTheDocument();

    await user.click(screen.getByRole('menuitem'));
    expect(screen.queryByText('GivenChildren')).not.toBeInTheDocument();
  });

  it('spreads options to the MenuItem', () => {
    createWrapper({ 'data-testid': 'subject' });

    expect(screen.getByTestId('subject')).toBeInTheDocument();
  });
});

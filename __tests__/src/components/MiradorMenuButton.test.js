import { markup, render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import MiradorMenuButton from '@src/components/MiradorMenuButton.svelte';

function createWrapper(props = {}) {
  return render(MiradorMenuButton, {
    'aria-label': 'The Label',
    ...props,
    children: markup('<span>icon</span>'),
  });
}

describe('MiradorMenuButton', () => {
  it('renders its accessible label and child content', () => {
    createWrapper();
    expect(screen.getByRole('button', { name: 'The Label' })).toHaveTextContent('icon');
  });

  it('shows a tooltip on hover and keyboard focus', async () => {
    const user = userEvent.setup();
    createWrapper();
    const button = screen.getByRole('button');
    await user.hover(button);
    expect(await screen.findByRole('tooltip')).toHaveTextContent('The Label');
    expect(getComputedStyle(screen.getByRole('tooltip')).pointerEvents).toBe('none');
    await user.unhover(button);
    await user.tab();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('The Label');
  });

  it('keeps disabled buttons unavailable and hides their tooltip', async () => {
    const user = userEvent.setup();
    createWrapper({ disabled: true });
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    await user.hover(button);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('forwards semantic button attributes while omitting injected viewer props', () => {
    createWrapper({
      class: 'custom-button',
      'data-testid': 'my-button',
      disabled: true,
    });
    const button = screen.getByTestId('my-button');
    expect(button).toHaveClass('menu-button', 'custom-button');
    expect(button).toBeDisabled();
    expect(button).not.toHaveAttribute('store');
    expect(button).not.toHaveAttribute('plugins');
  });

  it('renders an optional badge alongside the child content', () => {
    createWrapper({ badge: true, BadgeProps: { badgeContent: 3 } });
    expect(screen.getByRole('button')).toHaveTextContent('icon');
    expect(screen.getByText('3')).toHaveClass('badge');
  });
});

import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/dom';
import { renderSvelte } from '@tests/utils/render-svelte';
import WindowAuthenticationBar from '@src/components/WindowAuthenticationBar.svelte';

function renderBar(props = {}) {
  return renderSvelte(WindowAuthenticationBar, {
    confirmButton: 'Log in',
    label: 'Log in to see more',
    onConfirm: () => {},
    t: (key) => ({ login: 'Log in', continue: 'Continue', cancel: 'Cancel' })[key] ?? key,
    ...props,
  });
}

describe('WindowAuthenticationBar', () => {
  it('renders nothing if the user is logged in and there is no logout service', () => {
    renderBar({ hasLogoutService: false, status: 'ok' });
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders a non-collapsing confirmation button without header or description', async () => {
    const onConfirm = vi.fn();
    renderBar({ onConfirm, status: 'ok', hasLogoutService: true });
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('opens the description and supports cancel and confirm', async () => {
    const onConfirm = vi.fn();
    renderBar({ onConfirm, status: 'failed', header: 'Login to Example Institution', description: 'long description' });
    expect(screen.getByText('Continue')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Log in to see more Continue/ }));
    expect(screen.getByText('long description')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Log in to see more Continue/ }));
    await userEvent.click(screen.getAllByRole('button', { name: 'Log in' }).at(-1));
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});

import { markup } from '@tests/utils/test-utils';
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
    const { container } = renderBar({ hasLogoutService: false, status: 'ok' });
    const contents = container.cloneNode(true);
    contents.normalize();
    expect(contents).toBeEmptyDOMElement();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders a non-collapsing confirmation button without header or description', async () => {
    const onConfirm = vi.fn();
    renderBar({ onConfirm, status: 'ok', hasLogoutService: true });
    expect(screen.getByText('Log in to see more')).toBeVisible();
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
    expect(screen.queryByText('Continue')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Log in', exact: true })).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByText('Continue')).toBeVisible();
    expect(screen.queryByText('long description')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Log in to see more Continue/ }));
    await userEvent.click(screen.getAllByRole('button', { name: 'Log in' }).at(-1));
    expect(onConfirm).toHaveBeenCalledOnce();
  });
  it('renders a trusted plugin description snippet when ruleSet is false', async () => {
    renderBar({ header: 'Header', description: markup('<em>long html description</em>'), ruleSet: false });
    await userEvent.click(screen.getByRole('button', { name: /Continue/ }));
    expect(screen.getByText('long html description', { selector: 'em' })).toBeVisible();
  });
});

import { createRawSnippet } from 'svelte';
import userEvent from '@testing-library/user-event';
import { render, screen, fireEvent } from '@tests/utils/test-utils';
import CompanionWindow from '@src/components/CompanionWindow.svelte';

function snippet(html, setup) {
  return createRawSnippet(() => ({ render: () => html, setup }));
}

function createWrapper(props = {}) {
  const children = props.children ?? snippet('<span data-testid="child">Panel body</span>');
  const titleControls = props.titleControls ?? snippet('<span data-testid="controls">Controls</span>');
  return render(CompanionWindow, {
    id: 'abc123',
    isDisplayed: true,
    direction: 'ltr',
    windowId: 'x',
    position: 'right',
    children,
    titleControls,
    t: (key) =>
      ({
        closeCompanionWindow: 'Close panel',
        openInCompanionWindow: 'Open in separate panel',
        moveCompanionWindowToBottom: 'Move to bottom',
        moveCompanionWindowToRight: 'Move to right',
        resizePanel: 'Resize panel',
      })[key] || key,
    ...props,
  });
}

describe('CompanionWindow', () => {
  it('derives the landmark label from the title and permits an override', () => {
    createWrapper({ title: 'some title' });
    expect(screen.getByRole('region')).toHaveAccessibleName('some title');
  });

  it('can override the landmark label', () => {
    createWrapper({ ariaLabel: 'some label', title: 'some title' });
    expect(screen.getByRole('region')).toHaveAccessibleName('some label');
  });

  it('opens a left panel to the right', async () => {
    const updateCompanionWindow = vi.fn();
    createWrapper({ position: 'left', updateCompanionWindow });
    await userEvent.setup().click(screen.getByRole('button', { name: 'Open in separate panel' }));
    expect(updateCompanionWindow).toHaveBeenCalledWith({ position: 'right' });
  });

  it('closes a companion window', async () => {
    const onCloseClick = vi.fn();
    createWrapper({ onCloseClick });
    await userEvent.setup().click(screen.getByRole('button', { name: 'Close panel' }));
    expect(onCloseClick).toHaveBeenCalledTimes(1);
  });

  it('renders children and title controls', () => {
    createWrapper();
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('controls')).toBeInTheDocument();
  });

  it('can move a right panel to the bottom', async () => {
    const updateCompanionWindow = vi.fn();
    createWrapper({ position: 'right', updateCompanionWindow });
    expect(screen.getByRole('region')).toHaveClass('mirador-companion-window-right');
    await userEvent.setup().click(screen.getByRole('button', { name: 'Move to bottom' }));
    expect(updateCompanionWindow).toHaveBeenCalledWith({ position: 'bottom' });
  });

  it('can move a bottom panel to the right', async () => {
    const updateCompanionWindow = vi.fn();
    createWrapper({ position: 'bottom', updateCompanionWindow });
    expect(screen.getByRole('region')).toHaveClass('mirador-companion-window-bottom');
    await userEvent.setup().click(screen.getByRole('button', { name: 'Move to right' }));
    expect(updateCompanionWindow).toHaveBeenCalledWith({ position: 'right' });
  });

  it('sets the initial sidebar dimensions and provides a resize handle', () => {
    createWrapper();
    expect(screen.getByRole('region')).toHaveStyle({ height: '100%', width: '235px' });
    expect(screen.getByRole('button', { name: 'Resize panel' })).toBeInTheDocument();
  });

  it('keeps the resized width when the pointer is released', () => {
    createWrapper();
    const region = screen.getByRole('region');
    region.getBoundingClientRect = () => ({ width: 235, height: 201 });
    const handle = screen.getByRole('button', { name: 'Resize panel' });
    fireEvent.pointerDown(handle, { clientX: 100 });
    fireEvent.pointerMove(handle, { clientX: 55 });
    fireEvent.pointerUp(handle);
    expect(region).toHaveStyle({ width: '280px' });
  });

  it('sets the initial bottom panel dimensions', () => {
    createWrapper({ position: 'bottom' });
    expect(screen.getByRole('region')).toHaveStyle({ height: '201px', width: '100%' });
  });

  it('does not render hidden panels', () => {
    createWrapper({ isDisplayed: false });
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('lets a child close its own panel', async () => {
    const onCloseClick = vi.fn();
    const children = createRawSnippet((getActions) => ({
      render: () => '<button>Close from child</button>',
      setup(button) {
        const close = () => getActions().closeCompanionWindow();
        button.addEventListener('click', close);
        return () => button.removeEventListener('click', close);
      },
    }));
    createWrapper({ children, onCloseClick });
    await userEvent.setup().click(screen.getByRole('button', { name: 'Close from child' }));
    expect(onCloseClick).toHaveBeenCalledOnce();
  });
});

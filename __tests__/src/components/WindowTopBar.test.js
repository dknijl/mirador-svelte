import { render, screen, fireEvent } from '@tests/utils/test-utils';
import { onTestFinished } from 'vitest';
import userEvent from '@testing-library/user-event';
import WindowTopBar from '@src/components/WindowTopBar.svelte';

const baseProps = {
  windowId: 'xyz',
  maximized: false,
  maximizeWindow: () => {},
  minimizeWindow: () => {},
  removeWindow: () => {},
  toggleWindowSideBar: () => {},
};

describe('WindowTopBar', () => {
  it('renders all default components', () => {
    render(WindowTopBar, baseProps);
    expect(screen.getByRole('navigation', { name: 'Window navigation' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show sidebar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Window views & thumbnail display' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Maximize window' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close window' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Full screen' })).not.toBeInTheDocument();
  });

  it('uses allow flags to override defaults', () => {
    const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'requestFullscreen');
    Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', { configurable: true, value: vi.fn() });
    onTestFinished(() => {
      if (original) Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', original);
      else Reflect.deleteProperty(HTMLElement.prototype, 'requestFullscreen');
    });
    render(WindowTopBar, {
      ...baseProps,
      allowWindowSideBar: false,
      allowClose: false,
      allowMaximize: false,
      allowTopMenuButton: false,
      allowFullscreen: true,
    });
    expect(screen.getByRole('button', { name: 'Full screen' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Show sidebar' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Window views & thumbnail display' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Maximize window' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close window' })).not.toBeInTheDocument();
  });

  it('marks the toolbar as a mosaic drag handle when enabled', () => {
    render(WindowTopBar, { ...baseProps, windowDraggable: true });
    const toolbar = screen.getByRole('navigation', { name: 'Window navigation' });
    expect(toolbar).toHaveAttribute('draggable', 'true');
    expect(toolbar).toHaveAttribute('data-mosaic-handle');
  });

  it('passes the sidebar callback to its button', async () => {
    const toggleWindowSideBar = vi.fn();
    render(WindowTopBar, { ...baseProps, toggleWindowSideBar });
    await userEvent.setup().click(screen.getByRole('button', { name: 'Show sidebar' }));
    expect(toggleWindowSideBar).toHaveBeenCalledTimes(1);
  });

  it('passes the close callback to its button', async () => {
    const removeWindow = vi.fn();
    render(WindowTopBar, { ...baseProps, removeWindow });
    await userEvent.setup().click(screen.getByRole('button', { name: 'Close window' }));
    expect(removeWindow).toHaveBeenCalledTimes(1);
  });

  it('passes the maximize callback to its button', async () => {
    const maximizeWindow = vi.fn();
    render(WindowTopBar, { ...baseProps, maximizeWindow });
    await userEvent.setup().click(screen.getByRole('button', { name: 'Maximize window' }));
    expect(maximizeWindow).toHaveBeenCalledTimes(1);
  });

  it('allows the close button to be hidden', () => {
    render(WindowTopBar, { ...baseProps, allowClose: false });
    expect(screen.queryByRole('button', { name: 'Close window' })).not.toBeInTheDocument();
  });

  it('allows the maximize button to be hidden', () => {
    render(WindowTopBar, { ...baseProps, allowMaximize: false });
    expect(screen.queryByRole('button', { name: 'Maximize window' })).not.toBeInTheDocument();
  });

  it('focuses the window on toolbar mouse down', () => {
    const focusWindow = vi.fn();
    render(WindowTopBar, { ...baseProps, focusWindow });
    fireEvent.mouseDown(screen.getByRole('navigation'));
    expect(focusWindow).toHaveBeenCalledTimes(1);
  });
});

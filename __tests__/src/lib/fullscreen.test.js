/* eslint-disable testing-library/no-node-access -- The fullscreen API operates on document and DOM element identity. */
import { createFullscreenHandle } from '@src/lib/fullscreen';
import { fireEvent, screen } from '@testing-library/dom';
import { render, markup } from '@tests/utils/test-utils';
import AppProviders from '@src/components/AppProviders.svelte';

describe('viewer fullscreen', () => {
  let element;
  let handle;
  beforeEach(() => {
    element = document.createElement('div');
    element.requestFullscreen = vi.fn().mockResolvedValue();
    document.exitFullscreen = vi.fn().mockResolvedValue();
    document.fullscreenElement = null;
    handle = createFullscreenHandle(() => element);
  });
  afterEach(() => {
    delete document.exitFullscreen;
    delete document.fullscreenElement;
  });
  it('starts inactive and requests fullscreen on its viewer', async () => {
    expect(handle.active).toBe(false);
    await handle.enter();
    expect(element.requestFullscreen).toHaveBeenCalledOnce();
    expect(document.exitFullscreen).not.toHaveBeenCalled();
  });
  it('exits an existing fullscreen element before entering', async () => {
    document.fullscreenElement = document.body;
    await handle.enter();
    expect(document.exitFullscreen).toHaveBeenCalledBefore(element.requestFullscreen);
  });
  it('only exits fullscreen when its own viewer is active', async () => {
    await handle.exit();
    expect(document.exitFullscreen).not.toHaveBeenCalled();
    document.fullscreenElement = element;
    expect(handle.active).toBe(true);
    await handle.exit();
    expect(document.exitFullscreen).toHaveBeenCalledOnce();
  });
  it('updates the fullscreen class on document changes', () => {
    const onChange = vi.fn();
    const view = render(AppProviders, { onChange, class: 'my-class', children: markup('<span>content</span>') });
    const root = view.container.querySelector('.fullscreen');
    expect(onChange).toHaveBeenCalledWith(false, expect.objectContaining({ active: false }));
    const viewerHandle = onChange.mock.calls[0][1];
    expect(root).toHaveClass('fullscreen', 'my-class');
    expect(root).toContainElement(screen.getByText('content'));
    expect(root).not.toHaveClass('fullscreen-enabled');
    document.fullscreenElement = root;
    fireEvent(document, new Event('fullscreenchange'));
    expect(root).toHaveClass('fullscreen-enabled');
    expect(root).toHaveStyle({ height: '100%', width: '100%' });
    expect(onChange).toHaveBeenLastCalledWith(true, viewerHandle);
    document.fullscreenElement = null;
    fireEvent(document, new Event('fullscreenchange'));
    expect(onChange).toHaveBeenLastCalledWith(false, viewerHandle);
  });
});

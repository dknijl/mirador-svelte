import { renderSvelte } from '@tests/utils/render-svelte';
import ViewerEvent from '@tests/utils/ViewerEvent.svelte';
import OpenSeadragon from 'openseadragon';
import { onTestFinished } from 'vitest';

/** Build a real OSD Viewer (not a mock) so subscribe/unsubscribe timing is genuine */
function createViewer() {
  const element = document.createElement('div');
  document.body.appendChild(element);
  const viewer = new OpenSeadragon({ element, drawer: 'html' });
  onTestFinished(() => {
    viewer.destroy();
    element.remove();
  });
  return viewer;
}

describe('viewer event subscription', () => {
  it('does nothing when viewer is null', () => {
    expect(() => renderSvelte(ViewerEvent, { viewer: null, event: 'update-viewport', handler: vi.fn() })).not.toThrow();
  });

  it('subscribes to the named event on the viewer', () => {
    const viewer = createViewer();
    const viewerAddHandler = vi.spyOn(viewer, 'addHandler');

    renderSvelte(ViewerEvent, { viewer, event: 'update-viewport', handler: vi.fn() });
    expect(viewerAddHandler).toHaveBeenCalledWith('update-viewport', expect.any(Function));
  });

  // Regression test for #4526: a handler captured once at mount-time kept
  // reading stale state on every later invocation.
  it('always calls the latest handler passed in, never a stale one', () => {
    const viewer = createViewer();
    const handlerA = vi.fn();
    const handlerB = vi.fn();

    const { rerender } = renderSvelte(ViewerEvent, { viewer, event: 'update-viewport', handler: handlerA });

    rerender({ viewer, event: 'update-viewport', handler: handlerB });
    viewer.raiseEvent('update-viewport');

    expect(handlerB).toHaveBeenCalledTimes(1);
    expect(handlerA).not.toHaveBeenCalled();
  });

  // Regression test for #4525: cleanup ran as a deferred passive effect,
  // leaving a window where a still-registered handler fired after unmount.
  it('stops responding to the event once unmounted', () => {
    const viewer = createViewer();
    const handler = vi.fn();

    const { unmount } = renderSvelte(ViewerEvent, { viewer, event: 'update-viewport', handler });

    unmount();
    viewer.raiseEvent('update-viewport');

    expect(handler).not.toHaveBeenCalled();
  });

  it('re-subscribes if the viewer instance changes', () => {
    const viewerA = createViewer();
    const viewerB = createViewer();
    const handler = vi.fn();

    const { rerender } = renderSvelte(ViewerEvent, { viewer: viewerA, event: 'update-viewport', handler });

    rerender({ viewer: viewerB, event: 'update-viewport', handler });

    viewerA.raiseEvent('update-viewport');
    expect(handler).not.toHaveBeenCalled();

    viewerB.raiseEvent('update-viewport');
    expect(handler).toHaveBeenCalledTimes(1);
  });
});

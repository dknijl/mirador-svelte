import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/dom';
import { renderSvelte } from '@tests/utils/render-svelte';
import ZoomControls from '@src/components/ZoomControls.svelte';

function osdViewerWithZoom({ zoom, minZoom, maxZoom, rotation = 0 }) {
  return {
    current: {
      viewport: {
        getMaxZoom: () => maxZoom,
        getMinZoom: () => minZoom,
        getRotation: () => rotation,
        zoomSpring: { target: { value: zoom } },
      },
    },
  };
}

function createWrapper(props = {}, osdViewer = { current: null }) {
  const controls = {
    t: (key) => ({ zoomIn: 'Zoom in', zoomOut: 'Zoom out', zoomReset: 'Reset zoom', rotate: 'Rotate' })[key],
    windowId: 'xyz',
    zoomToWorld: vi.fn(),
    ...props,
    osdViewer,
  };
  return renderSvelte(ZoomControls, controls);
}

describe('ZoomControls', () => {
  const viewer = { x: 100, y: 100, zoom: 1, rotation: 0 };
  const user = userEvent.setup();

  it('renders each zoom and rotation control', () => {
    createWrapper({ viewer });
    expect(screen.getByRole('button', { name: 'Zoom in' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zoom out' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset zoom' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Rotate' })).toBeInTheDocument();
  });

  it.each([
    [0, 90],
    [90, 180],
    [270, 0],
  ])('rotates from %i to %i degrees', async (rotation, expected) => {
    const updateViewport = vi.fn();
    createWrapper({ updateViewport, viewer }, osdViewerWithZoom({ maxZoom: 0.5, minZoom: 0.1, rotation, zoom: 0.3 }));
    await user.click(screen.getByRole('button', { name: 'Rotate' }));
    expect(updateViewport).toHaveBeenLastCalledWith('xyz', { rotation: expected });
  });

  it('uses the Redux zoom while no viewport is mounted', async () => {
    const updateViewport = vi.fn();
    createWrapper({ updateViewport, viewer });
    await user.click(screen.getByRole('button', { name: 'Zoom in' }));
    expect(updateViewport).toHaveBeenCalledWith('xyz', { zoom: 2 });
  });

  it('clamps requested zoom to the live OSD limits', async () => {
    const updateViewport = vi.fn();
    createWrapper(
      { updateViewport, viewer: { ...viewer, zoom: 999 } },
      osdViewerWithZoom({ maxZoom: 0.5, minZoom: 0.1, zoom: 0.4 }),
    );
    await user.click(screen.getByRole('button', { name: 'Zoom in' }));
    expect(updateViewport).toHaveBeenCalledWith('xyz', { zoom: 0.5 });
  });

  it.each([
    [0.5, 'Zoom in'],
    [0.1, 'Zoom out'],
  ])('disables %s when live zoom is at the limit', (zoom, name) => {
    createWrapper({}, osdViewerWithZoom({ maxZoom: 0.5, minZoom: 0.1, zoom }));
    expect(screen.getByRole('button', { name })).toBeDisabled();
  });

  it('resets to the fitted world', async () => {
    const zoomToWorld = vi.fn();
    createWrapper({ viewer, zoomToWorld });
    await user.click(screen.getByRole('button', { name: 'Reset zoom' }));
    expect(zoomToWorld).toHaveBeenCalledWith(false);
  });

  it('handles missing viewer state', () => {
    expect(() => createWrapper({ viewer: null })).not.toThrow();
  });
});

import { render, screen } from '@tests/utils/test-utils';
import { createRawSnippet } from 'svelte';
import userEvent from '@testing-library/user-event';
import { Utils } from 'manifesto.js';
import { getCanvasWorld } from '../../utils/mirador-wrappers';
import OpenSeadragonViewer from '@src/components/ImageViewer.svelte';
import fixture from '../../fixtures/version-2/019.json';
import { OSDReferences } from '@src/plugins/OSDReferences';

const canvases = Utils.parseManifest(fixture).getSequences()[0].getCanvases();

/**
 * Helper function to create a shallow wrapper around OpenSeadragonViewer
 */
function createWrapper(props) {
  const children = createRawSnippet((_viewer, zoom) => ({
    render: () => '<button data-testid="foo">Zoom</button>',
    setup(element) {
      const click = () => zoom()();
      element.addEventListener('click', click);
      return () => element.removeEventListener('click', click);
    },
  }));
  const rendered = render(OpenSeadragonViewer, {
    children,
    osdConfig: { drawer: 'html' },
    windowId: 'base',
    updateViewport: vi.fn(),
    canvasWorld: getCanvasWorld(canvases),
    ...props,
  });
  return { ...rendered, viewer: OSDReferences.get('base').current };
}

describe('OpenSeadragonViewer', () => {
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it('renders the component', () => {
    createWrapper({});
    expect(screen.getByLabelText('Item:')).toHaveClass('mirador-osd-container');
  });

  it('registers itself with OSDReferences on mount and removes itself on unmount', () => {
    const { unmount } = createWrapper({});

    expect(OSDReferences.get('base')).toBeDefined();

    unmount();

    expect(OSDReferences.get('base')).toBeUndefined();
  });

  it('renders child components enhanced with additional props', async () => {
    const { viewer } = createWrapper({});
    const fitBounds = vi.fn();
    vi.spyOn(viewer, 'viewport', 'get').mockReturnValue({ fitBounds });

    await user.click(screen.getByTestId('foo'));
    expect(fitBounds).toHaveBeenCalled();
  });

  describe('zoomToWorld', () => {
    it('uses fitBounds with the existing CanvasWorld', async () => {
      const { viewer } = createWrapper({});
      const fitBounds = vi.fn();
      vi.spyOn(viewer, 'viewport', 'get').mockReturnValue({ fitBounds });

      await user.click(screen.getByTestId('foo'));
      expect(fitBounds).toHaveBeenCalledWith(
        {
          degrees: 0,
          height: 1800,
          width: 5041,
          x: 0,
          y: 0,
        },
        expect.anything(),
      );
    });
  });

  describe('onViewportChange', () => {
    it('translates the OSD viewport data into an update to the component state', () => {
      const updateViewport = vi.fn();
      const { viewer } = createWrapper({ updateViewport });

      vi.spyOn(viewer, 'viewport', 'get').mockReturnValue({
        centerSpringX: { target: { value: 1 } },
        centerSpringY: { target: { value: 0 } },
        getBounds: () => [],
        getFlip: () => false,
        getRotation: () => 90,
        zoomSpring: { target: { value: 0.5 } },
      });

      viewer.raiseEvent('animation-finish');

      expect(updateViewport).toHaveBeenCalledWith('base', {
        flip: false,
        rotation: 90,
        x: 1,
        y: 0,
        zoom: 0.5,
      });
    });
  });

  describe('onCanvasMouseMove', () => {
    it('triggers an OSD event', () => {
      vi.useFakeTimers();
      const { viewer } = createWrapper({});
      const mockHandler = vi.fn();
      viewer.addHandler('mouse-move', mockHandler);

      const e = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
      viewer.innerTracker.moveHandler(e);

      vi.advanceTimersByTime(100);

      expect(mockHandler).toHaveBeenCalledWith(e);

      vi.useRealTimers();
    });
  });

  describe('ImageFailureMessage', () => {
    it('passes imageUrls from infoResponses and nonTiledImages', async () => {
      const infoResponses = [
        { id: 'http://example.com/image1', json: {} },
        { id: 'http://example.com/image2', json: {} },
      ];
      const nonTiledImages = [{ id: 'http://example.com/image3', getProperty: () => 'Image' }];

      for (const resource of [...infoResponses, ...nonTiledImages]) {
        const view = createWrapper({ infoResponses, nonTiledImages, failedImages: new Set([resource.id]) });
        expect(screen.getByRole('status')).toHaveTextContent(/Problem loading image/);
        view.unmount();
      }
    });
  });
});

import { expect, it } from 'vitest';
import { fireEvent, screen, within, setupIntegrationTestViewer } from '@tests/utils/test-utils';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import manifest from '../../fixtures/version-2/bodleian-five-canvases.json';
import config from '../mirador-configs/single-bodleian';

describe('Canvas navigation by clicking thumbnails', () => {
  beforeEach(() => server.use(http.get(manifest['@id'], () => HttpResponse.json(manifest))));
  setupIntegrationTestViewer(config);

  it('navigates a manifest using thumbnail navigation', async (context) => {
    // Make sure we have the manifest
    const windowElement = await screen.findByRole('region', {
      name: /Window: Bodleian Library MS. Ind. Inst. Misc. 22/i,
    });
    expect(windowElement).toBeInTheDocument();

    const windowId = windowElement.getAttribute('id');
    const storedCanvasId = context.miradorInstance.store.getState().windows[windowId].canvasId;

    const thumbnailsContainer = await screen.findByLabelText('Thumbnails');
    const cells = await within(thumbnailsContainer).findAllByRole('gridcell');
    expect(storedCanvasId).toBe(manifest.sequences[0].canvases[0]['@id']);
    fireEvent.click(within(cells[4]).getByRole('button'));
    expect(context.miradorInstance.store.getState().windows[windowId].canvasId).toBe(manifest.sequences[0].canvases[4]['@id']);
  });
});

import { expect, it } from 'vitest';
import { fireEvent, screen, setupIntegrationTestViewer, waitFor } from '@tests/utils/test-utils';
import { http, HttpResponse } from 'msw';

import manifest from '../../fixtures/version-2/019.json';
import { server } from '../../mocks/server';

/** Image services used by the fixture, in canvas order. */
const services = manifest.sequences[0].canvases.map((canvas) => canvas.images[0].resource.service['@id']);

const nextPageInfoUrl = `${services[1]}/info.json`;

/** Serve the manifest and every info.json, recording the info.json requests that arrive. */
const serveInfoJson = () => {
  const requested = [];

  server.use(
    http.get(manifest['@id'], () => HttpResponse.json(manifest)),
    ...services.map((id) =>
      http.get(`${id}/info.json`, ({ request }) => {
        requested.push(request.url);
        return HttpResponse.json({
          '@context': 'http://iiif.io/api/image/2/context.json',
          '@id': id,
          height: 100,
          profile: ['http://iiif.io/api/image/2/level2.json'],
          width: 100,
        });
      }),
    ),
  );

  return requested;
};

const config = (requests) => ({
  id: 'mirador',
  ...(requests ? { requests } : {}),
  theme: { transitions: {} },
  windows: [{ manifestId: manifest['@id'] }],
});

const currentCanvasId = (miradorInstance) => Object.values(miradorInstance.store.getState().windows)[0].canvasId;

const goToNextPage = async (miradorInstance) => {
  const [nextButton] = await screen.findAllByRole('button', { name: 'Next item' });
  fireEvent.click(nextButton);
  await waitFor(() => expect(currentCanvasId(miradorInstance)).toBe(manifest.sequences[0].canvases[1]['@id']));
};

describe('next-page metadata prefetch when the viewer opts in', () => {
  let requested;

  beforeEach(() => {
    requested = serveInfoJson();
  });

  setupIntegrationTestViewer(config({ prefetchNextImageInfo: true }));

  it('loads the next page metadata before the user navigates, and only once', async ({ miradorInstance }) => {
    await waitFor(() => expect(miradorInstance.store.getState().infoResponses[services[1]]?.json).toBeDefined());
    expect(requested.filter((url) => url === nextPageInfoUrl)).toHaveLength(1);

    await goToNextPage(miradorInstance);

    expect(requested.filter((url) => url === nextPageInfoUrl)).toHaveLength(1);
  });
});

describe('next-page metadata prefetch by default', () => {
  let requested;

  beforeEach(() => {
    requested = serveInfoJson();
  });

  setupIntegrationTestViewer(config());

  it('waits for the user to navigate', async ({ miradorInstance }) => {
    await waitFor(() => expect(miradorInstance.store.getState().infoResponses[services[0]]?.json).toBeDefined());
    expect(requested).not.toContain(nextPageInfoUrl);

    await goToNextPage(miradorInstance);

    await waitFor(() => expect(requested).toContain(nextPageInfoUrl));
  });
});

import parker from '../fixtures/version-2/parker-ms640.json';
import { http, HttpResponse } from 'msw';
import manifestFixtureFg165hz3589 from '../fixtures/version-2/fg165hz3589.json';

// Use the manifest's request URLs because the image server may return a canonical service ID.
const parkerResources = [
  [parker.manifest['@id'], parker.manifest],
  ...parker.annotationLists.map((list) => [list['@id'], list]),
  ...parker.manifest.sequences[0].canvases.map((canvas, index) => [
    `${canvas.images[0].resource.service['@id']}/info.json`,
    parker.imageInformation[index],
  ]),
];

export const handlers = [
  ...parkerResources.map(([url, json]) => http.get(url, () => HttpResponse.json(json))),
  // Global CORS preflight handler for happy-dom across all tests
  http.options('*', () => {
    return new HttpResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    });
  }),

  // Intercept request used in multiple integration tests
  // Return manifest fixture that we have in the fixtures directory
  http.get('https://purl.stanford.edu/hg676jb4964/iiif/manifest', () => HttpResponse.json(manifestFixtureFg165hz3589)),
];

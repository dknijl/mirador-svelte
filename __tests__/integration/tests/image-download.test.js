import { fireEvent, screen, within, setupIntegrationTestViewer } from '@tests/utils/test-utils';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import annotations from '../../fixtures/version-3/svg-annotations.json';
import manifest from '../../fixtures/version-3/0001-mvm-image.json';

describe('image downloads', () => {
  beforeEach(() => {
    server.use(
      http.get(manifest.id, () => HttpResponse.json(manifest)),
      http.get('*/__tests__/fixtures/version-3/svg-annotations.json', () => HttpResponse.json(annotations)),
    );
  });
  setupIntegrationTestViewer({ windows: [{ manifestId: manifest.id }] });

  it('offers the visible image from the window toolbar and returns to the viewer', async () => {
    await screen.findByRole('heading', { name: /Single Image Example/i });
    fireEvent.click(await screen.findByRole('button', { name: 'Download' }));

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('link', { name: /Whole image/i })).toHaveAttribute(
      'href',
      'https://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png?download=true',
    );
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Download' }));
    expect(await within(screen.getByRole('dialog')).findByRole('link', { name: /Whole image/i })).toBeInTheDocument();
  });
});

describe.each([
  ['only smaller sizes are listed', {}, true],
  [
    'native dimensions are also listed',
    {
      sizes: [
        { width: 400, height: 600 },
        { width: 1200, height: 1800 },
      ],
    },
    true,
  ],
  ['maximum dimensions exclude the original', { maxWidth: 1200 }, false],
])('native IIIF downloads when %s', (_description, overrides, allowed) => {
  const id = 'https://images.example.org/page';
  beforeEach(() => {
    const tiled = structuredClone(manifest);
    tiled.items[0].items[0].items[0].body.service = [{ id, type: 'ImageService3', profile: 'level0' }];
    delete tiled.items[0].annotations;
    server.use(
      http.get(manifest.id, () => HttpResponse.json(tiled)),
      http.get(`${id}/info.json`, () =>
        HttpResponse.json({
          '@context': 'http://iiif.io/api/image/3/context.json',
          id,
          profile: 'level0',
          width: 1200,
          height: 1800,
          sizes: [{ width: 400, height: 600 }],
          ...overrides,
        }),
      ),
    );
  });
  setupIntegrationTestViewer({ windows: [{ manifestId: manifest.id }] });

  it('keeps smaller downloads and labels native resolution exactly once when permitted', async () => {
    await screen.findByRole('heading', { name: /Single Image Example/i });
    fireEvent.click(await screen.findByRole('button', { name: 'Download' }));
    const dialog = within(await screen.findByRole('dialog'));
    expect(await dialog.findByRole('link', { name: /Whole image.*400.*600/i })).toBeInTheDocument();
    const native = dialog.queryByRole('link', { name: /Full size.*1200.*1800/i });
    if (allowed) expect(native).toHaveAttribute('href', `${id}/full/max/0/default.jpg?download=true`);
    else expect(native).not.toBeInTheDocument();
    expect(dialog.getAllByRole('link')).toHaveLength(allowed ? 2 : 1);
  });
});

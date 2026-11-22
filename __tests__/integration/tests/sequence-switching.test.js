import { expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { setupIntegrationTestViewer, screen, fireEvent } from '@tests/utils/test-utils';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import manifest from '../../fixtures/version-2/multipleSequences.json';
import config from '../mirador-configs/multiple-sequences';

describe('Window Sidebar Sequence Dropdown', () => {
  beforeEach(() => {
    server.use(
      http.get('*/__tests__/fixtures/version-2/multipleSequences.json', () => HttpResponse.json(manifest)),
      ...manifest.sequences.flatMap((sequence) =>
        sequence.canvases.map((canvas) => {
          const image = canvas.images[0].resource;
          const id = image.service['@id'];
          return http.get(`${id}/info.json`, () =>
            HttpResponse.json({
              ...image.service,
              '@id': id,
              width: canvas.width,
              height: canvas.height,
            }),
          );
        }),
      ),
    );
  });
  setupIntegrationTestViewer(config);

  it('allows the user to switch the sequence', async ({ miradorInstance }) => {
    // Make sure we have the manifest
    const element = await screen.findByRole('heading', {
      name: /Urnäsch, Gemeindearchiv Urnäsch, Fragment/i,
    });
    expect(element).toBeInTheDocument();

    // Open the index tab
    const toggleButtons = await screen.findAllByLabelText(/show sidebar/i);
    fireEvent.click(toggleButtons[0]);

    const indexButton = await screen.findByRole('tab', { name: /Index/i });
    fireEvent.click(indexButton);

    // Confirm initial sequence (1740) is loaded
    const sequenceInput = await screen.findByRole('combobox', { name: /sequence/i });

    expect(sequenceInput).toHaveValue('https://www.e-codices.unifr.ch/metadata/iiif/gau-Fragment/sequence/Sequence-1740.json');

    // Change the sequence (1741)
    await userEvent.selectOptions(sequenceInput, screen.getByRole('option', { name: /Lesefreundliche Sequenz/i }));

    const nextId = 'https://www.e-codices.unifr.ch/metadata/iiif/gau-Fragment/sequence/Sequence-1741.json';
    expect(sequenceInput).toHaveValue(nextId);
    const [viewerWindow] = Object.values(miradorInstance.store.getState().windows);
    expect(viewerWindow.sequenceId).toBe(nextId);
  });
});

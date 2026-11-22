import { expect, it } from 'vitest';
import { screen, fireEvent, within, setupIntegrationTestViewer } from '@tests/utils/test-utils';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import manifest from '../../fixtures/version-3/0001-mvm-image.json';
import annotations from '../../fixtures/version-3/svg-annotations.json';
import config from '../mirador-configs/blank';

describe('Basic end to end Mirador', () => {
  beforeEach(() => {
    server.use(
      http.get(manifest.id, () => HttpResponse.json(manifest)),
      http.get('*/__tests__/fixtures/version-3/svg-annotations.json', () => HttpResponse.json(annotations)),
    );
  });
  setupIntegrationTestViewer(config);

  it('Adds a manifest and displays it', async () => {
    // Start on empty viewer
    fireEvent.click(await screen.findByRole('button', { name: 'Start Here' }));

    // Now we are in the resource list view
    fireEvent.click(screen.getByRole('button', { name: 'Add resource' }));

    // Input a manifest URL
    // eslint-disable-next-line testing-library/no-node-access
    fireEvent.input(document.getElementById('manifestURL'), {
      target: {
        value: manifest.id,
      },
    });

    fireEvent.click(screen.getByText('Add'));

    // Click the added manifest item
    // eslint-disable-next-line testing-library/no-node-access
    const listItem = document.querySelector(`[data-manifestid="${manifest.id}"]`);
    const button = await within(listItem).findByRole('button');
    fireEvent.click(button);

    // The viewer is loaded with the manifest
    const element = await screen.findByRole('heading', {
      name: manifest.label.en[0],
    });
    expect(element).toBeInTheDocument();

    // Switching to elastic mode should keep the loaded manifest visible
    fireEvent.click(screen.getByRole('button', { name: 'Workspace settings' }));
    fireEvent.click(await screen.findByRole('menuitem', { name: /Select workspace type/i }));
    fireEvent.click(await screen.findByRole('button', { name: /^Elastic/i }));

    expect(
      await screen.findByRole('heading', {
        name: manifest.label.en[0],
      }),
    ).toBeInTheDocument();
  });
});

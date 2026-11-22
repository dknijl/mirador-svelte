import { expect, it } from 'vitest';
import { screen, fireEvent, waitFor, setupIntegrationTestViewer } from '@tests/utils/test-utils';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import brokenManifest from '../../fixtures/version-2/broken.json';
import config from '../mirador-configs/blank';

describe('Invalid response while adding manifest', () => {
  beforeEach(() => {
    server.use(http.get('http://localhost:4444/invalid', () => new HttpResponse(null, { status: 500 })));
  });

  setupIntegrationTestViewer(config);

  /** */
  const addManifest = async (uri) => {
    // Now we are in the resource list view
    fireEvent.click(await screen.findByRole('button', { name: 'Add resource' }));

    // Input a manifest URL
    fireEvent.input(screen.getByLabelText('Resource location'), { target: { value: uri } });
    fireEvent.click(screen.getByText('Add'));
  };

  it('Loads a blank manifest row', async () => {
    // Start on empty viewer
    fireEvent.click(await screen.findByRole('button', { name: 'Start Here' }));

    // Add an invalid manifest URL
    const invalidUrl = 'http://localhost:4444/invalid';
    await addManifest(invalidUrl);

    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-node-access
      const listItem = document.querySelector(`[data-manifestid="${invalidUrl}"]`);
      expect(listItem).toBeInTheDocument();
    });
  });

  it('renders an error message when a manifest cannot be loaded (and allows it to be dismissed)', async () => {
    const uri = 'http://localhost:4444/__tests__/fixtures/version-2/broken.json';
    server.use(http.get(uri, () => HttpResponse.json(brokenManifest)));
    fireEvent.click(await screen.findByRole('button', { name: 'Start Here' }));
    await addManifest(uri);

    // Try the added manifest item
    // eslint-disable-next-line testing-library/no-node-access
    const listItem = document.querySelector(`[data-manifestid="${uri}"]`);
    expect(listItem).toBeInTheDocument();

    const errorMessage = await screen.findByText('The resource cannot be added:');
    expect(errorMessage).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    await waitFor(() => expect(listItem).not.toBeInTheDocument());
  });
});

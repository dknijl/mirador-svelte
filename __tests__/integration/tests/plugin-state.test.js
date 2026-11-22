import { expect, it } from 'vitest';
import { fireEvent, screen } from '@testing-library/dom';
import { http, HttpResponse } from 'msw';
import { setupIntegrationTestViewer } from '@tests/utils/test-utils';
import { server } from '../../mocks/server';
import manifest from '../../fixtures/version-3/0001-mvm-image.json';
import annotations from '../../fixtures/version-3/svg-annotations.json';
import { stateDependentPlugin } from '../plugins';

describe('Svelte plugin store access', () => {
  beforeEach(() => {
    server.use(
      http.get(manifest.id, () => HttpResponse.json(manifest)),
      http.get('*/__tests__/fixtures/version-3/svg-annotations.json', () => HttpResponse.json(annotations)),
    );
  });
  setupIntegrationTestViewer({ windows: [{ manifestId: manifest.id }] }, [stateDependentPlugin]);

  it('renders props selected from the viewer store', async () => {
    expect(await screen.findByRole('button', { name: `Plugin:${manifest.id}` }, { timeout: 8000 })).toBeInTheDocument();
  });

  it('registers the plugin reducer', ({ miradorInstance }) => {
    expect(miradorInstance.store.getState().pluginState.someNumber).toBe(0);
  });

  it('dispatches from a Svelte event handler to the plugin reducer', async ({ miradorInstance }) => {
    fireEvent.click(await screen.findByRole('button', { name: `Plugin:${manifest.id}` }, { timeout: 8000 }));
    expect(miradorInstance.store.getState().pluginState.someNumber).toBe(1);
  });
});

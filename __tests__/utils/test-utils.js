import { flushSync, tick, createRawSnippet } from 'svelte';
import { configure, screen } from '@testing-library/dom';
import { renderSvelte } from './render-svelte';
import { failIfErrorDialogPresent, safeFindByRole, safeFindAllByRole } from './safe-queries';

export * from '@testing-library/dom';
export { renderSvelte as render, safeFindByRole };

configure({ eventWrapper: (callback) => flushSync(callback) });

export function act(callback) {
  const result = flushSync(callback);
  if (result?.then) return result.then(() => tick());
  return result;
}

/** Static child content for snippet-based component tests. */
export const markup = (html) => createRawSnippet(() => ({ render: () => html }));

/** adds a mirador viewer to the DOM */
const setupMiradorViewer = async (config, plugins) => {
  const container = document.createElement('div');
  container.id = config.id || 'mirador';
  container.dataset.testid = 'mirador';
  document.body.appendChild(container);
  const { viewer: miradorViewer } = await import('@src/init');
  let viewer;
  await act(async () => {
    viewer = miradorViewer({ ...config, id: container.id }, plugins);
  });
  return viewer;
};

/** */
export const setupIntegrationTestViewer = (config, plugins) => {
  beforeEach(async (context) => {
    const miradorInstance = await setupMiradorViewer(config, plugins);
    // eslint-disable-next-line no-param-reassign
    context.miradorInstance = miradorInstance;

    // Wait for the viewer to render
    expect(await screen.findByTestId('mirador')).toBeInTheDocument();
    expect(await screen.findByLabelText('Workspace', {}, { timeout: 8000 })).toBeInTheDocument();

    await failIfErrorDialogPresent({ waitForRole: 'main' });

    if ((config.windows || []).length > 0) {
      await safeFindAllByRole('region', { name: /Window:/i });
    }
  });

  afterEach((context) => {
    // If miradorInstance has a store or unmount method, tear it down here
    const viewer = context.miradorInstance;
    const container = viewer?.container;
    if (viewer) act(() => viewer.unmount());
    container?.remove();
  });
};

import { render, screen } from '@tests/utils/test-utils';
import WindowSideBarAnnotationsPanel from '@src/components/WindowSideBarAnnotationsPanel.svelte';

import manifest from '../../fixtures/version-3/structures.json';

/** */
function createWrapper(props, state) {
  return render(
    WindowSideBarAnnotationsPanel,
    { annotationCount: 4, classes: {}, id: 'xyz', windowId: 'abc', ...props },
    {
      preloadedState: {
        companionWindows: { xyz: { content: 'annotations' } },
        windows: { abc: {} },
        ...state,
      },
    },
  );
}

describe('WindowSideBarAnnotationsPanel', () => {
  it('has a heading', () => {
    createWrapper();

    expect(screen.getByRole('heading')).toHaveTextContent('Annotations');
  });

  it('has the AnnotationSettings component', () => {
    createWrapper();

    expect(screen.getByRole('button', { name: 'Highlight all' })).toBeInTheDocument();
  });

  it('renders the annotationsCount', () => {
    createWrapper();

    expect(screen.getByText('Showing 4 annotations')).toBeVisible();
  });

  test('renders a CanvasAnnotations for every selected canvas', () => {
    const canvasIds = manifest.items.slice(0, 2).map((canvas) => canvas.id);
    const annotations = Object.fromEntries(
      canvasIds.map((id, index) => [
        id,
        {
          page: {
            json: {
              type: 'AnnotationPage',
              id: `${id}/page`,
              items: [
                {
                  type: 'Annotation',
                  id: `${id}/note`,
                  target: id,
                  motivation: 'commenting',
                  body: { type: 'TextualBody', value: `Note on canvas ${index + 1}` },
                },
              ],
            },
          },
        },
      ]),
    );
    createWrapper(
      { canvasIds },
      {
        annotations,
        manifests: { [manifest.id]: { id: manifest.id, json: manifest } },
        windows: { abc: { id: 'abc', manifestId: manifest.id } },
      },
    );
    const menus = screen.getAllByRole('menu');
    expect(menus).toHaveLength(2);
    expect(menus[0]).toHaveTextContent('Note on canvas 1');
    expect(menus[1]).toHaveTextContent('Note on canvas 2');
  });
});

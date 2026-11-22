import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { contentSearchMock } from '../../mocks/contentSearchMock';
import manifestFixtureFg165hz3589 from '../../fixtures/version-2/fg165hz3589.json';
import SearchPanel from '@src/components/SearchPanel.svelte';
import Connected from '@src/svelte/Connected.svelte';

/**
 * Helper function to wrap the Redux-connected SearchPanel
 */
function createWrapper(props = {}, { search, window } = {}) {
  return render(
    Connected,
    { name: 'SearchPanel', component: SearchPanel, targetProps: { id: 'xyz', windowId: 'window', ...props } },
    {
      preloadedState: {
        companionWindows: { xyz: { content: 'search' } },
        manifests: {
          manifest: {
            id: 'manifest',
            json: manifestFixtureFg165hz3589,
          },
        },
        ...(search && {
          searches: {
            window: {
              xyz: {
                data: {},
                ...search,
              },
            },
          },
        }),
        windows: {
          window: {
            id: 'window',
            manifestId: 'manifest',
            ...window,
          },
        },
      },
    },
  );
}

describe('SearchPanel', () => {
  const searchUrl = manifestFixtureFg165hz3589.service.at(0)['@id'];
  it('renders a CompanionWindow', () => {
    createWrapper();
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Search' })).toBeInTheDocument();
  });

  it('passes a Clear chip as the CompanionWindow title prop', () => {
    createWrapper(
      {},
      {
        search: {
          data: { [`${searchUrl}?q=Wolpertinger`]: { isFetching: false, json: contentSearchMock } },
          query: 'Wolpertinger',
        },
      },
    );

    expect(screen.getByRole('heading', { name: /Search/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset search' })).toBeInTheDocument();
  });

  it('clears the search when the Clear chip is clicked', async () => {
    const user = userEvent.setup();

    createWrapper(
      {},
      {
        search: {
          data: { [`${searchUrl}?q=Wolpertinger`]: { isFetching: false, json: contentSearchMock } },
          query: 'Wolpertinger',
        },
      },
    );

    await user.click(screen.getByRole('button', { name: 'Reset search' }));

    expect(screen.queryByRole('button', { name: 'Reset search' })).not.toBeInTheDocument();
  });

  it('does not render a Clear chip if there is no search query to be cleared', () => {
    createWrapper();

    expect(screen.queryByRole('button', { name: 'Reset search' })).not.toBeInTheDocument();
  });

  it('has the SearchPanelControls component', () => {
    createWrapper();

    expect(screen.getByRole('combobox', { name: 'search terms' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search in the document' })).toBeInTheDocument();
  });

  it('has the SearchResults list', () => {
    createWrapper();

    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('suggests searches and dispatches the encoded request', async () => {
    const user = userEvent.setup();
    expect(searchUrl).toBeDefined();
    const wrapper = createWrapper({}, { window: { suggestedSearches: ['Dry Cleaning & Laundry'] } });

    const suggestionBtn = screen.getByRole('button', {
      name: 'Search this document for "Dry Cleaning & Laundry"',
    });
    expect(suggestionBtn).toBeInTheDocument();

    await user.click(suggestionBtn);

    // The focused component store has no network saga; verify the real action
    // dispatch captured the full encoded service URL and user query.
    const search = wrapper.store.getState().searches.window.xyz;
    expect(search.query).toBe('Dry Cleaning & Laundry');
    expect(search.data).toHaveProperty(`${searchUrl}?q=Dry+Cleaning+%26+Laundry`);
  });

  it('does not suggest searches if the user has made a query', () => {
    createWrapper(
      {},
      {
        search: {
          data: { [`${searchUrl}?q=blah`]: { isFetching: false, json: contentSearchMock } },
          query: 'blah',
        },
        window: { suggestedSearches: ['NSF'] },
      },
    );

    expect(screen.queryByRole('button', { name: 'Search this document for "NSF"' })).not.toBeInTheDocument();
  });
});

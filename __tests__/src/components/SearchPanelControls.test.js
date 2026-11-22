import { autocompleteMock } from '../../mocks/autocompleteMock';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import SearchPanelControls from '@src/components/SearchPanelControls.svelte';

function createWrapper(props = {}) {
  const component = {
    companionWindowId: 'cw',
    windowId: 'window',
    fetchSearch: vi.fn(),
    searchService: { id: 'http://example.com/search' },
    ...props,
  };
  return { component, ...render(SearchPanelControls, component) };
}

describe('SearchPanelControls', () => {
  it('renders an accessible search form and input', () => {
    createWrapper();
    expect(screen.getByRole('form', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'search terms' })).toBeInTheDocument();
  });

  it('submits a URL-encoded search and clears the query on prop updates', async () => {
    const user = userEvent.setup();
    const { component, rerender } = createWrapper({ query: 'Wolpertinger' });
    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('Wolpertinger');
    await user.clear(input);
    await user.type(input, 'Dry Cleaning & Laundry');
    await user.click(screen.getByRole('button', { name: 'Search in the document' }));
    expect(component.fetchSearch).toHaveBeenCalledWith(
      'window',
      'cw',
      'http://example.com/search?q=Dry+Cleaning+%26+Laundry',
      'Dry Cleaning & Laundry',
    );
    rerender({ ...component, query: '' });
    expect(screen.getByRole('combobox')).toHaveValue('');
  });

  it('does not submit an empty query and shows loading state', async () => {
    const user = userEvent.setup();
    const { component } = createWrapper({ searchIsFetching: true });
    await user.click(screen.getByRole('button', { name: 'Search in the document' }));
    expect(component.fetchSearch).not.toHaveBeenCalled();
    expect(screen.getByRole('progressbar', { name: 'loading' })).toBeInTheDocument();
  });
});

describe('SearchPanelControls', () => {
  it('renders a form', () => {
    createWrapper();
    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('displays proposed autocomplete options when typing and submits search', async () => {
    const user = userEvent.setup();
    const fetchSearch = vi.fn();

    server.use(
      http.get('https://contentsearch.stanford.edu/fg165hz3589/autocomplete', () => {
        return HttpResponse.json(autocompleteMock, {
          headers: { 'Access-Control-Allow-Origin': '*' },
        });
      }),
    );

    createWrapper({
      autocompleteService: { id: 'https://contentsearch.stanford.edu/fg165hz3589/autocomplete' },
      fetchSearch,
      searchService: { id: 'https://contentsearch.stanford.edu/fg165hz3589/search' },
    });

    const input = screen.getByRole('combobox');
    await user.type(input, 'wund');

    // Wait for the Component's 500ms debounce and MSW response,
    // then check the dropdown options
    expect(await screen.findByRole('option', { name: 'wunder' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'wunderbar' })).toBeInTheDocument();

    const wunderOption = await screen.findByRole('option', { name: 'wunder' });
    await user.click(wunderOption);

    expect(fetchSearch).toHaveBeenCalledTimes(1);
    expect(fetchSearch).toHaveBeenCalledWith(
      'window',
      'cw',
      'https://contentsearch.stanford.edu/fg165hz3589/search?q=wunder',
      'wunder',
    );
  });
});

it('renders a text input through the renderInput prop', () => {
  createWrapper();

  expect(screen.getByRole('combobox')).toHaveAttribute('id', 'search-cw');
});
it('endAdornment is a SearchIcon (with no CircularProgress indicator)', () => {
  createWrapper();
  // eslint-disable-next-line testing-library/no-node-access
  expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
});

it('endAdornment has a CircularProgress indicator when there the current search is fetching', () => {
  createWrapper({ searchIsFetching: true });

  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});

it('form change and submission triggers an action', async () => {
  const user = userEvent.setup();
  const fetchSearch = vi.fn();
  const searchService = {
    id: 'http://www.example.com/search',
    options: { resource: { id: 'example.com/manifest' } },
  };
  createWrapper({ fetchSearch, query: 'asdf', searchService });

  await user.clear(screen.getByRole('combobox'));
  await user.keyboard('yolo');
  await user.click(screen.getByRole('button'));

  expect(fetchSearch).toHaveBeenCalledWith('window', 'cw', 'http://www.example.com/search?q=yolo', 'yolo');
});

it('does not submit an empty search', async () => {
  const user = userEvent.setup();
  const fetchSearch = vi.fn();
  const searchService = {
    id: 'http://www.example.com/search',
    options: { resource: { id: 'example.com/manifest' } },
  };

  createWrapper({ fetchSearch, query: '', searchService });

  await user.clear(screen.getByRole('combobox'));
  await user.click(screen.getByRole('button', { name: 'Search in the document' }));
  expect(fetchSearch).not.toHaveBeenCalled();
});

describe('input', () => {
  it('has the query prop has the input value on intial render', () => {
    createWrapper({ query: 'Wolpertinger' });
    expect(screen.getByRole('combobox')).toHaveValue('Wolpertinger');
  });

  it('clears the local search state/input when the incoming query prop has been cleared', () => {
    const { component, rerender } = createWrapper({ query: 'Wolpertinger' });
    expect(screen.getByRole('combobox')).toHaveValue('Wolpertinger');

    rerender({ ...component, query: '' });

    expect(screen.getByRole('combobox')).toHaveValue('');
  });
});

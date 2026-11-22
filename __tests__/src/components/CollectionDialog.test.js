import { Utils } from 'manifesto.js';
import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import CollectionDialog from '@src/components/CollectionDialog.svelte';
import collection from '../../fixtures/version-2/collection.json';
import parentCollection from '../../fixtures/version-2/parentCollection.json';

function createWrapper(props = {}) {
  const source = props.manifest || collection;
  const manifest = Utils.parseManifest(source);
  const collectionObject = props.collection ? Utils.parseManifest(props.collection) : null;
  const { manifest: _manifest, collection: _collection, ...otherProps } = props;
  return render(
    CollectionDialog,
    {
      open: true,
      addWindow: vi.fn(),
      collection: collectionObject,
      ready: true,
      manifestId: source['@id'],
      manifest,
      windowId: 'window',
      ...otherProps,
    },
    { preloadedState: { windows: { window: { id: 'window' } } } },
  );
}

describe('CollectionDialog', () => {
  it('renders a dialog with collection entries', () => {
    createWrapper();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(55);
    expect(screen.getByRole('menuitem', { name: 'Test 1 Manifest: Minimum Required Fields' })).toBeInTheDocument();
  });

  it('shows a loading state when the collection is not ready', () => {
    createWrapper({ ready: false });

    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
    expect(screen.getByText('loading')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access -- Loading placeholders are hidden from assistive technology.
    expect(screen.getByRole('dialog').querySelectorAll('.skeleton')).toHaveLength(3);
  });

  it('closes the dialog when the close button is clicked', async () => {
    const user = userEvent.setup();
    const hideCollectionDialog = vi.fn();
    createWrapper({ hideCollectionDialog });

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(hideCollectionDialog).toHaveBeenCalledWith('window');
  });

  it('opens a child collection', async () => {
    const user = userEvent.setup();
    const showCollectionDialog = vi.fn();
    createWrapper({ manifest: parentCollection, showCollectionDialog });

    await user.click(screen.getByRole('menuitem', { name: 'Collection of Test Cases - label for parent' }));
    expect(showCollectionDialog).toHaveBeenCalledWith(collection['@id'], [parentCollection['@id']], 'window');
  });

  it('navigates to the parent collection', async () => {
    const user = userEvent.setup();
    const showCollectionDialog = vi.fn();
    createWrapper({
      collection: parentCollection,
      dialogCollectionPath: [parentCollection['@id']],
      manifest: collection,
      showCollectionDialog,
    });

    await user.click(screen.getByRole('button', { name: 'Parent Collection of Collection' }));
    expect(showCollectionDialog).toHaveBeenCalledWith(parentCollection['@id'], [], 'window');
  });

  it('selects a manifest and updates the window and workspace visibility', async () => {
    const user = userEvent.setup();
    const hideCollectionDialog = vi.fn();
    const setWorkspaceAddVisibility = vi.fn();
    const updateWindow = vi.fn();
    const manifestId = 'http://iiif.io/api/presentation/2.1/example/fixtures/1/manifest.json';
    createWrapper({
      collection: parentCollection,
      dialogCollectionPath: [parentCollection['@id']],
      hideCollectionDialog,
      manifest: collection,
      setWorkspaceAddVisibility,
      updateWindow,
    });

    await user.click(screen.getByRole('menuitem', { name: 'Test 1 Manifest: Minimum Required Fields' }));
    expect(hideCollectionDialog).toHaveBeenCalledWith('window');
    expect(setWorkspaceAddVisibility).toHaveBeenCalledWith(false);
    expect(updateWindow).toHaveBeenCalledWith('window', {
      canvasId: null,
      collectionPath: [parentCollection['@id'], collection['@id']],
      manifestId,
    });
  });
});

import { render, screen, waitFor, markup } from '@tests/utils/test-utils';
import textManifest from '../../fixtures/version-3/text-pdf.json';
import PrimaryWindow from '@src/components/PrimaryWindow.svelte';

function createWrapper(props, preloadedState = { windows: { xyz: { collectionPath: [{}], companionWindowIds: [] } } }) {
  return render(PrimaryWindow, { windowId: 'xyz', ...props }, { preloadedState });
}

describe('PrimaryWindow', () => {
  it('renders the viewer and companion areas', async () => {
    createWrapper({ isFetching: false });
    expect(await screen.findByTestId('test-window')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(document.querySelector('.mirador-companion-area-left')).toBeInTheDocument();
  });

  it('places the thumbnail strip before the canvas and the information panel after it', () => {
    createWrapper({ children: markup('<div>Canvas</div>') });
    const canvas = screen.getByText('Canvas');
    // eslint-disable-next-line testing-library/no-node-access
    const thumbnails = document.querySelector('.mirador-companion-area-far-left');
    // eslint-disable-next-line testing-library/no-node-access
    const sidebar = document.querySelector('.mirador-companion-area-left');
    expect(thumbnails.compareDocumentPosition(canvas) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(canvas.compareDocumentPosition(sidebar) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('renders snippet children when available', () => {
    createWrapper({ children: markup('<span>hi</span>'), isFetching: false });
    expect(screen.getByText('hi')).toBeInTheDocument();
  });

  it('does not mount the image viewer while fetching', () => {
    createWrapper({ isFetching: true });
    // eslint-disable-next-line testing-library/no-node-access
    expect(document.querySelector('.mirador-osd-container')).not.toBeInTheDocument();
  });

  it('renders GalleryView when fetching is complete and view is gallery', async () => {
    createWrapper({ isFetching: false, view: 'gallery' });
    // eslint-disable-next-line testing-library/no-node-access
    await waitFor(() => expect(document.querySelector('#xyz-gallery')).toBeInTheDocument());
  });

  it('renders the collection dialog and collection viewer', async () => {
    createWrapper({ isCollection: true, isCollectionDialogVisible: true });
    expect(await screen.findByRole('button', { name: /show collection/i })).toBeInTheDocument();
  });

  it('renders a TextViewer for a text-only manifest', async () => {
    const manifestId = 'https://iiif.io/api/cookbook/recipe/0001-text-pdf/manifest.json';
    const canvasId = 'https://iiif.io/api/cookbook/recipe/0001-text-pdf/canvas';
    const preloadedState = {
      manifests: { [manifestId]: { id: manifestId, json: textManifest } },
      windows: { xyz: { manifestId, visibleCanvases: [canvasId] } },
    };
    createWrapper({ textResources: [true] }, preloadedState);
    // eslint-disable-next-line testing-library/no-node-access
    await waitFor(() => expect(document.querySelector('source:nth-of-type(1)')).toHaveAttribute('type', 'application/pdf'));
  });
});

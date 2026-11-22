import { renderSvelte } from '@tests/utils/render-svelte';
import TileSource from '@src/components/TileSource.svelte';

describe('OpenSeadragonTileSource', () => {
  it('calls addTiledImage with the tile source', () => {
    const viewer = {
      addTiledImage: vi.fn(),
    };
    const tileSource = { '@id': 'http://example.com/image/info.json' };

    renderSvelte(TileSource, { viewer, tileSource, fallbackImage: 'fallback.png' });

    expect(viewer.addTiledImage).toHaveBeenCalledWith(expect.objectContaining({ tileSource }));
  });

  it('updates the opacity when the prop changes', async () => {
    const mockOsdItem = { setOpacity: vi.fn() };
    const viewer = {
      addTiledImage: vi.fn().mockImplementation(({ success }) => {
        success({ item: mockOsdItem });
      }),
      world: {
        removeItem: vi.fn(),
      },
    };
    const tileSource = { '@id': 'http://example.com/image/info.json' };

    const { rerender } = renderSvelte(TileSource, { viewer, tileSource, fallbackImage: 'fallback.png' });
    rerender({ viewer, tileSource, opacity: 0.5 });

    expect(viewer.addTiledImage).toHaveBeenCalledTimes(1);
    expect(mockOsdItem.setOpacity).toHaveBeenCalledWith(0.5);
  });

  it('updates the index when the prop changes', async () => {
    const mockOsdItem = vi.fn();
    const viewer = {
      addTiledImage: vi.fn().mockImplementation(({ success }) => {
        success({ item: mockOsdItem });
      }),
      world: {
        removeItem: vi.fn(),
        setItemIndex: vi.fn(),
      },
    };

    const tileSource = { '@id': 'http://example.com/image/info.json' };

    const { rerender } = renderSvelte(TileSource, { viewer, tileSource, fallbackImage: 'fallback.png' });
    rerender({ viewer, tileSource, index: 5 });

    expect(viewer.addTiledImage).toHaveBeenCalledTimes(1);
    expect(viewer.world.setItemIndex).toHaveBeenCalledWith(mockOsdItem, 5);
  });

  it('updates the rendered bounds when the prop changes', async () => {
    const mockOsdItem = { fitBounds: vi.fn() };
    const viewer = {
      addTiledImage: vi.fn().mockImplementation(({ success }) => {
        success({ item: mockOsdItem });
      }),
      world: {
        removeItem: vi.fn(),
        setItemIndex: vi.fn(),
      },
    };

    const tileSource = { '@id': 'http://example.com/image/info.json' };

    const { rerender } = renderSvelte(TileSource, { viewer, tileSource, fallbackImage: 'fallback.png' });
    rerender({ viewer, tileSource, fitBounds: [0, 0, 10, 10] });

    expect(viewer.addTiledImage).toHaveBeenCalledTimes(1);
    expect(mockOsdItem.fitBounds).toHaveBeenCalledTimes(1);
    rerender({ viewer, tileSource, fitBounds: [0, 0, 10, 10] });
    expect(mockOsdItem.fitBounds).toHaveBeenCalledTimes(1);
    expect(viewer.world.removeItem).not.toHaveBeenCalled();
  });

  it('deletes the item from the world when the item is unmounted', async () => {
    const mockOsdItem = vi.fn();
    const viewer = {
      addTiledImage: ({ success }) => {
        success({ item: mockOsdItem });
      },
      world: {
        removeItem: vi.fn(),
      },
    };
    const tileSource = { '@id': 'http://example.com/image/info.json' };

    const { unmount } = renderSvelte(TileSource, { viewer, tileSource, fallbackImage: 'fallback.png' });

    unmount();

    // Assert removeItem was called
    expect(viewer.world.removeItem).toHaveBeenCalledWith(mockOsdItem);
  });

  it('loads fallback image when tile load fails', async () => {
    const addTiledImage = vi
      .fn()
      .mockImplementationOnce(({ error }) => error(new Error('fail')))
      .mockImplementationOnce(({ success }) => success({ item: { id: 'fallback' } }));

    const viewer = {
      addTiledImage,
      world: { removeItem: vi.fn() },
    };
    const tileSource = { '@id': 'http://example.com/image/info.json' };

    renderSvelte(TileSource, { viewer, tileSource, fallbackImage: 'fallback.png' });

    // Should attempt to load original, then fallback
    expect(addTiledImage).toHaveBeenCalledTimes(2);
    expect(addTiledImage.mock.calls[1][0].tileSource.type).toBe('image');
  });
});

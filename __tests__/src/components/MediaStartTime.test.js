import { screen } from '@testing-library/dom';
import { renderSvelte } from '@tests/utils/render-svelte';
import AudioViewer from '@src/components/AudioViewer.svelte';

function renderMedia(props) {
  const options = { audioOptions: { 'data-testid': 'media' } };
  const view = renderSvelte(AudioViewer, { ...options, ...props });
  return { ...view, rerender: (next) => view.rerender({ ...options, ...next }) };
}

/** Record every write to currentTime on the media element */
function spyOnCurrentTime(media) {
  const setter = vi.fn();
  Object.defineProperty(media, 'currentTime', { configurable: true, get: () => 0, set: setter });
  return setter;
}

/** happy-dom never loads media, so fake an element whose metadata has loaded */
function markMetadataLoaded(media) {
  Object.defineProperty(media, 'HAVE_METADATA', { configurable: true, value: 1 });
  Object.defineProperty(media, 'readyState', { configurable: true, value: 1 });
}

describe('media start time', () => {
  it('does nothing when no start time is given', () => {
    renderMedia({});
    const media = screen.getByTestId('media');
    const setter = spyOnCurrentTime(media);

    media.dispatchEvent(new Event('loadedmetadata'));

    expect(setter).not.toHaveBeenCalled();
  });

  it('waits for loadedmetadata before seeking', () => {
    renderMedia({ startTime: 30 });
    const media = screen.getByTestId('media');
    const setter = spyOnCurrentTime(media);

    expect(setter).not.toHaveBeenCalled();

    media.dispatchEvent(new Event('loadedmetadata'));

    expect(setter).toHaveBeenCalledExactlyOnceWith(30);
  });

  it('seeks immediately when the metadata is already loaded', () => {
    const { rerender } = renderMedia({});
    const media = screen.getByTestId('media');
    markMetadataLoaded(media);
    const setter = spyOnCurrentTime(media);

    rerender({ startTime: 45 });

    expect(setter).toHaveBeenCalledExactlyOnceWith(45);
  });

  it('treats a start time of 0 as a seek request', () => {
    const { rerender } = renderMedia({});
    const media = screen.getByTestId('media');
    markMetadataLoaded(media);
    const setter = spyOnCurrentTime(media);

    rerender({ startTime: 0 });

    expect(setter).toHaveBeenCalledExactlyOnceWith(0);
  });

  it('only applies the latest start time if it changes before metadata loads', () => {
    const { rerender } = renderMedia({ startTime: 30 });
    const media = screen.getByTestId('media');
    const setter = spyOnCurrentTime(media);

    rerender({ startTime: 60 });
    media.dispatchEvent(new Event('loadedmetadata'));

    expect(setter).toHaveBeenCalledExactlyOnceWith(60);
  });

  it('seeks the new element when the media key changes', () => {
    const { rerender } = renderMedia({ startTime: 30, canvasId: 'a' });
    const oldMedia = screen.getByTestId('media');
    const oldSetter = spyOnCurrentTime(oldMedia);

    rerender({ startTime: 30, canvasId: 'b' });
    const newMedia = screen.getByTestId('media');
    const newSetter = spyOnCurrentTime(newMedia);

    expect(newMedia).not.toBe(oldMedia);

    oldMedia.dispatchEvent(new Event('loadedmetadata'));
    newMedia.dispatchEvent(new Event('loadedmetadata'));

    expect(oldSetter).not.toHaveBeenCalled();
    expect(newSetter).toHaveBeenCalledExactlyOnceWith(30);
  });

  it('removes its listener on unmount', () => {
    const { unmount } = renderMedia({ startTime: 30 });
    const media = screen.getByTestId('media');
    const setter = spyOnCurrentTime(media);

    unmount();
    media.dispatchEvent(new Event('loadedmetadata'));

    expect(setter).not.toHaveBeenCalled();
  });
});

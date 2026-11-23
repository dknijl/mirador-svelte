import { createViewerContext } from '@src/svelte/viewerContext';
import createStore from '@src/state/store';
import { updateConfig } from '@src/state/actions';

describe('viewer-scoped image and language state', () => {
  const context = () => createViewerContext(createStore([], []));
  it('defaults to English and resolves the bundled German translation', () => {
    const viewer = context();
    expect(viewer.t('aboutMirador')).toBe('About Kokudor');
    viewer.store.dispatch(updateConfig({ language: 'de' }));
    expect(viewer.t('aboutMirador')).toBe('Über Kokudor');
  });
  it('uses the viewer fallback image setting', () => {
    const viewer = context();
    viewer.store.dispatch(updateConfig({ fallbackImage: 'custom.jpg' }));
    expect(viewer.fallbackImage).toBe('custom.jpg');
  });
  it('has a default SVG warning image', () => {
    const viewer = context();
    expect(viewer.fallbackImage).toContain('data:image/svg+xml');
    expect(viewer.fallbackImage).toContain('%231967d2');
  });
  it('isolates failed image notifications by viewer', () => {
    const a = context(),
      b = context();
    expect(a.failedImages).toBeInstanceOf(Set);
    expect(a.failedImages.size).toBe(0);
    a.notifyFailure('bad-image');
    expect(a.failedImages.size).toBe(1);
    expect(a.failedImages.has('bad-image')).toBe(true);
    expect(b.failedImages.size).toBe(0);
  });
  it('tracks configured translations and locale changes', () => {
    const viewer = context();
    viewer.store.dispatch(
      updateConfig({ translations: { en: { aboutMirador: 'About this viewer' }, de: { aboutMirador: 'Über diesen Viewer' } } }),
    );
    expect(viewer.t('aboutMirador')).toBe('About this viewer');
    viewer.store.dispatch(updateConfig({ language: 'de' }));
    expect(viewer.t('aboutMirador')).toBe('Über diesen Viewer');
  });
});

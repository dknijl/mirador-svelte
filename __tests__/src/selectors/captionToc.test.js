import multiLanguageLabels from '../../fixtures/version-2/multi-language-labels.json';
import noStructures from '../../fixtures/version-3/001.json';
import { getCaptionTocEntries } from '@src/state/selectors/captionToc';

describe('getCaptionTocEntries', () => {
  it('lists the ranges of a manifest that has a table of contents', () => {
    const state = { manifests: { x: { json: multiLanguageLabels } } };

    const entries = getCaptionTocEntries(state, { manifestId: 'x' });

    expect(entries.length).toBeGreaterThan(1);
    expect(entries[0].label).toBe('front cover');
    expect(entries[0].canvasId).toBeTruthy();
  });

  it('falls back to the canvas captions when the manifest has no structures', () => {
    const state = { manifests: { x: { json: noStructures } } };

    const entries = getCaptionTocEntries(state, { manifestId: 'x' });

    expect(entries.map((entry) => entry.label)).toEqual(['Whole Page']);
  });

  it('returns no entries without a manifest', () => {
    expect(getCaptionTocEntries({ manifests: {} }, { manifestId: 'missing' })).toEqual([]);
  });
});

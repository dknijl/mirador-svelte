import { createSelector } from 'reselect';
import { buildCaptionToc } from '../../svelte/captionToc';
import { getManifestLocale, getManifestoInstance } from './manifests';
import { getCanvases } from './canvases';
import { getSequenceTreeStructure } from './sequences';

/**
 * Resolve the display label of a manifesto node (Range or Canvas) for the
 * manifest locale, falling back to its untagged label.
 *
 * @param {object} node
 * @param {string|undefined} locale
 */
function nodeLabel(node, locale) {
  const data = node && node.data;

  if (data && typeof data.getLabel === 'function') {
    return data.getLabel().getValue(locale) || data.getLabel().getValue('none') || undefined;
  }

  const label = node && node.label;

  return typeof label === 'string' && label !== 'root' ? label : undefined;
}

/**
 * Rows for the right-pane table of contents, derived from the manifest's
 * caption data (IIIF structures and canvas labels).
 *
 * @param {object} state
 * @param {object} props
 * @param {string} props.windowId
 */
export const getCaptionTocEntries = createSelector(
  [getManifestoInstance, getSequenceTreeStructure, getCanvases, getManifestLocale],
  (manifest, tree, canvases, locale) => {
    if (!manifest) return [];

    return buildCaptionToc(tree, canvases, (node) => nodeLabel(node, locale));
  },
);

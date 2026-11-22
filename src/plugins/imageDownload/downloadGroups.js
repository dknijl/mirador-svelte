import {
  getCanvasLabel,
  getConfig,
  getManifestoInstance,
  getSequence,
  getVisibleCanvases,
  getWindowViewType,
  selectInfoResponse,
} from '../../state/selectors';
import MiradorCanvas from '../../lib/MiradorCanvas';
import { getIiifResourceImageService } from '../../lib/iiif';
import { OSDReferences } from '../OSDReferences';
import { calculateHeightForWidth, createCanonicalImageUrl } from './iiifImage';

/** Only offer web resources. Preserve existing query parameters and fragments. */
function downloadLink(id, label, image = false) {
  if (!id) return [];
  const url = URL.parse(id, document.baseURI);
  if (!url || !['http:', 'https:'].includes(url.protocol)) return [];
  if (image) url.searchParams.set('download', 'true');
  return [{ href: url.href, label }];
}

function renderingLinks(resource) {
  return (resource?.getRenderings?.() || []).flatMap((r) => downloadLink(r.id, r.getLabel().getValue() || r.id));
}

/** Measure the visible part of the actual tiled image in source pixels. */
function zoomedRegion(viewer, info) {
  if (!viewer?.viewport || viewer.world?.getItemCount() !== 1) return undefined;
  const tile = viewer.world.getItemAt(0);
  const sourceId = tile.source['@id'] || tile.source.id;
  if (sourceId !== (info.id || info['@id'])) return undefined;
  const bounds = tile.viewportToImageRectangle(viewer.viewport.getBounds(true)).getBoundingBox();
  const x = Math.max(0, Math.floor(bounds.x));
  const y = Math.max(0, Math.floor(bounds.y));
  const width = Math.min(info.width, Math.ceil(bounds.x + bounds.width)) - x;
  const height = Math.min(info.height, Math.ceil(bounds.y + bounds.height)) - y;
  if (width <= 0 || height <= 0 || (width === info.width && height === info.height)) return undefined;
  return { height, region: [x, y, width, height].join(','), width };
}

function imageServiceLinks(info, t, viewer, restrict) {
  if (!info) return [];
  const nativeLink = downloadLink(
    createCanonicalImageUrl(info, 'full', info.width, info.height),
    t('mirador-dl-plugin.full_size', { width: info.width, height: info.height }),
    true,
  );
  const options = (info.sizes || [])
    .filter(({ width, height }) => width !== info.width || height !== info.height)
    .map(({ width, height }) => ({ width, height, region: 'full' }));
  if (!info.sizes?.length && info.width > 1000) {
    options.push({ width: 1000, height: calculateHeightForWidth(info, 1000), region: 'full' });
  }
  const singleSize = info.sizes?.length === 1 && info.sizes[0];
  if (!(restrict && singleSize && singleSize.width <= info.width && singleSize.height <= info.height)) {
    const crop = zoomedRegion(viewer, info);
    if (crop) options.unshift(crop);
  }
  return nativeLink.concat(
    options.flatMap(({ width, height, region }) =>
      downloadLink(
        createCanonicalImageUrl(info, region, width, height),
        t(region === 'full' ? 'mirador-dl-plugin.whole_image' : 'mirador-dl-plugin.zoomed_region', { width, height }),
        true,
      ),
    ),
  );
}

/** Snapshot the current window and viewport when presenting download choices. */
export function getDownloadGroups(state, windowId, t) {
  const props = { windowId };
  const viewer = getWindowViewType(state, props) === 'single' && OSDReferences.get(windowId)?.current;
  const restrict = getConfig(state).miradorDownloadPlugin?.restrictDownloadOnSizeDefinition;
  const groups = getVisibleCanvases(state, props).map((canvas) => {
    const links = new MiradorCanvas(canvas).imageResources.flatMap((resource) => {
      const service = getIiifResourceImageService(resource);
      if (service)
        return imageServiceLinks(selectInfoResponse(state, { infoId: service.id, windowId })?.json, t, viewer, restrict);
      if (
        !['Image', 'dctypes:Image'].includes(resource.getProperty('type')) &&
        !resource.getProperty('format')?.startsWith('image/')
      )
        return [];
      const width = resource.getProperty('width');
      const height = resource.getProperty('height');
      const label =
        width && height
          ? t('mirador-dl-plugin.whole_image', { width, height })
          : t('mirador-dl-plugin.whole_image_labeled', { label: resource.getLabel().getValue() || resource.id });
      return downloadLink(resource.id, label, true);
    });
    return { label: getCanvasLabel(state, { canvasId: canvas.id, windowId }), links: [...links, ...renderingLinks(canvas)] };
  });
  groups.push({
    label: t('mirador-dl-plugin.other_download'),
    links: [...renderingLinks(getManifestoInstance(state, props)), ...renderingLinks(getSequence(state, props))],
  });
  return groups
    .filter(({ links }) => links.length)
    .map(({ label, links }) => ({ label, links: [...new Map(links.map((link) => [link.href, link])).values()] }));
}

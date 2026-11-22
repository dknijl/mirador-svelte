import { v4 as uuid } from 'uuid';
import { readImageMetadata } from './readImageMetadata';

/** */
const safeParseURL = (str) => {
  try {
    return new URL(str);
  } catch (e) {
    console.warn('Invalid URL:', str);
    return null;
  }
};

/** */
export const handleDrop = (item, monitor, props) => {
  const { onDrop } = props;

  if (item.html) {
    const doc = new DOMParser().parseFromString(item.html, 'text/html');

    // Try to find a link tag
    const link = doc.querySelector('a[href]');
    if (link) {
      const url = safeParseURL(link.href);
      if (url) {
        // Recursively call the method again with the extracted URL
        return handleDrop({ urls: [url.toString()] }, monitor, props);
      }
    }
  }

  if (item.urls) {
    item.urls.forEach((str) => {
      const url = safeParseURL(str);
      if (!url) return;

      const manifestId = url.searchParams.get('manifest') || url.searchParams.get('iiif-content');
      const canvasId = url.searchParams.get('canvas');

      if (manifestId) onDrop({ canvasId, manifestId }, props, monitor);
    });
  }

  if (item.files) {
    const manifestFiles = item.files.filter((f) => f.type === 'application/json');
    const manifestPromises = manifestFiles.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.addEventListener('error', () => reject(reader.error));
          reader.addEventListener('load', () => {
            const manifestJson = reader.result;
            const manifestId = uuid();

            if (manifestJson) onDrop({ manifestId, manifestJson }, props, monitor);
            resolve();
          });
          reader.readAsText(file);
        }),
    );

    const imageFiles = item.files.filter(({ type }) => type.startsWith('image/'));

    let imagePromise;

    if (imageFiles.length > 0) {
      const id = uuid();
      const imageData = imageFiles.map((file) => readImageMetadata(file));

      imagePromise = Promise.all(imageData).then((images) => {
        const manifestJson = {
          '@context': 'http://iiif.io/api/presentation/3/context.json',
          id,
          items: images.map(({ name, type, width, height, url }, index) => ({
            height,
            id: `${id}/canvas/${index}`,
            items: [
              {
                id: `${id}/canvas/${index}/1`,
                items: [
                  {
                    body: {
                      format: type,
                      id: url,
                      type: 'Image',
                    },
                    height,
                    id: `${id}/canvas/${index}/1/image`,
                    motivation: 'painting',
                    target: `${id}/canvas/${index}/1`,
                    type: 'Annotation',
                    width,
                  },
                ],
                type: 'AnnotationPage',
              },
            ],
            label: name,
            type: 'Canvas',
            width,
          })),
          label: images[0].name,
          type: 'Manifest',
        };

        const manifestId = uuid();
        if (manifestJson) onDrop({ manifestId, manifestJson }, props, monitor);
      });
    }

    return Promise.all([...manifestPromises, imagePromise]);
  }

  return undefined;
};

/** Bind external IIIF drops without intercepting internal window rearrangement. */
export function attachIIIFDrop(element, onDrop) {
  const supported = (event) =>
    !element.closest('[data-disable-iiif-drop]') &&
    Array.from(event.dataTransfer?.types || []).some((type) => ['Files', 'Url', 'text/uri-list', 'text/html'].includes(type));
  let depth = 0;
  function clear() {
    depth = 0;
    element.removeAttribute('data-drag-over');
  }
  function enter(event) {
    if (!supported(event)) return;
    depth += 1;
    element.setAttribute('data-drag-over', '');
  }
  function leave() {
    depth = Math.max(0, depth - 1);
    if (!depth) clear();
  }
  function over(event) {
    if (supported(event)) event.preventDefault();
  }
  function drop(event) {
    clear();
    if (!supported(event) || !onDrop) return;
    event.preventDefault();
    const transfer = event.dataTransfer;
    const uriList = transfer.getData?.('text/uri-list') || transfer.getData?.('Url') || '';
    const urls = uriList.split(/\r?\n/).filter((url) => url && !url.startsWith('#'));
    const html = transfer.getData?.('text/html');
    const files = Array.from(transfer.files || []);
    // Safari can expose a dragged link as both a URL and a file.
    const item = urls.length ? { urls } : { files, html };
    handleDrop(item, null, { onDrop });
  }
  const handlers = { dragenter: enter, dragleave: leave, dragover: over, drop };
  Object.entries(handlers).forEach(([type, handler]) => element.addEventListener(type, handler));
  return () => {
    clear();
    Object.entries(handlers).forEach(([type, handler]) => element.removeEventListener(type, handler));
  };
}

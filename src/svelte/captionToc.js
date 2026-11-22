/**
 * Build the right-pane table of contents for a manifest from its caption data.
 *
 * "Caption data" is what the manifest itself carries: its IIIF structures
 * (Ranges) and its canvas labels. Nothing is fetched separately, so the panel
 * also works for manifests without a table of contents and for level 0
 * manifests.
 *
 * Rows are flat, so the renderer only indents by `depth`:
 *   { id, label, canvasId, canvasCount, depth, hasChildren, kind }
 *
 * - `kind` is `range` for a grouping row and `canvas` for a canvas row.
 * - `canvasCount` is only set on grouping rows: it is how many distinct
 *   canvases the Range covers, so the panel can show "label (12)".
 * - a labelled Range covering more than one canvas becomes a grouping row and
 *   its canvases follow one level deeper. A single-canvas Range adds no
 *   grouping row, so the same caption does not appear twice in a row.
 * - canvas rows use the canvas caption. An unlabelled canvas falls back to its
 *   1-based position, the same rule as MiradorCanvas#getLabel.
 * - every canvas gets exactly one row: overlapping Ranges and Range members
 *   expressed through a `SpecificResource` are de-duplicated, and canvases that
 *   no Range mentions are appended in reading order.
 *
 * @param {object} tree manifesto tree node from `manifest.getDefaultTree()`
 * @param {Array<object>} canvases manifesto canvases in reading order
 * @param {(node: object) => string | undefined} getLabel resolves a node label
 * @returns {Array<object>}
 */
export function buildCaptionToc(tree, canvases, getLabel) {
  const children = (node) => (node && node.nodes) || [];
  const canvasIds = (node) => (node && node.data && typeof node.data.getCanvasIds === 'function' ? node.data.getCanvasIds() : []);

  // A Range child may point at a canvas with a fragment selector (`#xywh=`,
  // `#t=`), so ids are compared without the fragment.
  const stripFragment = (id) => String(id).split('#')[0];

  const canvasLabelById = new Map(
    canvases.map((canvas, index) => [
      stripFragment(canvas.id),
      getLabel({ data: canvas, id: canvas.id, nodes: [] }) || String(index + 1),
    ]),
  );

  const seenCanvasIds = new Set();

  /** @type {Array<object>} */
  const rows = [];

  /** @param {object} node */
  function descendantCanvasIds(node) {
    return [...canvasIds(node), ...children(node).flatMap(descendantCanvasIds)];
  }

  /**
   * @param {string} canvasId
   * @param {number} depth
   * @param {string} id
   */
  function pushCanvasRow(canvasId, depth, id) {
    const key = stripFragment(canvasId);

    if (seenCanvasIds.has(key)) return;

    seenCanvasIds.add(key);
    rows.push({
      canvasId,
      depth,
      hasChildren: false,
      id,
      kind: 'canvas',
      label: canvasLabelById.get(key),
    });
  }

  /**
   * @param {object} node
   * @param {number} depth
   */
  function visit(node, depth) {
    const nodeChildren = children(node);
    const descendantIds = descendantCanvasIds(node);
    const rangeLabel = getLabel(node);
    const needsGroup = Boolean(rangeLabel) && descendantIds.length > 1;
    const canvasDepth = needsGroup ? depth + 1 : depth;

    if (needsGroup) {
      rows.push({
        canvasId: descendantIds[0],
        canvasCount: new Set(descendantIds.map(stripFragment)).size,
        depth,
        hasChildren: true,
        id: node.id || `range-${rows.length}`,
        kind: 'range',
        label: rangeLabel,
      });
    }

    // A Range that also has child Ranges may still point at canvases directly;
    // those rows come first so the reading order of the group is kept.
    const childCanvasIds = new Set(nodeChildren.flatMap(descendantCanvasIds).map(stripFragment));

    canvasIds(node)
      .filter((canvasId) => !childCanvasIds.has(stripFragment(canvasId)))
      .forEach((canvasId, index) => pushCanvasRow(canvasId, canvasDepth, `${node.id || 'range'}-${index}`));

    nodeChildren.forEach((child) => visit(child, canvasDepth));
  }

  children(tree).forEach((child) => visit(child, 0));

  // Keep the index complete: a canvas may be reachable only through a Range
  // selector or not be in the structures at all.
  canvases.forEach((canvas, index) => pushCanvasRow(canvas.id, 0, canvas.id || `canvas-${index}`));

  return rows;
}

import { describe, expect, it } from 'vitest';
import { buildCaptionToc } from '@src/svelte/captionToc';

/** Builds a manifesto-like Range tree node */
function range(id, label, canvasIds = [], nodes = []) {
  return { data: { getCanvasIds: () => canvasIds, getLabel: () => ({ getValue: () => label }) }, id, nodes };
}

/** Builds a manifesto-like Canvas */
function canvas(id, label) {
  return { getLabel: () => ({ getValue: () => label }), id };
}

/** Mirrors the selector: labels are read from node.data */
const getLabel = (node) => {
  const data = node && node.data;

  if (data && typeof data.getLabel === 'function') return data.getLabel().getValue() || undefined;

  return undefined;
};

describe('buildCaptionToc', () => {
  it('groups a labelled range over several canvases and indents its canvases', () => {
    const tree = { nodes: [range('r1', 'Chapter 1', ['c1', 'c2'])] };
    const canvases = [canvas('c1', 'Page 1'), canvas('c2', 'Page 2')];

    const rows = buildCaptionToc(tree, canvases, getLabel);

    expect(rows.map((row) => [row.kind, row.label, row.depth])).toEqual([
      ['range', 'Chapter 1', 0],
      ['canvas', 'Page 1', 1],
      ['canvas', 'Page 2', 1],
    ]);
    expect(rows[0].canvasId).toBe('c1');
    expect(rows[0].canvasCount).toBe(2);
    expect(rows[0].hasChildren).toBe(true);
  });

  it('does not repeat the caption for a single-canvas range', () => {
    const tree = { nodes: [range('r1', 'Front cover', ['c1'])] };

    const rows = buildCaptionToc(tree, [canvas('c1', 'Front cover')], getLabel);

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ canvasId: 'c1', depth: 0, kind: 'canvas', label: 'Front cover' });
  });

  it('nests child ranges one level per parent group', () => {
    const tree = { nodes: [range('r1', 'Part 1', ['c1', 'c2'], [range('r1-1', 'Chapter 1', ['c1', 'c2'])])] };
    const canvases = [canvas('c1', 'Page 1'), canvas('c2', 'Page 2')];

    const rows = buildCaptionToc(tree, canvases, getLabel);

    expect(rows.map((row) => [row.label, row.depth])).toEqual([
      ['Part 1', 0],
      ['Chapter 1', 1],
      ['Page 1', 2],
      ['Page 2', 2],
    ]);
  });

  it('numbers unlabelled canvases so rows are never blank', () => {
    const tree = { nodes: [range('r1', undefined, ['c1'])] };

    const rows = buildCaptionToc(tree, [canvas('c1', undefined)], getLabel);

    expect(rows[0].label).toBe('1');
  });

  it('matches a fragment-suffixed range canvas to its canvas caption', () => {
    const tree = { nodes: [range('r1', 'Detail', ['c1#xywh=0,0,5,5'])] };

    const rows = buildCaptionToc(tree, [canvas('c1', 'Detail')], getLabel);

    expect(rows).toHaveLength(1);
    expect(rows[0].label).toBe('Detail');
  });

  it('lists every canvas exactly once when ranges overlap', () => {
    const tree = {
      nodes: [range('r1', 'Group', ['c1', 'c2']), range('r2', 'Group', ['c2', 'c3'])],
    };
    const canvases = [canvas('c1', 'Page 1'), canvas('c2', 'Page 2'), canvas('c3', 'Page 3')];

    const canvasRows = buildCaptionToc(tree, canvases, getLabel).filter((row) => row.kind === 'canvas');

    expect(canvasRows.map((row) => row.canvasId)).toEqual(['c1', 'c2', 'c3']);
  });

  it('appends canvases that no range mentions', () => {
    const tree = { nodes: [range('r1', 'Group', ['c1', 'c2'])] };
    const canvases = [canvas('c1', 'Page 1'), canvas('c2', 'Page 2'), canvas('c3', 'Page 3')];

    const rows = buildCaptionToc(tree, canvases, getLabel);

    expect(rows.map((row) => row.canvasId)).toEqual(['c1', 'c1', 'c2', 'c3']);
  });

  it('lists canvases when the manifest has no structures', () => {
    const rows = buildCaptionToc({ nodes: [] }, [canvas('c1', 'Page 1'), canvas('c2', 'Page 2')], getLabel);

    expect(rows.map((row) => row.label)).toEqual(['Page 1', 'Page 2']);
    expect(rows.every((row) => row.depth === 0 && row.kind === 'canvas')).toBe(true);
  });

  it('returns no rows when there is neither a tree nor canvases', () => {
    expect(buildCaptionToc(undefined, [], getLabel)).toEqual([]);
  });
});

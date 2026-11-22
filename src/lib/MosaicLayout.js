/** Read saved binary layouts as well as the current split and tab formats. */
export function normalizeLayout(node) {
  if (!node || typeof node !== 'object') return node ?? null;
  if (node.type === 'tabs') return node;
  const children = node.children || [node.first, node.second];
  if (!children.every((child) => child != null)) return null;
  const split = { type: 'split', direction: node.direction, children: children.map(normalizeLayout) };
  if (node.splitPercentages) split.splitPercentages = node.splitPercentages;
  else if (node.splitPercentage != null) split.splitPercentages = [node.splitPercentage, 100 - node.splitPercentage];
  return split;
}

export function leaves(node) {
  if (node == null) return [];
  if (typeof node !== 'object') return [node];
  return node.tabs ?? node.children.flatMap(leaves);
}

export function percentages(node) {
  const weights = node.splitPercentages ?? node.children.map(() => 1);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  return weights.map((weight) => (total ? (100 * weight) / total : 100 / weights.length));
}

export function replaceAt(node, path, replacement) {
  if (!path.length) return replacement;
  const [index, ...rest] = path;
  return { ...node, children: node.children.map((child, i) => (i === index ? replaceAt(child, rest, replacement) : child)) };
}

function prune(node, keep) {
  if (node == null || typeof node !== 'object') return keep.has(node) ? node : null;
  if (node.tabs) {
    const tabs = node.tabs.filter((id) => keep.has(id));
    if (tabs.length < 2) return tabs[0] ?? null;
    const active = tabs.indexOf(node.tabs[node.activeTabIndex]);
    return { ...node, tabs, activeTabIndex: active < 0 ? 0 : active };
  }
  const children = node.children.map((child) => prune(child, keep));
  const remaining = children.filter((child) => child != null);
  if (remaining.length < 2) return remaining[0] ?? null;
  const split = { ...node, children: remaining };
  if (node.splitPercentages && remaining.length !== children.length) {
    split.splitPercentages = node.splitPercentages.filter((_, i) => children[i] != null);
    split.splitPercentages = percentages(split);
  }
  return split;
}

/** Persisted mosaic edits never mutate the tree supplied by the store. */
export default class MosaicLayout {
  constructor(layout) {
    this.layout = normalizeLayout(layout);
  }

  nodeAtPath(path) {
    return path.reduce((node, index) => node.children[index], this.layout);
  }

  pathToParent(path) {
    return this.nodeAtPath(path.slice(0, -1));
  }

  pathToCorner() {
    let node = this.layout;
    const path = [];
    while (node?.children) {
      const index = node.direction === 'row' ? node.children.length - 1 : 0;
      path.push(index);
      node = node.children[index];
    }
    return path;
  }

  addWindows(ids) {
    for (const id of ids) {
      if (this.layout == null) {
        this.layout = id;
        continue;
      }
      const path = this.pathToCorner();
      const direction = this.pathToParent(path)?.direction === 'row' ? 'column' : 'row';
      const neighbor = this.nodeAtPath(path);
      const children = direction === 'row' ? [neighbor, id] : [id, neighbor];
      this.layout = replaceAt(this.layout, path, { type: 'split', direction, children });
    }
  }

  removeWindows(ids) {
    const removed = new Set(ids);
    this.layout = prune(this.layout, new Set(leaves(this.layout).filter((id) => !removed.has(id))));
  }
}

function balanced(ids, direction = 'row') {
  if (ids.length < 2) return ids[0] ?? null;
  const middle = Math.ceil(ids.length / 2);
  const next = direction === 'row' ? 'column' : 'row';
  return { type: 'split', direction, children: [balanced(ids.slice(0, middle), next), balanced(ids.slice(middle), next)] };
}

export function reconcileLayout(layout, ids) {
  const model = new MosaicLayout(layout);
  if (model.layout == null) return balanced(ids);
  const existing = leaves(model.layout);
  model.removeWindows(existing.filter((id) => !ids.includes(id)));
  model.addWindows(ids.filter((id) => !existing.includes(id)));
  return model.layout;
}

/** Move a window beside a destination or against an outer workspace edge. */
export function dockWindow(layout, source, target, side) {
  if (source === target || !leaves(layout).includes(source)) return layout;
  const model = new MosaicLayout(layout);
  model.removeWindows([source]);
  if (model.layout == null) return layout;
  function insert(node) {
    if (target == null || node === target || node?.tabs?.includes(target)) {
      const first = side === 'left' || side === 'top';
      return {
        type: 'split',
        direction: ['left', 'right'].includes(side) ? 'row' : 'column',
        children: first ? [source, node] : [node, source],
      };
    }
    return node?.children ? { ...node, children: node.children.map(insert) } : node;
  }
  if (target != null && !leaves(model.layout).includes(target)) return layout;
  return insert(model.layout);
}

/** Flatten the split tree so moving a window preserves its mounted viewer. */
export function mosaicGeometry(layout) {
  const tiles = [];
  const dividers = [];
  const tabs = [];
  function visit(node, path, box) {
    if (node == null) return;
    if (typeof node !== 'object') {
      tiles.push({ id: node, ...box });
      return;
    }
    if (node.tabs) {
      tabs.push({ node, path, ...box });
      node.tabs.forEach((id, i) => tiles.push({ id, hidden: i !== node.activeTabIndex, tabbed: true, ...box }));
      return;
    }
    const horizontal = node.direction === 'row';
    const axis = horizontal ? 'x' : 'y';
    const dimension = horizontal ? 'width' : 'height';
    const sizes = percentages(node);
    let position = box[axis];
    node.children.forEach((child, index) => {
      const size = (sizes[index] * box[dimension]) / 100;
      visit(child, [...path, index], { ...box, [axis]: position, [dimension]: size });
      position += size;
      if (index < node.children.length - 1) dividers.push({ path, node, box, position, index, horizontal });
    });
  }
  visit(layout, [], { x: 0, y: 0, width: 100, height: 100 });
  return { tiles, dividers, tabs };
}

export function resizeDivider(layout, divider, deltaPercent) {
  const { node, index, path } = divider;
  const sizes = percentages(node);
  const pair = sizes[index] + sizes[index + 1];
  const minimum = Math.min(5, pair / 3);
  sizes[index] = Math.max(minimum, Math.min(pair - minimum, sizes[index] + deltaPercent));
  sizes[index + 1] = pair - sizes[index];
  return replaceAt(layout, path, { ...node, splitPercentages: sizes });
}

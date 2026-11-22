import { render, screen, fireEvent } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { Utils } from 'manifesto.js';

import ThumbnailNavigation from '@src/components/ThumbnailNavigation.svelte';
import CanvasGroupings from '@src/lib/CanvasGroupings';
import createStore from '@src/state/store';
import manifestJson from '../../fixtures/version-2/019.json';

const fixtureCanvases = (fixture = manifestJson, view = 'single') =>
  new CanvasGroupings(Utils.parseManifest(fixture).getSequences()[0].getCanvases(), view).groupings();
const manyGroupings = (count = 300) => {
  const canvas = fixtureCanvases()[0][0];
  return Array.from({ length: count }, (_, index) => {
    const item = Object.create(Object.getPrototypeOf(canvas));
    Object.assign(item, canvas);
    Object.defineProperty(item, 'id', { configurable: true, value: `canvas-${index}` });
    return [item];
  });
};

function createWrapper(props = {}) {
  const store = createStore();
  vi.spyOn(store, 'dispatch');
  return render(
    ThumbnailNavigation,
    {
      canvasGroupings: fixtureCanvases(),
      canvasIndex: 1,
      windowId: 'window',
      position: 'far-bottom',
      thumbnailNavigation: { width: 100, height: 150, columns: 2 },
      ...props,
    },
    { store },
  );
}

const grid = () => screen.getByRole('grid');
const cells = () => screen.getAllByRole('gridcell');

describe('ThumbnailNavigation', () => {
  it('renders the thumbnail navigation landmark and heading', () => {
    createWrapper({ position: 'far-left' });
    expect(screen.getByRole('navigation', { name: 'Thumbnails' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Contents' })).toBeInTheDocument();
  });
  it('renders a grid with a cell per grouping', () => {
    createWrapper();
    expect(grid()).toBeInTheDocument();
    expect(cells()).toHaveLength(3);
  });
  it('shows thumbnail labels through the connected grouping target', () => {
    createWrapper();
    expect(screen.getByText('Image 1')).toBeInTheDocument();
  });
  it('selects the grouping canvas when a thumbnail is clicked', async () => {
    const user = userEvent.setup();
    const wrapper = createWrapper();
    await user.click(screen.getAllByRole('button')[0]);
    expect(wrapper.store.dispatch).toHaveBeenCalled();
  });
  it('keeps the configured strip width for a vertical layout', () => {
    createWrapper({ position: 'far-right' });
    expect(screen.getByRole('navigation')).toHaveStyle({ width: '200px' });
  });
  it('doubles the configured strip width in book view', () => {
    createWrapper({ position: 'far-right', view: 'book' });
    expect(screen.getByRole('navigation')).toHaveStyle({ width: '400px' });
  });
  it('uses configured height for the horizontal layout', () => {
    createWrapper({ position: 'far-bottom' });
    expect(screen.getByRole('navigation')).toHaveStyle({ height: '150px' });
  });
  it('allocates configured multiple rows in a bottom strip', () => {
    createWrapper({ position: 'far-bottom', thumbnailColumns: 2 });
    expect(grid()).toHaveAttribute('aria-rowcount', '2');
  });
  it('supports more than two thumbnail columns in a side strip', () => {
    createWrapper({ position: 'far-right', thumbnailColumns: 3 });
    expect(grid()).toHaveAttribute('aria-colcount', '3');
  });
  it('marks the layout direction for right-to-left reading', () => {
    createWrapper({ viewingDirection: 'right-to-left' });
    expect(screen.getByRole('navigation')).toHaveAttribute('dir', 'rtl');
  });
  it('moves to the next canvas with the horizontal arrow key', () => {
    const setNextCanvas = vi.fn();
    createWrapper({ hasNextCanvas: true, setNextCanvas });
    fireEvent.keyDown(grid(), { key: 'ArrowRight' });
    expect(setNextCanvas).toHaveBeenCalledOnce();
  });
  it('moves to the previous canvas with the horizontal arrow key', () => {
    const setPreviousCanvas = vi.fn();
    createWrapper({ hasPreviousCanvas: true, setPreviousCanvas });
    fireEvent.keyDown(grid(), { key: 'ArrowLeft' });
    expect(setPreviousCanvas).toHaveBeenCalledOnce();
  });
  it('moves down the vertical strip with ArrowDown', () => {
    const setNextCanvas = vi.fn();
    createWrapper({ position: 'far-right', hasNextCanvas: true, setNextCanvas });
    fireEvent.keyDown(grid(), { key: 'ArrowDown' });
    expect(setNextCanvas).toHaveBeenCalledOnce();
  });
  it('moves up the vertical strip with ArrowUp', () => {
    const setPreviousCanvas = vi.fn();
    createWrapper({ position: 'far-left', hasPreviousCanvas: true, setPreviousCanvas });
    fireEvent.keyDown(grid(), { key: 'ArrowUp' });
    expect(setPreviousCanvas).toHaveBeenCalledOnce();
  });
  it('does not move past either canvas boundary', () => {
    const setNextCanvas = vi.fn();
    const setPreviousCanvas = vi.fn();
    createWrapper({ position: 'far-right', setNextCanvas, setPreviousCanvas });
    fireEvent.keyDown(grid(), { key: 'ArrowDown' });
    fireEvent.keyDown(grid(), { key: 'ArrowUp' });
    expect(setNextCanvas).not.toHaveBeenCalled();
    expect(setPreviousCanvas).not.toHaveBeenCalled();
  });
  it('scrolls the current grouping into view', () => {
    const scrollIntoView = vi.spyOn(HTMLElement.prototype, 'scrollIntoView').mockImplementation(() => {});
    createWrapper({ position: 'far-right', canvasIndex: 2 });
    expect(scrollIntoView).toHaveBeenCalled();
    scrollIntoView.mockRestore();
  });
  it('maps a current book-view canvas to its facing-page group', () => {
    const scrolledIndices = [];
    const scrollIntoView = vi.spyOn(HTMLElement.prototype, 'scrollIntoView').mockImplementation(function scroll() {
      scrolledIndices.push(this.dataset.canvasGroupIndex || this.parentElement?.dataset.canvasGroupIndex);
    });
    createWrapper({
      position: 'far-right',
      view: 'book',
      canvasIndex: 2,
      canvasGroupings: fixtureCanvases(manifestJson, 'book'),
    });
    expect(scrolledIndices).toContain('1');
    scrollIntoView.mockRestore();
  });
  it('virtualizes a long side navigation list', () => {
    createWrapper({ position: 'far-left', canvasGroupings: manyGroupings(), canvasIndex: 150 });
    expect(cells().length).toBeLessThan(300);
    expect(cells().length).toBeGreaterThan(0);
    expect(
      cells().find((cell) => cell.getAttribute('aria-rowindex') === '76' && cell.getAttribute('aria-colindex') === '1'),
    ).toBeInTheDocument();
  });
  it('keeps the current final grouping mounted in a long side list', () => {
    createWrapper({ position: 'far-left', canvasGroupings: manyGroupings(), canvasIndex: 299 });
    expect(cells().length).toBeLessThan(300);
    expect(
      cells().find((cell) => cell.getAttribute('aria-rowindex') === '150' && cell.getAttribute('aria-colindex') === '2'),
    ).toBeInTheDocument();
  });
  it('windows long bottom strips around the current grouping', () => {
    createWrapper({ position: 'far-bottom', canvasGroupings: manyGroupings(), canvasIndex: 299 });
    expect(cells().length).toBeLessThan(300);
    expect(
      cells().find((cell) => cell.getAttribute('aria-rowindex') === '2' && cell.getAttribute('aria-colindex') === '150'),
    ).toBeInTheDocument();
  });
  it('does not render when thumbnail navigation is off', () => {
    createWrapper({ position: 'off' });
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});

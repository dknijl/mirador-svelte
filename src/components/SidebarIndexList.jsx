import { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { useElementSize } from '@custom-react-hooks/use-element-size';
import { useDebounce } from 'use-debounce';
import { ScrollTo } from './ScrollTo';
import MiradorCanvas from '../lib/MiradorCanvas';
import SidebarIndexItem from '../containers/SidebarIndexItem';
import SidebarIndexThumbnail from '../containers/SidebarIndexThumbnail';

const THUMBNAIL_COLUMNS = 2;
const THUMBNAIL_GAP = 8;
const THUMBNAIL_PADDING = 8;

const StyledMenuList = styled(MenuList, { name: 'SidebarIndexList', slot: 'root' })(({ ownerState }) => ({
  ...(ownerState.variant === 'thumbnail' && {
    boxSizing: 'border-box',
    columnGap: THUMBNAIL_GAP,
    display: 'grid',
    gridTemplateColumns: `repeat(${THUMBNAIL_COLUMNS}, minmax(0, 1fr))`,
    padding: THUMBNAIL_PADDING,
    rowGap: THUMBNAIL_GAP,
  }),
}));

const StyledItem = styled(MenuItem, { name: 'SidebarIndexList', slot: 'item' })(({ ownerState, theme }) => ({
  alignItems: 'flex-start',
  gap: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(1),
  position: 'initial',
  whiteSpace: 'normal',
  ...(ownerState.variant === 'thumbnail' && {
    borderRadius: theme.shape.borderRadius,
    display: 'block',
    padding: 0,
    // The current canvas is marked with an outline as well as the tinted
    // background, so it is not signalled by color alone.
    '&.Mui-selected': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: 0,
    },
  }),
}));

/** */
function getIdAndLabelOfCanvases(canvases) {
  return canvases.map((canvas) => ({
    id: canvas.id,
    label: new MiradorCanvas(canvas).getLabel(),
  }));
}

/**
 * Resolve the reading direction the grid is laid out in. An explicit `dir`
 * attribute wins (that is what Mirador sets for right-to-left viewing
 * directions), otherwise fall back to the computed style and the document.
 */
function getLayoutDirection(element) {
  const ancestor = element.closest('[dir]');
  if (ancestor) return ancestor.getAttribute('dir') === 'rtl' ? 'rtl' : 'ltr';

  return window.getComputedStyle(element).direction === 'rtl' || document.dir === 'rtl' ? 'rtl' : 'ltr';
}

/** */
export function SidebarIndexList({ canvases, containerRef, selectedCanvasIds = [], setCanvas, variant = 'item', windowId }) {
  const canvasesIdAndLabel = useMemo(() => getIdAndLabelOfCanvases(canvases), [canvases]);
  const [gridRef, gridSize] = useElementSize();
  const listRef = useRef();

  // The grid keeps its tiles aligned, so the measured column width decides how
  // large a thumbnail to request instead of relying on a fixed size.
  const columnWidth = useMemo(() => {
    if (variant !== 'thumbnail' || !gridSize.width) return undefined;

    const available = gridSize.width - 2 * THUMBNAIL_PADDING - (THUMBNAIL_COLUMNS - 1) * THUMBNAIL_GAP;

    return Math.max(Math.floor(available / THUMBNAIL_COLUMNS), 0);
  }, [gridSize.width, variant]);

  // Resizing the panel changes the requested thumbnail size on every frame.
  // Only follow the settled width so dragging does not fire a burst of new URLs.
  const [thumbnailWidth] = useDebounce(columnWidth, 150);

  // MenuList only knows linear (vertical or horizontal) navigation, which would
  // move sideways on half of the ArrowDown presses in a two-column grid. Handle
  // the arrow keys here in the capture phase so focus moves by grid position,
  // and suppress the list's own handling of those keys.
  const handleGridKeyDown = (event) => {
    const list = listRef.current;
    if (!list) return;

    const items = [...list.querySelectorAll('[role="menuitem"]')];
    if (!items.length) return;

    const currentIndex = items.findIndex((item) => item === document.activeElement);
    if (currentIndex === -1) return;

    // In RTL the grid fills right to left, so the visual direction of travel is
    // mirrored: ArrowRight moves towards column 0.
    const towardRight = getLayoutDirection(list) === 'rtl' ? -1 : 1;
    const rowStart = currentIndex - (currentIndex % THUMBNAIL_COLUMNS);
    const rowEnd = Math.min(rowStart + THUMBNAIL_COLUMNS - 1, items.length - 1);
    const withinRow = (index) => index >= rowStart && index <= rowEnd;

    const moves = {
      ArrowDown: () => Math.min(currentIndex + THUMBNAIL_COLUMNS, items.length - 1),
      ArrowLeft: () => (withinRow(currentIndex - towardRight) ? currentIndex - towardRight : currentIndex),
      ArrowRight: () => (withinRow(currentIndex + towardRight) ? currentIndex + towardRight : currentIndex),
      ArrowUp: () => Math.max(currentIndex - THUMBNAIL_COLUMNS, 0),
      End: () => items.length - 1,
      Home: () => 0,
    };

    if (!(event.key in moves) || event.altKey || event.ctrlKey || event.metaKey) return;

    event.preventDefault();
    event.stopPropagation();
    items[moves[event.key]()].focus();
  };

  let Item;

  switch (variant) {
    case 'thumbnail':
      Item = SidebarIndexThumbnail;
      break;
    default:
      Item = SidebarIndexItem;
  }

  const list = (
    <StyledMenuList ref={gridRef} ownerState={{ variant }} variant="selectedMenu">
      {canvasesIdAndLabel.map((canvas, canvasIndex) => {
        const selected = selectedCanvasIds.includes(canvas.id);
        const onClick = () => {
          setCanvas(windowId, canvas.id);
        };

        return (
          <ScrollTo
            containerRef={containerRef}
            key={`${canvas.id}-${variant}`}
            offsetTop={96} // offset for the height of the form above
            selected={selected}
            scrollTo={selected}
          >
            <StyledItem
              key={canvas.id}
              aria-current={selected ? 'true' : undefined}
              divider={variant !== 'thumbnail'}
              onClick={onClick}
              component="li"
              ownerState={{ variant }}
              selected={selected}
            >
              <Item canvas={canvases[canvasIndex]} columnWidth={thumbnailWidth} index={canvasIndex} label={canvas.label} />
            </StyledItem>
          </ScrollTo>
        );
      })}
    </StyledMenuList>
  );

  if (variant !== 'thumbnail') return list;

  return (
    <div ref={listRef} onKeyDownCapture={handleGridKeyDown}>
      {list}
    </div>
  );
}

SidebarIndexList.propTypes = {
  canvases: PropTypes.array.isRequired,
  containerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.instanceOf(Element) })]).isRequired,
  selectedCanvasIds: PropTypes.arrayOf(PropTypes.string),
  setCanvas: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['item', 'thumbnail']),
  windowId: PropTypes.string.isRequired,
};

import { useElementSize } from '@custom-react-hooks/use-element-size';
import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { List, Grid } from 'react-window';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import ThumbnailCanvasGrouping from '../containers/ThumbnailCanvasGrouping';
import ns from '../config/css-ns';

const spacing = 12;
const scrollbarSize = 6;

/** Size the virtual grid along its scrolling axis. */
function getThumbnailLayout({ position, thumbnailNavigation, thumbnailColumns, measuredWidth, view, groupCount }) {
  const isBottom = position === 'far-bottom';
  const isSideBar = position === 'far-left' || position === 'far-right';
  const preferredWidth = thumbnailNavigation.width * (view === 'book' ? 2 : 1);
  const configuredColumns = Math.min(2, Math.max(1, thumbnailNavigation.columns || 1));
  const desiredColumns = thumbnailColumns ?? configuredColumns;
  const stripWidth = isSideBar ? preferredWidth * desiredColumns : '100%';
  const autoNarrow = isSideBar && !thumbnailColumns && measuredWidth > 0 && measuredWidth < stripWidth;
  const sideColumns = autoNarrow ? 1 : desiredColumns;
  const cellWidth = isSideBar && measuredWidth ? measuredWidth / sideColumns : preferredWidth;
  const bottomRows = thumbnailColumns ?? 1;
  const columns = isBottom ? Math.ceil(groupCount / bottomRows) : sideColumns;
  const rows = isBottom ? bottomRows : Math.ceil(groupCount / sideColumns);
  const bottomRowHeight = Math.max(1, Math.floor((thumbnailNavigation.height - spacing - scrollbarSize) / bottomRows));
  const isGrid = isBottom || sideColumns > 1;
  return { isBottom, isSideBar, stripWidth, sideColumns, cellWidth, bottomRows, columns, rows, bottomRowHeight, isGrid };
}

/**
 */
export function ThumbnailNavigation({
  canvasGroupings,
  canvasIndex,
  hasNextCanvas = false,
  hasPreviousCanvas = false,
  position,
  setNextCanvas = () => {},
  setPreviousCanvas = () => {},
  thumbnailColumns = null,
  thumbnailNavigation,
  view = undefined,
  viewingDirection = '',
  windowId,
}) {
  const { t } = useTranslation();
  const gridRef = useRef();
  const [measureRef, { width: measuredWidth }] = useElementSize();
  const { isBottom, isSideBar, stripWidth, sideColumns, cellWidth, bottomRows, columns, rows, bottomRowHeight, isGrid } =
    getThumbnailLayout({
      position,
      thumbnailNavigation,
      thumbnailColumns,
      measuredWidth,
      view,
      groupCount: canvasGroupings.length,
    });

  useEffect(() => {
    let index = canvasIndex;
    if (view === 'book') index = Math.ceil(index / 2);
    // Only scroll if the index is valid
    if (gridRef.current && index >= 0 && index < canvasGroupings.length) {
      if (isGrid) {
        // Both layouts are a grid now; only the row/column mapping differs.
        gridRef.current.scrollToCell({
          columnAlign: 'center',
          columnIndex: isBottom ? Math.floor(index / bottomRows) : index % sideColumns,
          rowAlign: 'center',
          rowIndex: isBottom ? index % bottomRows : Math.floor(index / sideColumns),
        });
      } else if (gridRef.current.scrollToRow) {
        // react-window List API in v2
        gridRef.current.scrollToRow({ index, align: 'center' });
      }
    }
  }, [canvasIndex, view, canvasGroupings.length, isBottom, isGrid, sideColumns, bottomRows, cellWidth]);

  /** */
  const handleKeyDown = (e) => {
    // A side strip stacks thumbnails downwards, so moving through them is
    // vertical; the bottom strip runs across, so it stays horizontal.
    let nextKey = 'ArrowRight';
    let previousKey = 'ArrowLeft';
    if (isSideBar) {
      nextKey = 'ArrowDown';
      previousKey = 'ArrowUp';
    }
    switch (e.key) {
      case nextKey:
        e.preventDefault();
        nextCanvas();
        break;
      case previousKey:
        e.preventDefault();
        previousCanvas();
        break;
      default:
        break;
    }
  };

  /**
   * A canvas's own width/height ratio, independent of any sibling in its
   * grouping. Matches MiradorCanvas#aspectRatio's own definition (these
   * canvases aren't MiradorCanvas-wrapped here) -- NaN for missing/zero
   * dimensions, so it poisons the sum below and falls through to
   * calculateScaledWidth/Height's own minimum-size guard, rather than
   * silently assuming a square canvas.
   */
  const canvasAspectRatio = (canvas) => canvas.getWidth() / canvas.getHeight();

  /**
   * When on bottom, column width.
   *
   * Computed as the sum of each canvas's own width when independently
   * scaled to the shared target height, matching how ThumbnailCanvasGrouping
   * actually renders facing-page groupings (each canvas as its own
   * IIIFThumbnail at that height, side by side) -- rather than from
   * CanvasWorld's combined bounds, which normalizes every canvas in the
   * grouping to their shared *minimum* height/width.
   */
  const calculateScaledWidth = (index) => {
    const canvases = canvasGroupings[index];
    if (!canvases) return thumbnailNavigation.width + spacing;

    const availableHeight = bottomRowHeight;
    const calc = Math.ceil(canvases.reduce((total, canvas) => total + availableHeight * canvasAspectRatio(canvas), 0));

    if (!Number.isInteger(calc)) return thumbnailNavigation.width + spacing;
    return calc + spacing;
  };

  /**
   * When on right, row height.
   *
   * The inverse of calculateScaledWidth: solves for the shared height at
   * which the sum of each canvas's independently-scaled width fills the
   * available (fixed) width
   */
  const calculateScaledHeight = (index) => {
    const canvases = canvasGroupings[index];
    if (!canvases) return thumbnailNavigation.height + spacing;

    // Each tile shares the panel width with its neighbours, so the available
    // width per cell shrinks as the column count grows.
    const availableWidth = cellWidth - spacing - scrollbarSize;
    const totalAspectRatio = canvases.reduce((total, canvas) => total + canvasAspectRatio(canvas), 0);
    const calc = Math.ceil((availableWidth * canvases.length) / totalAspectRatio);

    if (!Number.isInteger(calc)) return thumbnailNavigation.height + spacing;
    // Guard against incredibly small thumbnails
    return Math.max(calc, Math.round(thumbnailNavigation.height / 3)) + spacing;
  };

  /** */
  const gridColumnWidth = (column) => {
    const first = column * bottomRows;
    return bottomRows === 2 && first + 1 < canvasGroupings.length
      ? Math.max(calculateScaledWidth(first), calculateScaledWidth(first + 1))
      : calculateScaledWidth(first);
  };

  const gridRowHeight = (row) => {
    const first = row * sideColumns;
    const last = Math.min(first + sideColumns, canvasGroupings.length);
    let height = 0;
    for (let index = first; index < last; index += 1) {
      height = Math.max(height, calculateScaledHeight(index));
    }
    return height;
  };

  /**
   */
  const nextCanvas = () => {
    if (hasNextCanvas) setNextCanvas();
  };

  /**
   */
  const previousCanvas = () => {
    if (hasPreviousCanvas) setPreviousCanvas();
  };

  if (position === 'off') {
    return null;
  }
  const htmlDir = viewingDirection === 'right-to-left' ? 'rtl' : 'ltr';
  const itemData = {
    canvasGroupings,
    columnCount: columns,
    bottomRows,
    position,
    windowId,
  };

  return (
    <Paper
      className={classNames(ns('thumb-navigation'))}
      sx={{
        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 },
        ...(isSideBar && {
          display: 'flex',
          flexDirection: 'column',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#353535' : theme.palette.background.paper),
          '& > [role="grid"], & > [role="list"]': { flex: 1, minHeight: 0 },
          maxWidth: '30cqw',
          [`@container (max-width: ${Math.ceil(parseFloat(stripWidth) / 0.3)}px)`]: {
            maxWidth: thumbnailColumns ? '30cqw' : `min(30cqw, ${thumbnailNavigation.width}px)`,
          },
        }),
      }}
      aria-label={t('thumbnailNavigation')}
      square
      elevation={0}
      style={{ width: stripWidth }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={measureRef}
    >
      {isSideBar && (
        <Typography component="h3" variant="subtitle2" sx={{ px: 1.25, py: 0.5, textTransform: 'uppercase' }}>
          {t('contents')}
        </Typography>
      )}
      {canvasGroupings.length > 0 && isGrid && (
        <Grid
          columnCount={columns}
          columnWidth={position === 'far-bottom' ? gridColumnWidth : cellWidth}
          rowCount={rows}
          rowHeight={position === 'far-bottom' ? bottomRowHeight : gridRowHeight}
          style={{
            direction: htmlDir === 'rtl' ? 'rtl' : 'ltr',
            ...(position === 'far-bottom' && { height: thumbnailNavigation.height }),
          }}
          cellProps={itemData}
          gridRef={gridRef}
          cellComponent={ThumbnailCanvasGrouping}
        />
      )}
      {canvasGroupings.length > 0 && isSideBar && !isGrid && (
        <List
          defaultHeight={100}
          rowCount={canvasGroupings.length}
          rowHeight={calculateScaledHeight}
          style={{
            paddingBottom: spacing,
            direction: htmlDir === 'rtl' ? 'rtl' : 'ltr',
          }}
          rowProps={itemData}
          listRef={gridRef}
          rowComponent={ThumbnailCanvasGrouping}
        />
      )}
    </Paper>
  );
}

ThumbnailNavigation.propTypes = {
  canvasGroupings: PropTypes.array.isRequired,
  canvasIndex: PropTypes.number.isRequired,
  hasNextCanvas: PropTypes.bool,
  hasPreviousCanvas: PropTypes.bool,
  position: PropTypes.string.isRequired,
  setNextCanvas: PropTypes.func,
  setPreviousCanvas: PropTypes.func,
  thumbnailColumns: PropTypes.oneOf([1, 2]),
  thumbnailNavigation: PropTypes.object.isRequired,
  view: PropTypes.string,
  viewingDirection: PropTypes.string,
  windowId: PropTypes.string.isRequired,
};

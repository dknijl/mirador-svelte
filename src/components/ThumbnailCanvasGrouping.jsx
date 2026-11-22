import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';
import IIIFThumbnail from '../containers/IIIFThumbnail';
import ns from '../config/css-ns';

const StyledCanvas = styled('div')(({ theme }) => ({
  boxSizing: 'border-box',
  color: theme.palette.common.white,
  cursor: 'pointer',
  display: 'inline-block',
  whiteSpace: 'nowrap',
}));
/** */
export class ThumbnailCanvasGrouping extends PureComponent {
  /** */
  constructor(props) {
    super(props);
    this.setCanvas = this.setCanvas.bind(this);
  }

  /** */
  setCanvas(e) {
    const { setCanvas } = this.props;
    setCanvas(e.currentTarget.dataset.canvasId);
  }

  /**
   * Determines whether the current index is the rendered canvas, providing
   * a useful class.
   */
  currentCanvasClass(canvasIndices) {
    const { index } = this.props;
    if (canvasIndices.includes(index)) return 'current-canvas-grouping';
    return '';
  }

  /** */
  render() {
    const { index, columnCount, columnIndex, rowIndex, style, canvasGroupings, position, currentCanvasId, showThumbnailLabels } =
      this.props;
    // Grid passes row/column indices; List passes a single `index`.
    const { bottomRows } = this.props;
    const gridIndex =
      position === 'far-bottom'
        ? (columnIndex ?? 0) * bottomRows + (rowIndex ?? 0)
        : (rowIndex ?? 0) * (columnCount || canvasGroupings.length) + (columnIndex ?? 0);
    const itemIndex = index ?? gridIndex;
    const currentGroupings = canvasGroupings[itemIndex];

    if (!currentGroupings) return null;

    const SPACING = 12;

    const sideStrip = position === 'far-left' || position === 'far-right';
    const numbered = sideStrip;
    const isSelected = currentGroupings.map((canvas) => canvas.id).includes(currentCanvasId);

    return (
      <div
        style={{
          ...style,
          boxSizing: 'border-box',
          height: Number.isInteger(style.height) ? style.height - SPACING : null,
          left: Number.isInteger(style.left) ? style.left + SPACING / 2 : null,
          padding: SPACING / 2,
          top: Number.isInteger(style.top) ? style.top + SPACING / 2 : null,
          width: Number.isInteger(style.width) ? style.width - SPACING : null,
        }}
        className={ns('thumbnail-nav-container')}
        role="gridcell"
        aria-selected={isSelected}
        aria-colindex={(columnIndex ?? 0) + 1}
        aria-rowindex={(rowIndex ?? itemIndex) + 1}
      >
        <StyledCanvas
          role="button"
          data-canvas-id={currentGroupings[0].id}
          data-canvas-index={currentGroupings[0].index}
          onClick={this.setCanvas}
          tabIndex={-1}
          sx={(theme) => ({
            '&:not(:hover)': {
              outline: isSelected ? `2px solid ${theme.palette.primary.main}` : 0,
              ...(isSelected && {
                outlineOffset: '3px',
              }),
            },
            '&:hover': {
              outline: isSelected ? `2px solid ${theme.palette.primary.main}` : `2px solid ${theme.palette.action.hover}`,
              outlineOffset: isSelected ? '3px' : '-2px',
            },
            // The cell is inset by SPACING, so the canvas must fill the cell's
            // content box rather than repeat the outer cell width; otherwise it
            // spills out and makes the strip scroll sideways.
            ...(sideStrip && {
              display: 'flex',
              '& > div': { flex: '1 1 0', minWidth: 0 },
              '& img': { display: 'block', maxWidth: '100%', objectFit: 'contain' },
              '& span': { display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', color: 'text.primary' },
            }),
            ...(numbered && {
              '& > div': { display: 'flex', alignItems: 'flex-start', gap: '3px' },
              '& img': { flex: '1 1 auto', minWidth: 0, height: 'auto' },
              '& > div > span': { flex: '0 0 auto', lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' },
            }),
            height: position === 'far-right' || position === 'far-left' ? 'auto' : `${style.height}px`,
            width: position === 'far-right' || position === 'far-left' ? '100%' : 'auto',
          })}
          className={classNames(
            ns([
              'thumbnail-nav-canvas',
              `thumbnail-nav-canvas-${itemIndex}`,
              this.currentCanvasClass(currentGroupings.map((canvas) => canvas.index)),
            ]),
          )}
        >
          {currentGroupings.map((canvas) => (
            <IIIFThumbnail
              key={canvas.id}
              resource={canvas}
              label={numbered ? String(canvas.index + 1) : undefined}
              labelled={showThumbnailLabels}
              maxHeight={sideStrip ? Math.max(1, style.height - SPACING * 2) : style.height}
              variant={numbered ? 'numbered' : 'inside'}
            />
          ))}
        </StyledCanvas>
      </div>
    );
  }
}

ThumbnailCanvasGrouping.propTypes = {
  canvasGroupings: PropTypes.array.isRequired,
  bottomRows: PropTypes.number,
  columnCount: PropTypes.number,
  columnIndex: PropTypes.number,
  currentCanvasId: PropTypes.string.isRequired,
  index: PropTypes.number,
  position: PropTypes.string.isRequired,
  rowIndex: PropTypes.number,
  setCanvas: PropTypes.func.isRequired,
  showThumbnailLabels: PropTypes.bool.isRequired,
  style: PropTypes.object.isRequired,
};

ThumbnailCanvasGrouping.defaultProps = {
  bottomRows: 1,
  columnCount: undefined,
  columnIndex: undefined,
  index: undefined,
  rowIndex: undefined,
};

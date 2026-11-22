import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';
import IIIFThumbnail from '../containers/IIIFThumbnail';

// Keep every tile the same shape so rows line up even when the manifest mixes
// portrait, landscape, and panoramic canvases. The image is fitted inside the
// tile rather than cropped, so no part of a canvas is hidden.
const TILE_ASPECT_RATIO = '4 / 5';
// The position number sits in a narrow gutter outside the artwork, so it never
// covers part of the image.
const POSITION_WIDTH = 18;

const Root = styled('div', { name: 'SidebarIndexThumbnail', slot: 'root' })({
  aspectRatio: TILE_ASPECT_RATIO,
  display: 'flex',
});

const ThumbnailArea = styled('div', { name: 'SidebarIndexThumbnail', slot: 'thumbnail' })({
  alignItems: 'center',
  // The image is fitted inside its own box instead of being cropped, so a wide
  // or tall canvas keeps all of its content while the rows stay aligned.
  display: 'flex',
  flexGrow: 1,
  justifyContent: 'center',
  minWidth: 0,
  overflow: 'hidden',
});

// The position sits in its own narrow gutter, like a numbered list, so it never
// covers part of the artwork.
const Position = styled(Typography, { name: 'SidebarIndexThumbnail', slot: 'index' })(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.palette.text.secondary,
  flexShrink: 0,
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 1.5,
  minWidth: POSITION_WIDTH,
  paddingInlineEnd: theme.spacing(0.25),
  textAlign: 'end',
  whiteSpace: 'nowrap',
}));

/** */
export function SidebarIndexThumbnail({
  canvas,
  columnWidth = undefined,
  height = undefined,
  index = undefined,
  label,
  width = undefined,
}) {
  const position = index === undefined ? undefined : index + 1;
  const tileWidth = columnWidth || width;
  const maxWidth = columnWidth ? Math.max(columnWidth - POSITION_WIDTH, 0) : width;
  const maxHeight = columnWidth ? Math.round((columnWidth * 5) / 4) : height;

  return (
    <Root>
      <ThumbnailArea>
        <IIIFThumbnail
          label={label}
          resource={canvas}
          maxHeight={maxHeight}
          maxWidth={maxWidth}
          style={tileWidth ? { maxHeight: '100%', maxWidth: '100%' } : undefined}
        />
      </ThumbnailArea>
      {/* The position is drawn for scanning; it is hidden from assistive
          technology because the accessible name is the canvas label. */}
      {position !== undefined && (
        <Position aria-hidden="true" component="span">
          {position}
        </Position>
      )}
      <Typography component="span" style={visuallyHidden}>
        {label}
      </Typography>
    </Root>
  );
}

SidebarIndexThumbnail.propTypes = {
  canvas: PropTypes.object.isRequired,
  columnWidth: PropTypes.number,
  height: PropTypes.number,
  index: PropTypes.number,
  label: PropTypes.string.isRequired,
  width: PropTypes.number,
};

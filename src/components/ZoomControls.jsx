import { useContext } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircleOutlineSharp';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircleOutlineSharp';
import RotateRightIcon from '@mui/icons-material/RotateRightSharp';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import RestoreZoomIcon from './icons/RestoreZoomIcon';
import MiradorMenuButton from '../containers/MiradorMenuButton';
import OpenSeadragonViewerContext from '../contexts/OpenSeadragonViewerContext';

const StyledZoomControlsWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
});

/**
 */
export function ZoomControls({ windowId = '', updateViewport = () => {}, viewer = {}, zoomToWorld }) {
  const { t } = useTranslation();
  const osdViewer = useContext(OpenSeadragonViewerContext);
  // Read live zoom + min/max straight off the viewport rather than redux --
  // the redux-tracked viewer.zoom only updates after OSD's animation-finish
  // round-trip
  const { viewport } = osdViewer?.current || {};
  const {
    zoom: liveZoom,
    minZoom,
    maxZoom,
  } = viewport
    ? {
        maxZoom: viewport.getMaxZoom(),
        minZoom: viewport.getMinZoom(),
        zoom: viewport.zoomSpring.target.value,
      }
    : {};
  // Fall back to the redux-tracked zoom if the viewport isn't available yet.
  // viewer can be explicitly null (not just absent), which the default
  // parameter above doesn't catch.
  const currentZoom = liveZoom ?? viewer?.zoom;
  // Rotation comes from the same place and for the same reason: the live
  // viewport settles first, redux catches up later. viewer can be explicitly
  // null, hence the optional chain.
  const currentRotation = viewport?.getRotation?.() ?? viewer?.rotation ?? 0;

  /** */
  const handleZoomInClick = () => {
    const nextZoom = currentZoom * 2;
    updateViewport(windowId, {
      zoom: maxZoom == null ? nextZoom : Math.min(nextZoom, maxZoom),
    });
  };

  /** */
  const handleZoomOutClick = () => {
    const nextZoom = currentZoom / 2;
    updateViewport(windowId, {
      zoom: minZoom == null ? nextZoom : Math.max(nextZoom, minZoom),
    });
  };

  /** Rotate a quarter turn clockwise from wherever the viewer currently is. */
  const handleRotateClick = () => {
    const nextRotation = (((currentRotation + 90) % 360) + 360) % 360;
    updateViewport(windowId, { rotation: nextRotation });
  };

  return (
    <StyledZoomControlsWrapper>
      <MiradorMenuButton
        aria-label={t('zoomIn')}
        onClick={handleZoomInClick}
        disabled={maxZoom != null && currentZoom >= maxZoom}
      >
        <AddCircleIcon />
      </MiradorMenuButton>
      <MiradorMenuButton
        aria-label={t('zoomOut')}
        onClick={handleZoomOutClick}
        disabled={minZoom != null && currentZoom <= minZoom}
      >
        <RemoveCircleIcon />
      </MiradorMenuButton>
      <MiradorMenuButton aria-label={t('zoomReset')} onClick={() => zoomToWorld(false)}>
        <RestoreZoomIcon />
      </MiradorMenuButton>
      <MiradorMenuButton aria-label={t('rotate')} onClick={handleRotateClick}>
        <RotateRightIcon />
      </MiradorMenuButton>
    </StyledZoomControlsWrapper>
  );
}

ZoomControls.propTypes = {
  updateViewport: PropTypes.func,
  viewer: PropTypes.shape({
    rotation: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
    zoom: PropTypes.number,
  }),
  windowId: PropTypes.string,
  zoomToWorld: PropTypes.func.isRequired,
};

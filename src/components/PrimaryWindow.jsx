import { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';
import WindowTopBarTitle from '../containers/WindowTopBarTitle';
import CompanionArea from '../containers/CompanionArea';
import CollectionDialog from '../containers/CollectionDialog';
import ns from '../config/css-ns';

const AudioViewer = lazy(() => import('../containers/AudioViewer'));
const GalleryView = lazy(() => import('../containers/GalleryView'));
const SelectCollection = lazy(() => import('../containers/SelectCollection'));
const WindowViewer = lazy(() => import('../containers/WindowViewer'));
const VideoViewer = lazy(() => import('../containers/VideoViewer'));
const TextViewer = lazy(() => import('../containers/TextViewer'));

GalleryView.displayName = 'GalleryView';
SelectCollection.displayName = 'SelectCollection';
WindowViewer.displayName = 'WindowViewer';

const Root = styled('div', { name: 'PrimaryWindow', slot: 'root' })(() => ({
  containerType: 'inline-size',
  display: 'flex',
  flex: 1,
  position: 'relative',
}));

const ViewerLayer = styled('div', { name: 'PrimaryWindow', slot: 'viewer' })({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  minWidth: 0,
  position: 'relative',
});

const CanvasRow = styled('div')({
  display: 'flex',
  flex: 1,
  minHeight: 0,
  position: 'relative',
});

const CanvasLayer = styled('div')({
  minWidth: 0,
  display: 'flex',
  flex: 1,
  minHeight: 0,
  position: 'relative',
});

const TitleLayer = styled('div', { name: 'PrimaryWindow', slot: 'title' })(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  paddingInline: theme.spacing(1.5),
  textAlign: 'end',
}));

/**  */
const TypeSpecificViewer = ({
  audioResources = [],
  isCollection = false,
  isFetching = false,
  textResources = [],
  videoResources = [],
  view = undefined,
  windowId,
}) => {
  if (isCollection) {
    return <SelectCollection windowId={windowId} />;
  }
  if (isFetching === false) {
    if (view === 'gallery') {
      return <GalleryView windowId={windowId} />;
    }
    if (videoResources.length > 0) {
      return <VideoViewer windowId={windowId} />;
    }
    if (audioResources.length > 0) {
      return <AudioViewer windowId={windowId} />;
    }
    if (textResources.length > 0) {
      return <TextViewer windowId={windowId} />;
    }
    return <WindowViewer windowId={windowId} />;
  }
  return null;
};

TypeSpecificViewer.propTypes = {
  audioResources: PropTypes.arrayOf(PropTypes.object),
  isCollection: PropTypes.bool,
  isFetching: PropTypes.bool,
  textResources: PropTypes.arrayOf(PropTypes.object),
  videoResources: PropTypes.arrayOf(PropTypes.object),
  view: PropTypes.string,
  windowId: PropTypes.string.isRequired,
};

/**
 * PrimaryWindow - component that renders the primary content of a Mirador
 * window. Right now this differentiates between a Image, Video, or Audio viewer.
 */
export function PrimaryWindow({
  audioResources = undefined,
  children = null,
  className = undefined,
  isCollection = false,
  isCollectionDialogVisible = false,
  isFetching = false,
  textResources = undefined,
  videoResources = undefined,
  view = undefined,
  windowId,
}) {
  const viewerProps = {
    audioResources,
    isCollection,
    isFetching,
    textResources,
    videoResources,
    view,
    windowId,
  };

  return (
    <Root data-testid="test-window" className={classNames(ns('primary-window'), className)}>
      <CompanionArea windowId={windowId} position="far-left" />
      {isCollectionDialogVisible && <CollectionDialog windowId={windowId} />}
      <ViewerLayer>
        <TitleLayer>
          <WindowTopBarTitle windowId={windowId} />
        </TitleLayer>
        <CanvasRow>
          <CanvasLayer>
            <Suspense fallback={<div />}>{children || <TypeSpecificViewer {...viewerProps} />}</Suspense>
          </CanvasLayer>
          {/* "left" identifies the switchable sidebar in saved workspaces and plugins. */}
          <CompanionArea windowId={windowId} position="left" />
        </CanvasRow>
      </ViewerLayer>
    </Root>
  );
}

PrimaryWindow.propTypes = {
  audioResources: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.node,
  className: PropTypes.string,
  isCollection: PropTypes.bool,
  isCollectionDialogVisible: PropTypes.bool,
  isFetching: PropTypes.bool,
  textResources: PropTypes.arrayOf(PropTypes.object),
  videoResources: PropTypes.arrayOf(PropTypes.object),
  view: PropTypes.string,
  windowId: PropTypes.string.isRequired,
};

import { useContext, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { MosaicWindowContext } from 'react-mosaic-component';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { CanvasToolbarTarget, WorkspaceToolbarRef } from '../contexts/ToolbarContext';
import ns from '../config/css-ns';
import WindowTopBar from '../containers/WindowTopBar';
import WindowSideBar from '../containers/WindowSideBar';
import PrimaryWindow from '../containers/PrimaryWindow';
import CompanionArea from '../containers/CompanionArea';
import MinimalWindow from '../containers/MinimalWindow';
import ErrorContent from '../containers/ErrorContent';
import IIIFAuthentication from '../containers/IIIFAuthentication';
import { PluginHook } from './PluginHook';

const rowMixin = {
  display: 'flex',
  flex: '1',
  flexDirection: 'row',
  minHeight: 0,
};

const columnMixin = {
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  minHeight: 0,
};

const Root = styled(Paper, { name: 'Window', slot: 'root' })(({ ownerState, theme }) => ({
  ...columnMixin,
  backgroundColor: theme.palette.shades?.dark,
  borderRadius: 0,
  containerType: 'inline-size',
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
  ...(ownerState?.maximized && {
    left: 0,
    position: 'absolute',
    top: 0,
    zIndex: theme.zIndex.modal - 1,
  }),
}));

const ContentRow = styled('div', { name: 'Window', slot: 'row' })(() => ({
  ...rowMixin,
}));

const ContentColumn = styled('div', { name: 'Window', slot: 'column' })(() => ({
  ...columnMixin,
}));

const StyledPrimaryWindow = styled(PrimaryWindow, { name: 'Window', slot: 'primary' })(() => ({
  ...rowMixin,
  height: '300px',
  minWidth: 0,
  position: 'relative',
}));

const StyledCompanionAreaBottom = styled(CompanionArea, { name: 'Window', slot: 'bottom' })(() => ({
  ...rowMixin,
  flex: '0',
  flexBasis: 'auto',
}));

const StyledCompanionAreaRight = styled('div', { name: 'Window', slot: 'right' })(() => ({
  ...rowMixin,
  flex: '0 1 auto',
}));

const BottomBar = styled('div', { name: 'Window', slot: 'bottomBar' })(({ theme }) => ({
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'grid',
  gridTemplateColumns: 'minmax(max-content, 1fr) auto minmax(max-content, 1fr)',
  flex: '0 0 auto',
  minHeight: 36,
  overflowX: 'auto',
  scrollbarWidth: 'thin',
  whiteSpace: 'nowrap',
  '& > *': { flexShrink: 0 },
  '& .MuiIconButton-root, & .MuiTab-root': { height: 32, minHeight: 32, minWidth: 32, padding: 5 },
  '& .MuiSvgIcon-root': { fontSize: 20 },
}));

const ToolbarEnd = styled('div')({
  alignItems: 'center',
  display: 'flex',
  justifySelf: 'end',
  '& > div': { display: 'flex' },
});

/** Window title bar wrapper for drag controls in the mosaic view */
const DraggableNavBar = ({ children, ...props }) => {
  const { mosaicWindowActions } = useContext(MosaicWindowContext);
  return mosaicWindowActions.connectDragSource(<nav {...props}>{children}</nav>);
};

/**
 * Represents a Window in the mirador workspace
 * @param {object} window
 */
export function Window({
  hostsWorkspaceControls = false,
  focusWindow = () => {},
  label = null,
  isFetching = false,
  sideBarOpen = false,
  view = undefined,
  windowDraggable = null,
  windowId,
  workspaceType = null,
  manifestError = null,
}) {
  const { t } = useTranslation();
  const workspaceToolbarRef = useContext(WorkspaceToolbarRef);
  const [canvasTarget, setCanvasTarget] = useState(null);
  // eslint-disable-next-line prefer-rest-params
  const ownerState = arguments[0];
  const ErrorWindow = useCallback(
    ({ error }) => (
      <MinimalWindow windowId={windowId}>
        <ErrorContent error={error} windowId={windowId} />
      </MinimalWindow>
    ),
    [windowId],
  );

  return (
    <ErrorBoundary FallbackComponent={ErrorWindow}>
      <Root
        onFocus={focusWindow}
        ownerState={ownerState}
        component="section"
        elevation={1}
        id={windowId}
        className={ns('window')}
        aria-label={t('window', { label })}
      >
        <IIIFAuthentication windowId={windowId} />
        {manifestError && <ErrorContent error={{ stack: manifestError }} windowId={windowId} />}
        <CanvasToolbarTarget.Provider value={canvasTarget}>
          <ContentRow>
            <ContentColumn>
              <StyledPrimaryWindow view={view} windowId={windowId} isFetching={isFetching} sideBarOpen={sideBarOpen} />
              <StyledCompanionAreaBottom windowId={windowId} position="bottom" />
            </ContentColumn>
            <StyledCompanionAreaRight>
              <CompanionArea windowId={windowId} position="right" />
              <CompanionArea windowId={windowId} position="far-right" />
            </StyledCompanionAreaRight>
          </ContentRow>
          <CompanionArea windowId={windowId} position="far-bottom" />
        </CanvasToolbarTarget.Provider>
        <BottomBar className={ns('window-toolbar')}>
          <div ref={hostsWorkspaceControls ? workspaceToolbarRef?.primary : null} />
          <div ref={setCanvasTarget} />
          <ToolbarEnd>
            <WindowTopBar
              component={workspaceType === 'mosaic' && windowDraggable ? DraggableNavBar : undefined}
              windowId={windowId}
              windowDraggable={windowDraggable}
            />
            {hostsWorkspaceControls && workspaceToolbarRef && <div ref={workspaceToolbarRef.options} />}
            <WindowSideBar windowId={windowId} />
          </ToolbarEnd>
        </BottomBar>
        <PluginHook targetName="Window" {...ownerState} />
      </Root>
    </ErrorBoundary>
  );
}

Window.propTypes = {
  hostsWorkspaceControls: PropTypes.bool,
  focusWindow: PropTypes.func,
  isFetching: PropTypes.bool,
  label: PropTypes.string,
  manifestError: PropTypes.string,
  maximized: PropTypes.bool,
  sideBarOpen: PropTypes.bool,
  view: PropTypes.string,
  windowDraggable: PropTypes.bool,
  windowId: PropTypes.string.isRequired,
  workspaceType: PropTypes.string,
};

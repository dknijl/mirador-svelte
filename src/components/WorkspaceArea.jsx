import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { WorkspaceToolbarRef } from '../contexts/ToolbarContext';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import ErrorDialog from '../containers/ErrorDialog';
import WorkspaceControlPanel from '../containers/WorkspaceControlPanel';
import Workspace from '../containers/Workspace';
import WorkspaceAdd from '../containers/WorkspaceAdd';
import BackgroundPluginArea from '../containers/BackgroundPluginArea';
import ns from '../config/css-ns';

const Root = styled('div', { name: 'WorkspaceArea', slot: 'root' })(({ theme }) => ({
  background: theme.palette.shades?.dark ?? theme.palette.background.default,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  left: 0,
  overflow: 'hidden',
  position: 'absolute',
  right: 0,
  top: 0,
}));

const BottomBar = styled('div', { name: 'WorkspaceArea', slot: 'bottomBar' })(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexShrink: 0,
  overflowX: 'auto',
}));

const ViewerArea = styled('main', { name: 'WorkspaceArea', slot: 'viewer' })(() => ({
  flexGrow: 1,
  minHeight: 0,
  minWidth: 0,
  position: 'relative',
}));

/**
 * This is the top level Mirador component.
 * @prop {Object} manifests
 */
export function WorkspaceArea({
  areaRef = null,
  controlPanelVariant = undefined,
  isWorkspaceAddVisible = false,
  isWorkspaceControlPanelVisible,
  lang = undefined,
}) {
  const { t } = useTranslation();
  // eslint-disable-next-line prefer-rest-params
  const ownerState = arguments[0];

  const [toolbarTarget, setToolbarTarget] = useState(null);
  const [optionsTarget, setOptionsTarget] = useState(null);
  const toolbarRefs = useMemo(() => ({ primary: setToolbarTarget, options: setOptionsTarget }), []);
  const controls = <WorkspaceControlPanel variant={controlPanelVariant} optionsTarget={optionsTarget} />;

  return (
    <Root ownerState={ownerState}>
      <ViewerArea className={ns('viewer')} lang={lang} aria-label={t('workspace')} {...(areaRef ? { ref: areaRef } : {})}>
        <WorkspaceToolbarRef.Provider value={isWorkspaceControlPanelVisible ? toolbarRefs : null}>
          {isWorkspaceAddVisible ? <WorkspaceAdd /> : <Workspace />}
        </WorkspaceToolbarRef.Provider>
        <ErrorDialog />
        <BackgroundPluginArea />
      </ViewerArea>
      {isWorkspaceControlPanelVisible &&
        (toolbarTarget ? createPortal(controls, toolbarTarget) : <BottomBar>{controls}</BottomBar>)}
    </Root>
  );
}

WorkspaceArea.propTypes = {
  areaRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  controlPanelVariant: PropTypes.string,
  isWorkspaceAddVisible: PropTypes.bool,
  isWorkspaceControlPanelVisible: PropTypes.bool.isRequired,
  lang: PropTypes.string,
};

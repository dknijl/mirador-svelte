import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/MenuSharp';
import CloseIcon from '@mui/icons-material/CloseSharp';
import Toolbar from '@mui/material/Toolbar';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import WindowTopMenuButton from '../containers/WindowTopMenuButton';
import WindowTopBarPluginArea from '../containers/WindowTopBarPluginArea';
import WindowTopBarPluginMenu from '../containers/WindowTopBarPluginMenu';
import MiradorMenuButton from '../containers/MiradorMenuButton';
import FullScreenButton from '../containers/FullScreenButton';
import WindowMaxIcon from './icons/WindowMaxIcon';
import WindowMinIcon from './icons/WindowMinIcon';
import ns from '../config/css-ns';

// The window's own actions sit in a bar along the bottom edge, next to the
// workspace ones, so nothing covers the artwork at the top of the window.
const Root = styled('nav', { name: 'WindowTopBar', slot: 'root' })(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  flexShrink: 0,
  zIndex: 1100,
}));

const StyledToolbar = styled(Toolbar, { name: 'WindowTopBar', slot: 'toolbar' })(({ ownerState, theme }) => ({
  backgroundColor: 'transparent',
  justifyContent: 'flex-end',
  minHeight: 32,
  paddingLeft: theme.spacing(0.5),
  paddingRight: theme.spacing(1),
  ...(ownerState?.windowDraggable && {
    cursor: 'move',
  }),
}));

/**
 * WindowTopBar
 */
export function WindowTopBar({
  removeWindow,
  windowId,
  toggleWindowSideBar,
  maximizeWindow = () => {},
  maximized = false,
  minimizeWindow = () => {},
  allowClose = true,
  allowMaximize = true,
  focusWindow = () => {},
  allowFullscreen = false,
  allowTopMenuButton = true,
  allowWindowSideBar = true,
  sideBarOpen = false,
  component = 'nav',
}) {
  const { t } = useTranslation();
  // eslint-disable-next-line prefer-rest-params
  const ownerState = arguments[0];

  return (
    <Root as={component} aria-label={t('windowNavigation')}>
      <StyledToolbar
        disableGutters
        onMouseDown={focusWindow}
        ownerState={ownerState}
        className={classNames(ns('window-top-bar'))}
        variant="dense"
      >
        {allowWindowSideBar && (
          <MiradorMenuButton
            aria-expanded={sideBarOpen}
            aria-haspopup
            aria-label={sideBarOpen ? t('hideWindowSideBar') : t('showWindowSideBar')}
            onClick={toggleWindowSideBar}
            className={ns('window-menu-btn')}
          >
            <MenuIcon />
          </MiradorMenuButton>
        )}
        {allowTopMenuButton && <WindowTopMenuButton windowId={windowId} className={ns('window-menu-btn')} />}
        <WindowTopBarPluginArea windowId={windowId} />
        <WindowTopBarPluginMenu windowId={windowId} />
        {allowMaximize && (
          <MiradorMenuButton
            aria-label={maximized ? t('minimizeWindow') : t('maximizeWindow')}
            className={classNames(ns('window-maximize'), ns('window-menu-btn'))}
            onClick={maximized ? minimizeWindow : maximizeWindow}
          >
            {maximized ? <WindowMinIcon /> : <WindowMaxIcon />}
          </MiradorMenuButton>
        )}
        {allowFullscreen && <FullScreenButton className={ns('window-menu-btn')} />}
        {allowClose && (
          <MiradorMenuButton
            aria-label={t('closeWindow')}
            className={classNames(ns('window-close'), ns('window-menu-btn'))}
            onClick={removeWindow}
          >
            <CloseIcon />
          </MiradorMenuButton>
        )}
      </StyledToolbar>
    </Root>
  );
}

WindowTopBar.propTypes = {
  allowClose: PropTypes.bool,
  allowFullscreen: PropTypes.bool,
  allowMaximize: PropTypes.bool,
  allowTopMenuButton: PropTypes.bool,
  allowWindowSideBar: PropTypes.bool,
  component: PropTypes.elementType,
  // eslint-disable-next-line react/no-unused-prop-types
  focused: PropTypes.bool,
  focusWindow: PropTypes.func,
  maximized: PropTypes.bool,
  maximizeWindow: PropTypes.func,
  minimizeWindow: PropTypes.func,
  sideBarOpen: PropTypes.bool,
  removeWindow: PropTypes.func.isRequired,
  toggleWindowSideBar: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  windowDraggable: PropTypes.bool,
  windowId: PropTypes.string.isRequired,
};

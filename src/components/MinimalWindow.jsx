import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/MenuSharp';
import cn from 'classnames';
import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/CloseSharp';
import { useTranslation } from 'react-i18next';
import MiradorMenuButton from '../containers/MiradorMenuButton';
import ns from '../config/css-ns';

const StyledMiradorMenuButton = styled(MiradorMenuButton)(() => ({
  marginLeft: 'auto',
}));

/** */
export function MinimalWindow({
  allowClose = true,
  allowWindowSideBar = true,
  ariaLabel = true,
  children = null,
  label = '',
  removeWindow = () => {},
  windowId,
}) {
  const { t } = useTranslation();
  return (
    <Paper
      component="section"
      elevation={1}
      id={windowId}
      className={cn(ns('placeholder-window'))}
      sx={{
        backgroundColor: 'shades.dark',
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
        width: '100%',
      }}
      aria-label={label && ariaLabel ? t('window', { label }) : null}
    >
      {children}
      {/* Same placement as a loaded window: its actions sit under the content. */}
      <AppBar position="relative" color="default" enableColorOnDark>
        <Toolbar
          disableGutters
          className={cn(ns('window-top-bar'))}
          sx={{
            backgroundColor: 'shades.main',
            justifyContent: 'flex-end',
            minHeight: 48,
            paddingLeft: 0.5,
            paddingRight: 1,
          }}
          variant="dense"
        >
          <Typography
            variant="h2"
            noWrap
            sx={{
              color: 'inherit',
              flexGrow: 1,
              paddingLeft: 1.5,
              typography: 'h6',
            }}
          >
            {label}
          </Typography>
          {allowWindowSideBar && (
            <MiradorMenuButton aria-label={t('toggleWindowSideBar')} disabled>
              <MenuIcon />
            </MiradorMenuButton>
          )}
          {allowClose && removeWindow && (
            <StyledMiradorMenuButton
              aria-label={t('closeWindow')}
              className={cn(ns('window-close'))}
              onClick={removeWindow}
              TooltipProps={{
                tabIndex: ariaLabel ? 0 : -1,
              }}
            >
              <CloseIcon />
            </StyledMiradorMenuButton>
          )}
        </Toolbar>
      </AppBar>
    </Paper>
  );
}

MinimalWindow.propTypes = {
  allowClose: PropTypes.bool,
  allowWindowSideBar: PropTypes.bool,
  ariaLabel: PropTypes.bool,
  children: PropTypes.node,
  label: PropTypes.string,
  removeWindow: PropTypes.func,
  windowId: PropTypes.string.isRequired,
};

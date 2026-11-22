import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import WindowSideBarButtons from '../containers/WindowSideBarButtons';

// The panel menu used to be a full-height rail on the left edge of the window,
// where it competed with the thumbnail strip for the same edge. It now sits in
// the bottom bar with the other window actions, so it is a plain row of tabs
// rather than a drawer: the tab list already gives it its own structure.
const Root = styled('div', { name: 'WindowSideBar', slot: 'root' })(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  minHeight: 32,
  minWidth: 'max-content',
  paddingInlineStart: theme.spacing(0.5),
}));

/**
 * WindowSideBar ~ the row of panel menus for a window.
 */
export function WindowSideBar({ windowId }) {
  return (
    <Root>
      <WindowSideBarButtons windowId={windowId} />
    </Root>
  );
}

WindowSideBar.propTypes = {
  windowId: PropTypes.string.isRequired,
};

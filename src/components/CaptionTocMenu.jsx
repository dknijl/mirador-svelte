import PropTypes from 'prop-types';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TocIcon from '@mui/icons-material/SortSharp';
import { useTranslation } from 'react-i18next';

/**
 * Menu section that opens the caption table-of-contents panel on the right side
 * of the window.
 *
 * Mirrors the other sections of the window top menu: a presentation-only
 * subheader plus a `menubar` list. The surrounding popover already owns the
 * `menu` role.
 */
export function CaptionTocMenu({ handleClose = () => {}, openCaptionToc, windowId }) {
  const { t } = useTranslation();

  return (
    <>
      <ListSubheader role="presentation" disableSticky>
        {t('tableOfContentsList')}
      </ListSubheader>
      <MenuList role="menubar">
        <MenuItem
          role="menuitem"
          onClick={() => {
            openCaptionToc(windowId);
            handleClose();
          }}
        >
          <TocIcon sx={{ marginInlineEnd: 1 }} />
          {t('openCaptionToc')}
        </MenuItem>
      </MenuList>
    </>
  );
}

CaptionTocMenu.propTypes = {
  handleClose: PropTypes.func,
  openCaptionToc: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};

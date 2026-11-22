import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ThumbnailsOffIcon from '@mui/icons-material/CropDinSharp';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ThumbnailNavigationBottomIcon from './icons/ThumbnailNavigationBottomIcon';
import ThumbnailNavigationLeftIcon from './icons/ThumbnailNavigationLeftIcon';
import ThumbnailNavigationRightIcon from './icons/ThumbnailNavigationRightIcon';

const ThumbnailOption = styled(MenuItem, { name: 'WindowThumbnailSettings', slot: 'option' })(({ selected, theme }) => ({
  '& .MuiFormControlLabel-label': {
    borderBottom: '2px solid transparent',
    ...(selected && {
      borderBottomColor: theme.palette.secondary.main,
    }),
    '&.Mui-selected': {
      backgroundColor: 'transparent !important',
    },
    '&.Mui-selected.Mui-focusVisible': {
      backgroundColor: `${(theme.vars || theme).palette.action.focus} !important`,
    },
    '&:focused': {
      backgroundColor: `${(theme.vars || theme).palette.action.focus} !important`,
    },
    color: selected ? theme.palette.secondary.main : undefined,
    display: 'inline-flex',
  },
}));

const StyledMenuList = styled(MenuList, { name: 'WindowViewSettings', slot: 'option' })(() => ({
  display: 'inline-flex',
}));
/**
 *
 */
export function WindowThumbnailSettings({
  handleClose = () => {},
  thumbnailNavigationPosition,
  thumbnailColumns = null,
  updateWindow = () => {},
  direction,
  windowId,
  setWindowThumbnailPosition,
}) {
  const { t } = useTranslation();
  /** */
  const handleChange = (value) => {
    setWindowThumbnailPosition(windowId, value);
    handleClose();
  };

  return (
    <>
      <ListSubheader role="presentation" disableSticky>
        {t('thumbnails')}
      </ListSubheader>
      <StyledMenuList role="menubar">
        <ThumbnailOption
          aria-checked={thumbnailNavigationPosition === 'off'}
          key="off"
          onClick={() => {
            handleChange('off');
          }}
          role="menuitemradio"
          selected={thumbnailNavigationPosition === 'off'}
        >
          <FormControlLabel
            control={
              <ThumbnailsOffIcon color={thumbnailNavigationPosition === 'off' ? 'secondary' : undefined} fill="currentcolor" />
            }
            label={t('off')}
            labelPlacement="bottom"
            value="off"
          />
        </ThumbnailOption>
        <ThumbnailOption
          aria-checked={thumbnailNavigationPosition === 'far-bottom'}
          key="far-bottom"
          onClick={() => {
            handleChange('far-bottom');
          }}
          role="menuitemradio"
          selected={thumbnailNavigationPosition === 'far-bottom'}
        >
          <FormControlLabel
            control={
              <ThumbnailNavigationBottomIcon
                color={thumbnailNavigationPosition === 'far-bottom' ? 'secondary' : undefined}
                fill="currentcolor"
              />
            }
            label={t('bottom')}
            labelPlacement="bottom"
            value="far-bottom"
          />
        </ThumbnailOption>
        <ThumbnailOption
          aria-checked={thumbnailNavigationPosition === 'far-left'}
          key="far-left"
          onClick={() => {
            handleChange('far-left');
          }}
          role="menuitemradio"
          selected={thumbnailNavigationPosition === 'far-left'}
        >
          <FormControlLabel
            control={
              <ThumbnailNavigationLeftIcon
                color={thumbnailNavigationPosition === 'far-left' ? 'secondary' : undefined}
                fill="currentcolor"
                style={direction === 'rtl' ? { transform: 'rotate(180deg)' } : {}}
              />
            }
            label={t('left')}
            labelPlacement="bottom"
            value="far-left"
          />
        </ThumbnailOption>
        <ThumbnailOption
          aria-checked={thumbnailNavigationPosition === 'far-right'}
          key="far-right"
          onClick={() => {
            handleChange('far-right');
          }}
          role="menuitemradio"
          selected={thumbnailNavigationPosition === 'far-right'}
        >
          <FormControlLabel
            control={
              <ThumbnailNavigationRightIcon
                color={thumbnailNavigationPosition === 'far-right' ? 'secondary' : undefined}
                fill="currentcolor"
                style={direction === 'rtl' ? { transform: 'rotate(180deg)' } : {}}
              />
            }
            label={t('right')}
            labelPlacement="bottom"
            value="far-right"
          />
        </ThumbnailOption>
      </StyledMenuList>
      {thumbnailNavigationPosition !== 'off' && (
        <StyledMenuList role="menubar" aria-label={t('thumbnailLayout')} sx={{ display: 'flex' }}>
          {[null, 1, 2].map((count) => (
            <MenuItem
              key={count ?? 'auto'}
              role="menuitemradio"
              selected={count === thumbnailColumns}
              aria-checked={count === thumbnailColumns}
              onClick={() => {
                updateWindow(windowId, { thumbnailColumns: count });
                handleClose();
              }}
            >
              {count === null
                ? t('thumbnailAuto')
                : t(thumbnailNavigationPosition === 'far-bottom' ? 'thumbnailRows' : 'thumbnailColumns', { count })}
            </MenuItem>
          ))}
        </StyledMenuList>
      )}
    </>
  );
}

WindowThumbnailSettings.propTypes = {
  thumbnailColumns: PropTypes.oneOf([1, 2]),
  updateWindow: PropTypes.func,
  direction: PropTypes.string.isRequired,
  handleClose: PropTypes.func,
  setWindowThumbnailPosition: PropTypes.func.isRequired,
  thumbnailNavigationPosition: PropTypes.string.isRequired,
  windowId: PropTypes.string.isRequired,
};

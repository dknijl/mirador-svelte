import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Slide from '@mui/material/Slide';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeftSharp';
import ArrowRightIcon from '@mui/icons-material/ArrowRightSharp';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import CompanionWindowFactory from '../containers/CompanionWindowFactory';
import MiradorMenuButton from '../containers/MiradorMenuButton';
import ns from '../config/css-ns';

const Root = styled('div', { name: 'CompanionArea', slot: 'root' })(({ ownerState, theme }) => ({
  display: 'flex',
  minHeight: 0,
  position: 'relative',
  zIndex: theme.zIndex.appBar - 2,
  ...(ownerState.position === 'left' && {
    '@container (max-width: 600px)': {
      insetBlock: 0,
      insetInlineEnd: 0,
      position: 'absolute',
      zIndex: theme.zIndex.drawer + 1,
    },
  }),
  ...((ownerState.position === 'bottom' || ownerState.position === 'far-bottom') && {
    flexDirection: 'column',
    width: '100%',
  }),
}));

const Container = styled('div', { name: 'CompanionArea', slot: 'container' })(({ ownerState }) => ({
  display: ownerState?.companionAreaOpen ? 'flex' : 'none',
  ...((ownerState?.position === 'bottom' || ownerState?.position === 'far-bottom') && {
    flexDirection: 'column',
    width: '100%',
  }),
  // The sidebar pane holds companion windows of the default sidebar
  // width; the far-left strip sizes itself from the thumbnail configuration
  // (thumbnailNavigation.width), so forcing 235px there would leave a gutter.
  ...(ownerState?.position === 'left' &&
    ownerState?.companionWindowIds &&
    ownerState.companionWindowIds.length > 0 && {
      minWidth: '235px',
    }),
}));

const StyledToggle = styled('div', { name: 'CompanionArea', slot: 'toggle' })(({ theme }) => ({
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.shades?.dark}`,
  ...theme.applyStyles('dark', { borderColor: theme.palette.divider }),
  borderInlineEnd: 0,
  borderRadius: 0,
  display: 'inline-flex',
  height: '48px',
  insetInlineEnd: '100%',
  marginTop: '1rem',
  overflow: 'hidden',
  padding: 2,
  position: 'absolute',
  width: '23px',
  zIndex: theme.zIndex.drawer,
}));

/** */
export function CompanionArea({
  classes = {},
  className = undefined,
  direction,
  companionWindowIds,
  companionAreaOpen,
  setCompanionAreaOpen = () => {},
  position,
  sideBarOpen = false,
  windowId,
}) {
  const { t } = useTranslation();
  /** */
  const areaLayoutClass = position === 'bottom' || position === 'far-bottom' ? classes.horizontal : null;

  /** */
  const pointsRight = companionAreaOpen === (direction !== 'rtl');
  const collapseIcon = pointsRight ? <ArrowRightIcon /> : <ArrowLeftIcon />;

  /** */
  const slideDirection = (() => {
    const defaultPosition = direction === 'rtl' ? 'left' : 'right';
    const oppositePosition = direction === 'rtl' ? 'right' : 'left';

    switch (position) {
      case 'left':
      case 'right':
      case 'far-right':
        return oppositePosition;
      case 'far-left':
        return defaultPosition;
      case 'bottom':
      case 'far-bottom':
        return 'up';
      default:
        return defaultPosition;
    }
  })();

  const rootClasses = classNames(areaLayoutClass, ns(`companion-area-${position}`), className);
  // eslint-disable-next-line prefer-rest-params
  const ownerState = arguments[0];

  return (
    <Root ownerState={ownerState} className={rootClasses}>
      <Slide in={companionAreaOpen} direction={slideDirection}>
        <Container ownerState={ownerState} className={`${ns('companion-windows')}`}>
          {companionWindowIds.map((id) => (
            <CompanionWindowFactory id={id} key={id} windowId={windowId} />
          ))}
        </Container>
      </Slide>
      {setCompanionAreaOpen && position === 'left' && sideBarOpen && companionWindowIds.length > 0 && (
        <StyledToggle>
          <MiradorMenuButton
            aria-expanded={companionAreaOpen}
            aria-label={companionAreaOpen ? t('collapseSidePanel') : t('expandSidePanel')}
            edge="end"
            onClick={() => {
              setCompanionAreaOpen(windowId, !companionAreaOpen);
            }}
            TooltipProps={{ placement: direction === 'rtl' ? 'right' : 'left' }}
          >
            {collapseIcon}
          </MiradorMenuButton>
        </StyledToggle>
      )}
    </Root>
  );
}

CompanionArea.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string),
  className: PropTypes.string,
  companionAreaOpen: PropTypes.bool.isRequired,
  companionWindowIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  direction: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  setCompanionAreaOpen: PropTypes.func,
  sideBarOpen: PropTypes.bool,
  windowId: PropTypes.string.isRequired,
};

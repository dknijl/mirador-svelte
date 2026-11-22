import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/InfoSharp';
import AnnotationIcon from '@mui/icons-material/CommentSharp';
import AttributionIcon from '@mui/icons-material/CopyrightSharp';
import LayersIcon from '@mui/icons-material/LayersSharp';
import SearchIcon from '@mui/icons-material/SearchSharp';
import { useTranslation } from 'react-i18next';
import CanvasIndexIcon from './icons/CanvasIndexIcon';
import { usePlugins } from '../extend/usePlugins';

const Root = styled(Tabs, { name: 'WindowSideBarButtons', slot: 'root' })({
  '& .MuiTabs-flexContainer': {
    flexDirection: 'row',
  },
  '&.MuiTabs-indicator': {
    display: 'none',
  },
  minHeight: 32,
});
const StyledTabButton = styled(Tab, { name: 'WindowSideBarButtons', slot: 'button' })(({ theme }) => ({
  '&.Mui-selected': {
    borderBottom: '2px solid',
    borderBottomColor: theme.palette.primary.main,
  },
  '&.MuiTab-root': {
    '&:active': {
      backgroundColor: theme.palette.action.active,
    },
    '&:focus': {
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
      backgroundColor: theme.palette.action.hover,
      textDecoration: 'none',
      // Reset on touch devices, it doesn't add specificity
    },
    '&:hover': {
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
      backgroundColor: theme.palette.action.hover,
      textDecoration: 'none',
      // Reset on touch devices, it doesn't add specificity
    },
    borderBottom: '2px solid transparent',
    minHeight: 32,
    minWidth: 'auto',
  },
  fill: 'currentcolor',
}));

/** */
function TabButton({ closeSideBar = () => {}, sideBarPanel = 'closed', value, ...tabProps }) {
  const { t } = useTranslation();
  return (
    <Tooltip title={t('openCompanionWindow', { context: value })}>
      <StyledTabButton
        {...tabProps}
        value={value}
        aria-label={t('openCompanionWindow', { context: value })}
        // MUI only fires onChange for a different tab.
        onClick={() => {
          if (sideBarPanel === value) closeSideBar();
        }}
        disableRipple
      />
    </Tooltip>
  );
}

TabButton.propTypes = {
  closeSideBar: PropTypes.func,
  sideBarPanel: PropTypes.string,
  value: PropTypes.string.isRequired,
};

/**
 *
 */
export function WindowSideBarButtons({
  addCompanionWindow,
  hasAnnotations = false,
  hasAnyAnnotations = false,
  hasAnyLayers = false,
  hasCurrentLayers = false,
  hasSearchResults = false,
  hasSearchService = false,
  closeSideBar = () => {},
  panels = [],
  sideBarPanel = 'closed',
}) {
  const { PluginComponents } = usePlugins('WindowSideBarButtons');
  /** */
  const handleChange = (event, value) => {
    addCompanionWindow(value);
  };
  const tabButton = (value, icon) => (
    <TabButton key={value} value={value} icon={icon} closeSideBar={closeSideBar} sideBarPanel={sideBarPanel} />
  );

  return (
    <Root
      value={sideBarPanel === 'closed' ? false : sideBarPanel}
      onChange={handleChange}
      variant="standard"
      indicatorColor="primary"
      textColor="primary"
      orientation="horizontal"
    >
      {panels.info && tabButton('info', <InfoIcon />)}
      {panels.attribution && tabButton('attribution', <AttributionIcon />)}
      {panels.canvas && tabButton('canvas', <CanvasIndexIcon />)}
      {panels.annotations &&
        (hasAnnotations || hasAnyAnnotations) &&
        tabButton(
          'annotations',
          <Badge overlap="rectangular" color="notification" invisible={!hasAnnotations} variant="dot">
            <AnnotationIcon />
          </Badge>,
        )}
      {panels.search &&
        hasSearchService &&
        tabButton(
          'search',
          <Badge overlap="rectangular" color="notification" invisible={!hasSearchResults} variant="dot">
            <SearchIcon />
          </Badge>,
        )}
      {panels.layers &&
        hasAnyLayers &&
        tabButton(
          'layers',
          <Badge overlap="rectangular" color="notification" invisible={!hasCurrentLayers} variant="dot">
            <LayersIcon />
          </Badge>,
        )}
      {PluginComponents && PluginComponents.map((PluginComponent) => tabButton(PluginComponent.value, <PluginComponent />))}
    </Root>
  );
}

WindowSideBarButtons.propTypes = {
  addCompanionWindow: PropTypes.func.isRequired,
  hasAnnotations: PropTypes.bool,
  hasAnyAnnotations: PropTypes.bool,
  hasAnyLayers: PropTypes.bool,
  hasCurrentLayers: PropTypes.bool,
  hasSearchResults: PropTypes.bool,
  hasSearchService: PropTypes.bool,
  closeSideBar: PropTypes.func,
  panels: PropTypes.objectOf(PropTypes.bool),
  sideBarPanel: PropTypes.string,
};

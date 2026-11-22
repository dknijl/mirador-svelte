import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import WorkspaceAddButton from '../containers/WorkspaceAddButton';
import WorkspaceControlPanelButtons from '../containers/WorkspaceControlPanelButtons';
import ns from '../config/css-ns';

const Root = styled('nav', { name: 'WorkspaceControlPanel', slot: 'root' })(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  gap: 2,
  paddingInline: theme.spacing(0.5),
  '& .MuiIconButton-root, & .MuiFab-root': { height: 32, margin: 0, minHeight: 32, minWidth: 32, padding: 5 },
  '& .MuiFab-circular': { width: 32 },
  '& .MuiSvgIcon-root': { fontSize: 20 },
}));

const ActionGroup = styled('div', { name: 'WorkspaceControlPanel', slot: 'actions' })(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(0.5),
}));

// The branding link was pinned to the bottom of the old rail; it stays in the
// chrome so the viewer's provenance is still one click away.
const BrandingLink = styled(IconButton, { name: 'WorkspaceControlPanel', slot: 'branding' })(() => ({
  fontSize: 22,
  fontWeight: 700,
  lineHeight: 1,
}));

/**
 * Provides the panel responsible for controlling the entire workspace
 */
export function WorkspaceControlPanel({ variant = 'default', optionsTarget = null, ...rest }) {
  const { t } = useTranslation();
  return (
    <Root
      ownerState={{ t, variant, ...rest }}
      className={classNames(ns('workspace-control-panel'))}
      aria-label={t('workspaceNavigation')}
    >
      <WorkspaceAddButton />
      <ActionGroup>
        <Tooltip title="Kokudor (GitHub)">
          <BrandingLink
            component="a"
            href="https://github.com/dknijl/mirador-svelte"
            target="_blank"
            rel="noopener"
            aria-label="Kokudor (GitHub)"
            size="large"
          >
            K
          </BrandingLink>
        </Tooltip>
        <WorkspaceControlPanelButtons optionsTarget={optionsTarget} />
      </ActionGroup>
    </Root>
  );
}

WorkspaceControlPanel.propTypes = {
  optionsTarget: PropTypes.object,
  variant: PropTypes.oneOf(['default', 'wide']),
};

import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import FullScreenButton from '../containers/FullScreenButton';
import WorkspaceMenuButton from '../containers/WorkspaceMenuButton';
import WorkspaceOptionsButton from '../containers/WorkspaceOptionsButton';
import WindowListButton from '../containers/WindowListButton';
import { PluginHook } from './PluginHook';

/**
 *
 */
export function WorkspaceControlPanelButtons({ optionsTarget = null, ...rest }) {
  const options = (
    <>
      <WorkspaceOptionsButton />
      <FullScreenButton />
      <PluginHook targetName="WorkspaceControlPanelButtons" {...rest} />
    </>
  );
  return (
    <>
      <WindowListButton />
      <WorkspaceMenuButton />
      {optionsTarget ? createPortal(options, optionsTarget) : options}
    </>
  );
}

WorkspaceControlPanelButtons.propTypes = {
  optionsTarget: PropTypes.object,
};

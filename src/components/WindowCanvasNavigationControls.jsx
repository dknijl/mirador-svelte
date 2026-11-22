import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { CanvasToolbarTarget } from '../contexts/ToolbarContext';
import { forwardRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';
import { useElementSize } from '@custom-react-hooks/use-element-size';
import mergeRefs from 'merge-refs';
import ZoomControls from '../containers/ZoomControls';
import ViewerInfo from '../containers/ViewerInfo';
import ViewerNavigation from '../containers/ViewerNavigation';
import ns from '../config/css-ns';
import { PluginHook } from './PluginHook';

const Root = styled('div', { name: 'WindowCanvasNavigationControls', slot: 'root' })({
  alignItems: 'center',
  display: 'flex',
  flexGrow: 1,
  flexWrap: 'nowrap',
  justifyContent: 'center',
  columnGap: 8,
  paddingInline: 8,
  '& .MuiIconButton-root': { width: 38 },
  '& .mirador-osd-navigation': { display: 'flex', flexShrink: 0 },
  '& .mirador-osd-info': { maxWidth: '38ch', paddingInline: 4, width: 'auto' },
});

/**
 * Represents the viewer controls in the mirador workspace.
 */
export const WindowCanvasNavigationControls = forwardRef(
  ({ showZoomControls = false, visible = true, windowId, zoomToWorld, ...rest }, ref) => {
    const target = useContext(CanvasToolbarTarget);
    const { t } = useTranslation();
    const [sizeRef, size] = useElementSize();

    const pluginProps = {
      showZoomControls,
      size,
      visible,
      windowId,
      ...rest,
    };
    if (!visible)
      return (
        <Typography style={visuallyHidden} component="div">
          <ViewerInfo windowId={windowId} />
        </Typography>
      );

    const controls = (
      <Root className={ns('canvas-nav')} role="group" aria-label={t('windowNavigation')} ref={mergeRefs(ref, sizeRef)}>
        {showZoomControls && <ZoomControls windowId={windowId} zoomToWorld={zoomToWorld} />}
        <ViewerNavigation windowId={windowId} />
        <ViewerInfo windowId={windowId} />
        <PluginHook targetName="WindowCanvasNavigationControls" {...pluginProps} />
      </Root>
    );
    return target ? createPortal(controls, target) : controls;
  },
);

WindowCanvasNavigationControls.propTypes = {
  // eslint-disable-next-line react/require-default-props -- this rule doesn't detect default args through forwardRef's inner callback (see the default arg on line 37); https://github.com/jsx-eslint/eslint-plugin-react/issues/2856
  showZoomControls: PropTypes.bool,
  // eslint-disable-next-line react/require-default-props -- same forwardRef detection gap as above
  visible: PropTypes.bool,
  windowId: PropTypes.string.isRequired,
  zoomToWorld: PropTypes.func.isRequired,
};

WindowCanvasNavigationControls.displayName = 'WindowCanvasNavigationControls';

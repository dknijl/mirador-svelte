import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import { getThumbnailNavigationPosition, getThemeDirection, getWindow } from '../state/selectors';
import { WindowThumbnailSettings } from '../components/WindowThumbnailSettings';

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof ManifestListItem
 * @private
 */
const mapDispatchToProps = { updateWindow: actions.updateWindow, setWindowThumbnailPosition: actions.setWindowThumbnailPosition };

/**
 * mapStateToProps - to hook up connect
 * @memberof WindowViewer
 * @private
 */
const mapStateToProps = (state, { windowId }) => ({
  thumbnailColumns: getWindow(state, { windowId })?.thumbnailColumns,
  direction: getThemeDirection(state),
  thumbnailNavigationPosition: getThumbnailNavigationPosition(state, { windowId }),
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true }),
  withPlugins('WindowThumbnailSettings'),
  // further HOC go here
);

export default enhance(WindowThumbnailSettings);

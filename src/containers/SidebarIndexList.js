import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import { getCompanionWindow, getCanvases, getDefaultSidebarVariant, getVisibleCanvasIds } from '../state/selectors';
import { SidebarIndexList } from '../components/SidebarIndexList';

/**
 * mapStateToProps - to hook up connect
 */
const mapStateToProps = (state, { id, windowId }) => ({
  canvases: getCanvases(state, { windowId }),
  selectedCanvasIds: getVisibleCanvasIds(state, { windowId }),
  // The panel header falls back to the manifest's default variant when the
  // companion window has none; the list has to resolve it the same way or the
  // selected tab and the rendered layout disagree.
  variant:
    getCompanionWindow(state, { companionWindowId: id, windowId }).variant || getDefaultSidebarVariant(state, { windowId }),
});

/**
 * mapStateToProps - used to hook up connect to state
 * @memberof SidebarIndexList
 * @private
 */
const mapDispatchToProps = (dispatch, { id, windowId }) => ({
  setCanvas: (...args) => dispatch(actions.setCanvas(...args)),
});

const enhance = compose(connect(mapStateToProps, mapDispatchToProps), withPlugins('SidebarIndexList'));

export default enhance(SidebarIndexList);

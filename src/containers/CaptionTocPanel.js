import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import { getCaptionTocEntries, getVisibleCanvasIds } from '../state/selectors';
import { CaptionTocPanel } from '../components/CaptionTocPanel';

/** */
const mapStateToProps = (state, { windowId }) => ({
  entries: getCaptionTocEntries(state, { windowId }),
  selectedCanvasIds: getVisibleCanvasIds(state, { windowId }),
});

/** */
const mapDispatchToProps = (dispatch) => ({
  setCanvas: (...args) => dispatch(actions.setCanvas(...args)),
});

const enhance = compose(connect(mapStateToProps, mapDispatchToProps), withPlugins('CaptionTocPanel'));

export default enhance(CaptionTocPanel);

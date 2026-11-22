import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import { CaptionTocMenu } from '../components/CaptionTocMenu';

/** */
const mapDispatchToProps = (dispatch) => ({
  openCaptionToc: (windowId) =>
    dispatch(actions.addOrUpdateCompanionWindow(windowId, { content: 'captionToc', position: 'right' })),
});

const enhance = compose(connect(null, mapDispatchToProps), withPlugins('CaptionTocMenu'));

export default enhance(CaptionTocMenu);

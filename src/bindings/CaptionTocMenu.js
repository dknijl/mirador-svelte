import * as actions from '../state/actions';

/** */
export const mapDispatchToProps = (dispatch) => ({
  openCaptionToc: (windowId) =>
    dispatch(actions.addOrUpdateCompanionWindow(windowId, { content: 'captionToc', position: 'right' })),
});

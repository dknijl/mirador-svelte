import * as actions from '../state/actions';
import { getLanguagesFromConfigWithCurrent } from '../state/selectors';

/**
 * Map state to props for connect
 */
export const mapStateToProps = (state) => ({
  languages: getLanguagesFromConfigWithCurrent(state),
});

/**
 * Map action dispatches to props for connect
 */
export const mapDispatchToProps = (dispatch, { afterSelect }) => ({
  handleClick: (language) => {
    dispatch(actions.updateConfig({ language }));

    afterSelect && afterSelect();
  },
});

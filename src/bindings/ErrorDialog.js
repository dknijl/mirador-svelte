import * as actions from '../state/actions';
import { getLatestError } from '../state/selectors';

export const mapStateToProps = (state) => ({
  error: getLatestError(state),
});

export const mapDispatchToProps = {
  removeError: actions.removeError,
};

import { getExportableState } from '../state/selectors';

export const mapStateToProps = (state) => ({
  exportableState: getExportableState(state),
});

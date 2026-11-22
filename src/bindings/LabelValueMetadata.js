import { getConfig } from '../state/selectors';

/** */
export const mapStateToProps = (state) => ({
  labelValueJoiner: getConfig(state).labelValueJoiner,
});

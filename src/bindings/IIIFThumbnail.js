import { getConfig } from '../state/selectors';

export const mapStateToProps = (state) => ({
  thumbnailsConfig: getConfig(state).thumbnails,
});

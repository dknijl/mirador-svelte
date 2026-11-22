import { fetchManifest, removeResource } from '../state/actions';

/** */
export const mapDispatchToProps = {
  onDismissClick: removeResource,
  onTryAgainClick: fetchManifest,
};

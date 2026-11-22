/**
 * React entry point kept for API compatibility.
 *
 * The DOM is produced by `AccessTokenSender.svelte`. The "no url means render
 * nothing" contract stays here, in React, so mounting the bridge does not
 * change the existing DOM output for that case.
 */
import PropTypes from 'prop-types';
import AccessTokenSenderSvelte from './AccessTokenSender.svelte';
import { toReactComponent } from '../svelte/toReactComponent';

const AccessTokenSenderBridge = toReactComponent(AccessTokenSenderSvelte, 'AccessTokenSender');

/** Opens a new window for click */
export function AccessTokenSender({ handleAccessTokenMessage, url = undefined }) {
  if (!url) return null;

  return <AccessTokenSenderBridge handleAccessTokenMessage={handleAccessTokenMessage} url={url} />;
}

AccessTokenSender.propTypes = {
  handleAccessTokenMessage: PropTypes.func.isRequired,
  url: PropTypes.string,
};

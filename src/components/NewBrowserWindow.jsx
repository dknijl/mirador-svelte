/**
 * React entry point kept for API compatibility.
 *
 * The window handling lives in `NewBrowserWindow.svelte`; the component still
 * renders no visible DOM.
 */
import PropTypes from 'prop-types';
import NewBrowserWindowSvelte from './NewBrowserWindow.svelte';
import { toReactComponent } from '../svelte/toReactComponent';

export const NewBrowserWindow = toReactComponent(NewBrowserWindowSvelte, 'NewBrowserWindow');

NewBrowserWindow.propTypes = {
  depWindow: PropTypes.object,
  features: PropTypes.string,
  name: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
};

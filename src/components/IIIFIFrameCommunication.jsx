/**
 * React entry point kept for API compatibility.
 *
 * The implementation lives in `IIIFIFrameCommunication.svelte`; the iframe
 * props and the window `message` listener behave as before.
 */
import IIIFIFrameCommunicationSvelte from './IIIFIFrameCommunication.svelte';
import { toReactComponent } from '../svelte/toReactComponent';

export const IIIFIFrameCommunication = toReactComponent(IIIFIFrameCommunicationSvelte, 'IIIFIFrameCommunication');

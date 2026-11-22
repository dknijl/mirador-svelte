/**
 * React entry point kept for API compatibility.
 *
 * The implementation now lives in `SanitizedHtml.svelte`; React consumers keep
 * importing `SanitizedHtml` and passing the same props. The DOM contract
 * (`span.mirador-third-party-html` with sanitized HTML) is unchanged.
 */
import SanitizedHtmlSvelte from './SanitizedHtml.svelte';
import { toReactComponent } from '../svelte/toReactComponent';

export const SanitizedHtml = toReactComponent(SanitizedHtmlSvelte, 'SanitizedHtml');

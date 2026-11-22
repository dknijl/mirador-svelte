import init from './init';
import state from './state';

export { default as OpenSeadragonViewer } from './components/ImageViewer.svelte';
export { default as Connected } from './svelte/Connected.svelte';
export * from './components';
export * from './state';
export * from './extend';
export * from './lib';
export * from './plugins';
export * from './config';
export { viewer } from './init';

export default {
  ...init,
  ...state,
};

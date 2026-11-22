import InvalidPluginF from '../components/InvalidPluginF.svelte';

export default {
  component: InvalidPluginF,
  mode: 'add',
  name: 'invalidPluginF',
  reducers: {
    foo: 'foo', // invalid
  },
  target: 'WorkspaceControlPanelButtons',
};

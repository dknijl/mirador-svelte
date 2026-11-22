import InvalidPluginD from '../components/InvalidPluginD.svelte';

export default {
  component: InvalidPluginD,
  mapDispatchToProps: 'foo', // invalid
  mode: 'add',
  name: 'invalidPluginD',
  target: 'WorkspaceControlPanelButtons',
};

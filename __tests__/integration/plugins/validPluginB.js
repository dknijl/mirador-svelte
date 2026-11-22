import ValidPluginB from '../components/ValidPluginB.svelte';

export default {
  component: ValidPluginB,
  mapDispatchToProps: {},
  mapStateToProps: () => ({}),
  mode: 'add',
  name: 'validPluginB',
  reducers: {
    bar: (state = null, action) => state,
  },
  target: 'WorkspaceControlPanelButtons',
};

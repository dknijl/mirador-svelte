<script module>
  const interiorAdditions = new Set([
    'ErrorContent',
    'AttributionPanel',
    'CanvasInfo',
    'CollectionDialog',
    'ManifestInfo',
    'ManifestRelatedLinks',
    'WindowAuthenticationBar',
    'WindowTopBarPluginArea',
    'WindowTopBarPluginMenu',
    'WindowTopMenu',
    'WindowSideBarButtons',
    'WorkspaceAdd',
    'WorkspaceControlPanelButtons',
    'WorkspaceMenu',
    'WorkspaceOptionsMenu',
  ]);
</script>

<script>
  import { getContext, setContext } from 'svelte';
  import { bindActionCreators } from 'redux';
  import * as bindings from '../bindings';
  import PluginTarget from '../extend/PluginTarget.svelte';
  import { viewerContext, createViewerContext } from './viewerContext';

  let { name, component: Component, targetProps = {}, store, plugins, t, children } = $props();
  const inherited = getContext(viewerContext);
  const context = $derived(inherited?.() ?? createViewerContext(store, () => plugins ?? []));
  if (!inherited) setContext(viewerContext, () => context);
  const binding = $derived(bindings[name]);
  const dispatch = $derived(context.store.dispatch);
  const actions = $derived(
    typeof binding?.mapDispatchToProps === 'function'
      ? binding.mapDispatchToProps(dispatch, targetProps)
      : bindActionCreators(binding?.mapDispatchToProps || {}, dispatch),
  );
  const selected = $derived(binding?.mapStateToProps?.(context.state, targetProps));
  const props = $derived({
    ...targetProps,
    ...selected,
    ...actions,
    failedImages: context.failedImages,
    notifyFailure: context.notifyFailure,
    fallbackImage: context.fallbackImage,
    store: context.store,
    plugins: plugins ?? context.plugins,
    t: t ?? context.t,
  });
</script>

<PluginTarget
  mode={interiorAdditions.has(name) ? 'wrap' : undefined}
  {name}
  store={context.store}
  plugins={props.plugins}
  targetProps={props}
>
  <Component {...props} children={children ?? targetProps.children} />
</PluginTarget>

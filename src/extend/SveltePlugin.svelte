<script>
  import { createSubscriber } from 'svelte/reactivity';
  import { bindActionCreators } from 'redux';

  let { plugin, store, targetProps = {}, children } = $props();
  const subscribe = $derived(createSubscriber((update) => store.subscribe(update)));
  const selected = $derived.by(() => {
    if (!plugin.mapStateToProps) return {};
    subscribe();
    return plugin.mapStateToProps(store.getState(), targetProps);
  });
  const actions = $derived(
    typeof plugin.mapDispatchToProps === 'function'
      ? plugin.mapDispatchToProps(store.dispatch, targetProps)
      : bindActionCreators(plugin.mapDispatchToProps ?? {}, store.dispatch),
  );
  const Component = $derived(plugin.component);
</script>

<Component {...targetProps} {...selected} {...actions} {store} {children} />

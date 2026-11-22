<script>
  import { getConfig } from '../state/selectors';
  let { resource, fallback = null, store } = $props();
  const label = $derived.by(() => {
    if (!resource) return fallback;
    const resourceLabel = resource.getLabel?.();
    if (!resourceLabel) return fallback || resource.id;
    const locale = store ? getConfig(store.getState()).language : '';
    return resourceLabel.getValue(locale || '') ?? fallback ?? resource.id;
  });
</script>

{label}

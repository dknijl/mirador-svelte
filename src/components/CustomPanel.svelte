<script>
  import Connected from '../svelte/Connected.svelte';
  import CompanionWindow from './CompanionWindow.svelte';
  let { children, id, title = '', windowId, t = (key) => key } = $props();
</script>

<Connected name="CompanionWindow" component={CompanionWindow} targetProps={{ title: t(title), id, windowId }}>
  {@render children?.()}
</Connected>

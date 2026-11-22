<script>
  import Connected from '../svelte/Connected.svelte';
  import WindowSideBarButtons from './WindowSideBarButtons.svelte';

  let { windowId } = $props();
</script>

<div class="window-sidebar">
  <Connected name="WindowSideBarButtons" component={WindowSideBarButtons} targetProps={{ windowId }} />
</div>

<style>
  .window-sidebar {
    align-items: center;
    display: flex;
    min-height: 32px;
    min-width: max-content;
    padding-inline-start: 4px;
  }
</style>

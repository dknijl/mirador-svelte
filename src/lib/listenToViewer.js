/** Subscribe to one viewer event for the lifetime of the calling Svelte effect. */
export default function listenToViewer(viewer, event, handler) {
  if (!viewer) return undefined;
  viewer.addHandler(event, handler);
  return () => viewer.removeHandler(event, handler);
}

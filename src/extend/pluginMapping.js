/** Keep the registration order within each extension point and mode. */
export function createTargetToPluginMapping(plugins) {
  const targets = Object.create(null);
  for (const plugin of plugins) {
    if (!plugin.target || !plugin.mode || !plugin.component) continue;
    const target = (targets[plugin.target] ??= {});
    (target[plugin.mode] ??= []).push(plugin);
  }
  return targets;
}

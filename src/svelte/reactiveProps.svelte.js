/**
 * Reactive props holder used by the React -> Svelte bridge.
 *
 * Svelte 5 only re-renders a mounted component when the object handed to
 * `mount()` as `props` is reactive. `$state` cannot appear in an expression
 * position, so the proxy lives in a class field; callers mutate its keys
 * instead of replacing the object.
 *
 * Values read back from the proxy are proxied themselves, so change detection
 * compares against a plain snapshot (`last`) rather than against the proxy.
 */
export class SvelteProps {
  /** @type {Record<string, unknown>} */
  current = $state({});

  /** @type {Record<string, unknown>} */
  last = {};

  /** @param {Record<string, unknown>} initial */
  constructor(initial) {
    Object.assign(this.current, initial);
    this.last = { ...initial };
  }

  /**
   * Apply the next prop set, dropping keys that are no longer passed.
   *
   * @param {Record<string, unknown>} next
   */
  update(next) {
    Object.keys(this.last).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(next, key)) return;

      delete this.current[key];
      delete this.last[key];
    });

    Object.entries(next).forEach(([key, value]) => {
      if (this.last[key] === value) return;

      this.current[key] = value;
      this.last[key] = value;
    });
  }
}

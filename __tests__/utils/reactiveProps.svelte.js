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

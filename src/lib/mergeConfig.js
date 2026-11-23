import isPlainObject from 'lodash/isPlainObject';

/** Merge viewer and plugin settings without mutating either input. */
export default function mergeConfig(base, incoming, { replaceArrays = false } = {}) {
  function merge(previous, value) {
    if (Array.isArray(value)) {
      if (replaceArrays) return value;
      const entries = Array.isArray(previous) ? previous.concat(value) : value;
      return entries.map((entry) => merge(undefined, entry));
    }
    if (!isPlainObject(value)) return value;

    const result = {};
    const copy = (source) => {
      for (const key of Reflect.ownKeys(source)) {
        if (!Object.prototype.propertyIsEnumerable.call(source, key) || key in Object.prototype) continue;
        result[key] = merge(result[key], source[key]);
      }
    };
    if (isPlainObject(previous)) copy(previous);
    copy(value);
    return result;
  }
  return merge(base, incoming);
}

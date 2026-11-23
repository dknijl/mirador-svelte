import mergeConfig from '@src/lib/mergeConfig';

describe('viewer configuration merging', () => {
  it('merges nested options and appends plugin arrays without sharing mutable defaults', () => {
    const key = Symbol('extension');
    const onSelect = () => {};
    const item = { label: 'Page' };
    const date = new Date(0);
    const original = { viewer: { items: [item], onSelect }, [key]: date };
    const result = mergeConfig(original, { viewer: { items: ['next'] } });
    expect(result).toEqual({ viewer: { items: [item, 'next'], onSelect }, [key]: date });
    expect(result.viewer.items[0]).not.toBe(item);
    expect(original.viewer.items).toHaveLength(1);
  });

  it('replaces configured arrays on state import and ignores inherited settings', () => {
    const config = JSON.parse('{"viewer":{"items":["new"],"__proto__":{"inheritedSetting":true}}}');
    const result = mergeConfig({ viewer: { items: ['default'] } }, config, { replaceArrays: true });
    expect(result.viewer.items).toEqual(['new']);
    expect(result.viewer).not.toHaveProperty('inheritedSetting');
    expect(Object.prototype).not.toHaveProperty('inheritedSetting');
  });
});

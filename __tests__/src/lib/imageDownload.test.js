import { createCanonicalImageUrl } from '@src/plugins/imageDownload/iiifImage';

const id = 'https://images.example.org/iiif/page';

describe('IIIF image download links', () => {
  it.each([
    [1, 'native', 'full'],
    [2, 'default', 'full'],
    [3, 'default', 'max'],
  ])('uses Image API %i syntax for a native-size image', (version, quality, size) => {
    const info = { '@context': `http://iiif.io/api/image/${version}/context.json`, id, width: 1200, height: 800 };
    expect(createCanonicalImageUrl(info, 'full', 1200, 800)).toBe(`${id}/full/${size}/0/${quality}.jpg`);
  });

  it('offers advertised level-zero sizes and respects service restrictions on crops and maximum size', () => {
    const info = {
      '@context': 'http://iiif.io/api/image/3/context.json',
      id,
      width: 1200,
      height: 800,
      profile: 'level0',
      maxWidth: 600,
      sizes: [{ width: 600, height: 400 }],
    };
    expect(createCanonicalImageUrl(info, 'full', 600, 400)).toBe(`${id}/full/600,400/0/default.jpg`);
    expect(createCanonicalImageUrl(info, 'full', 1200, 800)).toBeUndefined();
    expect(createCanonicalImageUrl(info, '100,100,600,400', 600, 400)).toBeUndefined();
    expect(createCanonicalImageUrl({ ...info, profile: 'level2' }, '100,100,600,400', 600, 400)).toBe(
      `${id}/100,100,600,400/600,400/0/default.jpg`,
    );
  });
});

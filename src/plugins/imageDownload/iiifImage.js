// Adapted from ProjectMirador/mirador-dl-plugin under Apache-2.0.
// Copyright 2019 The Board of Trustees of the Leland Stanford Junior University.
function getArrayFromInfoResponse(imageInfo, key) {
  const value = imageInfo && imageInfo[key];
  let valueArray;
  if (Array.isArray(value)) {
    valueArray = value;
  } else if (typeof value === 'string') {
    valueArray = [value];
  }
  return valueArray;
}

export function getComplianceLevel(imageInfo) {
  const profile = getArrayFromInfoResponse(imageInfo, 'profile');
  switch (profile && profile[0]) {
    case 'http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level0':
    case 'http://iiif.io/api/image/1/level0.json':
    case 'http://iiif.io/api/image/2/level0.json':
    case 'level0':
      return 0;
    case 'http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level1':
    case 'http://iiif.io/api/image/1/level1.json':
    case 'http://iiif.io/api/image/2/level1.json':
    case 'level1':
      return 1;
    case 'http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level2':
    case 'http://iiif.io/api/image/1/level2.json':
    case 'http://iiif.io/api/image/2/level2.json':
    case 'level2':
      return 2;
    default:
      return undefined;
  }
}

export function getImageApiVersion(imageInfo) {
  const context = getArrayFromInfoResponse(imageInfo, '@context');
  if (!context) {
    return undefined;
  }
  if (context.indexOf('http://iiif.io/api/image/3/context.json') > -1) {
    return 3;
  }
  if (context.indexOf('http://iiif.io/api/image/2/context.json') > -1) {
    return 2;
  }
  if (
    context.indexOf('http://iiif.io/api/image/1/context.json') > -1 ||
    context.indexOf('http://library.stanford.edu/iiif/image-api/1.1/context.json') > -1
  ) {
    return 1;
  }
  return undefined;
}

function getProfileCapabilities(imageInfo) {
  const profile = getArrayFromInfoResponse(imageInfo, 'profile');
  return profile && profile.length > 1 && profile[1];
}

function supportsAdditionalFeature(imageInfo, feature) {
  const version = getImageApiVersion(imageInfo);
  switch (version) {
    case 2: {
      const capabilities = getProfileCapabilities(imageInfo);
      return capabilities && capabilities.supports && capabilities.supports.indexOf(feature) > -1;
    }
    case 3:
      return imageInfo.extraFeatures && imageInfo.extraFeatures.indexOf(feature) > -1;
    default:
      return false;
  }
}

export function requestExceedsMaximum(imageInfo, width, height) {
  const version = getImageApiVersion(imageInfo);
  const limits = version === 2 ? getProfileCapabilities(imageInfo) : version === 3 && imageInfo;
  if (!limits) return false;
  const { maxWidth, maxHeight = maxWidth, maxArea } = limits;
  return width > maxWidth || height > maxHeight || width * height > maxArea;
}

function supportsArbitrarySizeInCanonicalForm(imageInfo) {
  const level = getComplianceLevel(imageInfo);
  const version = getImageApiVersion(imageInfo);
  // everything but undefined or 0 is fine
  if (
    !!level ||
    (version < 3 && supportsAdditionalFeature(imageInfo, 'sizeByW')) ||
    (version === 3 && supportsAdditionalFeature(imageInfo, 'sizeByWh'))
  ) {
    return true;
  }
  return false;
}

function supportsRequest(imageInfo, region, width, height) {
  if (region !== 'full' && !getComplianceLevel(imageInfo) && !supportsAdditionalFeature(imageInfo, 'regionByPx')) return false;
  if (supportsArbitrarySizeInCanonicalForm(imageInfo)) {
    return true;
  }
  if (region === 'full') {
    // every compliance level must serve the whole image at its native size
    // (`full` in Image API 1/2, `max` in 3), whether or not it is listed in `sizes`
    if (imageInfo.width === width && imageInfo.height === height) {
      return true;
    }
    return Boolean(imageInfo.sizes && imageInfo.sizes.some((size) => size.width === width && size.height === height));
  }
  return false;
}

export function calculateHeightForWidth(imageInfo, width) {
  if (!imageInfo) {
    return undefined;
  }
  if (imageInfo.width === width) {
    return imageInfo.height;
  }
  return Math.floor((imageInfo.height * width) / imageInfo.width);
}

export function createCanonicalImageUrl(imageInfo, region, width, height) {
  const version = getImageApiVersion(imageInfo);
  let baseUri = imageInfo['@id'] || imageInfo.id;
  if (!baseUri || !version || !(width > 0 && height > 0)) return undefined;
  baseUri = baseUri.replace(/\/$/, '');
  let size = `${width},${version === 3 ? height : ''}`;
  const quality = version === 1 ? 'native' : 'default';
  if (imageInfo.width === width && imageInfo.height === height) {
    // Image API 3 replaced the `full` size keyword with `max`
    size = version === 3 ? 'max' : 'full';
  }
  if (!supportsRequest(imageInfo, region, width, height)) {
    return undefined;
  }
  if (requestExceedsMaximum(imageInfo, width, height)) {
    return undefined;
  }
  return `${baseUri}/${region}/${size}/0/${quality}.jpg`;
}

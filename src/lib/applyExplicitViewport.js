import Openseadragon from 'openseadragon';

/**
 * Applies x/y/zoom/rotation/flip to viewport. `immediately` snaps
 * unconditionally (there's nothing yet to compare against the first time
 * this runs). Otherwise each value is only touched if it differs from
 * where the camera is already headed, to avoid restarting an animation
 * that's already correct.
 */
export default function applyExplicitViewport(viewport, { x, y, zoom, rotation, flip }, immediately) {
  const point = new Openseadragon.Point(x, y);

  if (
    x != null &&
    y != null &&
    (immediately ||
      Math.round(x) !== Math.round(viewport.centerSpringX.target.value) ||
      Math.round(y) !== Math.round(viewport.centerSpringY.target.value))
  ) {
    viewport.panTo(point, immediately);
  }

  // Independent of x/y -- zoom can be applied on its own.
  if (zoom != null && (immediately || zoom !== viewport.zoomSpring.target.value)) {
    viewport.zoomTo(zoom, point, immediately);
    // OSD's own zoom buttons always pair a zoom call with applyConstraints.
    // Because we have custom buttons, we must apply it here to enforce min/max zoom.
    viewport.applyConstraints();
  }

  if (rotation != null && rotation !== viewport.getRotation()) viewport.setRotation(rotation);
  if (flip != null && (flip || false) !== viewport.getFlip()) viewport.setFlip(flip);
}

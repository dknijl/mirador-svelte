/** Fullscreen is document-wide, but only the viewer that owns it may exit it. */
export function createFullscreenHandle(getElement) {
  return {
    get active() {
      const element = getElement();
      return Boolean(element && element.ownerDocument.fullscreenElement === element);
    },
    async enter() {
      const element = getElement();
      if (!element || this.active) return;
      if (element.ownerDocument.fullscreenElement) await element.ownerDocument.exitFullscreen();
      await element.requestFullscreen();
    },
    async exit() {
      if (this.active) await getElement().ownerDocument.exitFullscreen();
    },
  };
}

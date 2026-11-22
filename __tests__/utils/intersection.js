const observers = new Map();
export class TestIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe(element) {
    if (!observers.has(this)) observers.set(this, new Set());
    observers.get(this).add(element);
  }
  unobserve(element) {
    observers.get(this)?.delete(element);
  }
  disconnect() {
    observers.delete(this);
  }
}
export function resetIntersections() {
  observers.clear();
}
export function mockAllIsIntersecting(isIntersecting) {
  for (const [observer, elements] of observers) {
    observer.callback(
      Array.from(elements, (target) => ({ target, isIntersecting, intersectionRatio: Number(isIntersecting) })),
      observer,
    );
  }
}

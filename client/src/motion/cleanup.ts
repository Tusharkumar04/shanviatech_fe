/**
 * Lifecycle helpers. Every motion primitive returns a disposer; anything that
 * registers a listener, timer, observer, or GSAP object must be torn down
 * through one of these so navigation never leaves orphaned work running.
 */

export type Disposer = () => void;

export const noop: Disposer = () => undefined;

/** Collects disposers and runs them all, newest first, exactly once. */
export class DisposerBag {
  private items: Disposer[] = [];

  add(dispose: Disposer): Disposer {
    this.items.push(dispose);
    return dispose;
  }

  run(): void {
    const items = this.items.splice(0);
    for (let i = items.length - 1; i >= 0; i -= 1) {
      try {
        items[i]();
      } catch (error) {
        console.error("[motion] cleanup failed", error);
      }
    }
  }
}

/** addEventListener that returns its own remover. */
export function listen<K extends keyof WindowEventMap>(
  target: Window,
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions,
): Disposer;
export function listen<K extends keyof HTMLElementEventMap>(
  target: HTMLElement | Document,
  type: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions,
): Disposer;
export function listen<K extends keyof DocumentEventMap>(
  target: Document,
  type: K,
  handler: (event: DocumentEventMap[K]) => void,
  options?: AddEventListenerOptions,
): Disposer;
export function listen(
  target: EventTarget,
  type: string,
  handler: (event: Event) => void,
  options?: AddEventListenerOptions,
): Disposer {
  target.addEventListener(type, handler, options);
  return () => target.removeEventListener(type, handler, options);
}

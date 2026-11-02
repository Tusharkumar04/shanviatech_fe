/**
 * Magnetic pull: the element drifts a fraction of the pointer offset while
 * hovered and springs back on leave. Strength is capped so targets stay easy
 * to hit. Desktop with a fine pointer only.
 */
import { ensureGsap, gsap } from "./gsap";
import { noop, listen, type Disposer, DisposerBag } from "./cleanup";
import { hasFinePointer, prefersReducedMotion } from "./reducedMotion";

export function attachMagnetic(el: HTMLElement, strength = 0.22, maxPx = 12): Disposer {
  if (typeof window === "undefined" || !hasFinePointer() || prefersReducedMotion()) return noop;
  ensureGsap();

  const bag = new DisposerBag();
  const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
  const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });

  const clamp = (v: number) => Math.max(-maxPx, Math.min(maxPx, v));

  bag.add(
    listen(el, "pointermove", (event) => {
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      xTo(clamp(dx * strength));
      yTo(clamp(dy * strength));
    }),
  );
  bag.add(
    listen(el, "pointerleave", () => {
      xTo(0);
      yTo(0);
    }),
  );

  return () => {
    bag.run();
    gsap.killTweensOf(el, "x,y");
    gsap.set(el, { x: 0, y: 0 });
  };
}

/**
 * Restrained 3D tilt driven by pointer position. Writes a glare position into
 * CSS custom properties so styling can add a highlight without extra work.
 */
import { ensureGsap, gsap } from "./gsap";
import { noop, listen, DisposerBag, type Disposer } from "./cleanup";
import { hasFinePointer, prefersReducedMotion } from "./reducedMotion";

export function attachTilt(el: HTMLElement, maxDeg = 6): Disposer {
  if (typeof window === "undefined" || !hasFinePointer() || prefersReducedMotion()) return noop;
  ensureGsap();

  const bag = new DisposerBag();
  let rect: DOMRect | null = null;

  bag.add(
    listen(el, "pointerenter", () => {
      rect = el.getBoundingClientRect();
    }),
  );
  bag.add(
    listen(el, "pointermove", (event) => {
      const box = rect ?? el.getBoundingClientRect();
      const px = (event.clientX - box.left) / box.width;
      const py = (event.clientY - box.top) / box.height;
      gsap.to(el, {
        rotateY: (px - 0.5) * maxDeg * 2,
        rotateX: -(py - 0.5) * maxDeg * 2,
        transformPerspective: 1000,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
      el.style.setProperty("--glare-x", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--glare-y", `${(py * 100).toFixed(1)}%`);
    }),
  );
  bag.add(
    listen(el, "pointerleave", () => {
      rect = null;
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "expo.out", overwrite: "auto" });
    }),
  );

  return () => {
    bag.run();
    gsap.killTweensOf(el);
    gsap.set(el, { rotateX: 0, rotateY: 0 });
  };
}

/**
 * App-wide pointer spotlight. One delegated listener writes the pointer
 * position into CSS variables on the nearest card or dark section, so the
 * glow follows the mouse without per-component listeners. Desktop only: it
 * does nothing on touch devices or when reduced motion is requested.
 */
import { hasFinePointer, prefersReducedMotion } from "./reducedMotion";
import { listen, type Disposer } from "./cleanup";

const SPOT_SELECTOR = ".card, .quote, .feature, .team-card, .job, .address, .stat, .service-card, .blog-card, .project, .step, .product__copy";
const SECTION_SELECTOR = ".section--ink, .section--ink-2";

export function startPointerFx(): Disposer {
  if (typeof window === "undefined") return () => undefined;
  if (!hasFinePointer() || prefersReducedMotion()) return () => undefined;

  let raf = 0;
  let lastX = 0;
  let lastY = 0;
  let target: Element | null = null;
  let section: Element | null = null;

  const write = () => {
    raf = 0;
    if (target instanceof HTMLElement) {
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--sx", `${lastX - rect.left}px`);
      target.style.setProperty("--sy", `${lastY - rect.top}px`);
    }
    if (section instanceof HTMLElement) {
      const rect = section.getBoundingClientRect();
      section.style.setProperty("--gx", `${lastX - rect.left}px`);
      section.style.setProperty("--gy", `${lastY - rect.top}px`);
    }
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    lastX = event.clientX;
    lastY = event.clientY;
    const el = event.target instanceof Element ? event.target : null;
    target = el?.closest(SPOT_SELECTOR) ?? null;
    section = el?.closest(SECTION_SELECTOR) ?? null;
    if (!raf) raf = requestAnimationFrame(write);
  };

  const dispose = listen(document, "pointermove", onMove, { passive: true });
  return () => {
    if (raf) cancelAnimationFrame(raf);
    dispose();
  };
}

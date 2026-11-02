/**
 * SVG line drawing tied to scroll (DrawSVG). Paths are drawn progressively as
 * their trigger moves through the viewport. Reduced-motion users get the
 * finished drawing at once.
 */
import { ensureGsap, gsap } from "./gsap";
import { noop, type Disposer } from "./cleanup";
import { prefersReducedMotion } from "./reducedMotion";

export interface DrawOptions {
  trigger?: Element;
  start?: string;
  end?: string;
  scrub?: boolean;
  duration?: number;
  stagger?: number;
}

export function drawPaths(paths: SVGGeometryElement[] | NodeListOf<SVGGeometryElement>, opts: DrawOptions = {}): Disposer {
  if (typeof window === "undefined" || !paths || (paths as ArrayLike<unknown>).length === 0) return noop;
  ensureGsap();

  const list = Array.from(paths);
  if (prefersReducedMotion()) {
    gsap.set(list, { drawSVG: "100%" });
    return noop;
  }

  const { trigger, start = "top 80%", end = "bottom 40%", scrub = true, duration = 1.4, stagger = 0.15 } = opts;

  gsap.set(list, { drawSVG: "0%" });
  const tween = gsap.to(list, {
    drawSVG: "100%",
    duration,
    stagger,
    ease: scrub ? "none" : "power2.inOut",
    ...(trigger
      ? { scrollTrigger: { trigger, start, end, scrub } }
      : { delay: 0.2 }),
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

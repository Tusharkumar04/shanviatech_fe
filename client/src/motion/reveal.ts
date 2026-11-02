/**
 * Scroll reveals for groups of elements. The container is the ScrollTrigger
 * trigger, so a whole group arrives together with a stagger rather than each
 * child firing its own trigger.
 */
import { ensureGsap, gsap, ScrollTrigger } from "./gsap";
import { noop, type Disposer } from "./cleanup";
import { prefersReducedMotion } from "./reducedMotion";

export interface RevealOptions {
  selector?: string;
  y?: number;
  x?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  scale?: number;
}

export function revealGroup(container: HTMLElement, opts: RevealOptions = {}): Disposer {
  if (typeof window === "undefined") return noop;
  ensureGsap();

  const {
    selector = "[data-reveal-item]",
    y = 48,
    x = 0,
    duration = 1.1,
    stagger = 0.09,
    start = "top 86%",
    scale = 1,
  } = opts;

  const items = Array.from(container.querySelectorAll<HTMLElement>(selector));
  if (!items.length) return noop;

  if (prefersReducedMotion()) return noop;

  const tween = gsap.fromTo(
    items,
    { autoAlpha: 0, y, x, scale },
    {
      autoAlpha: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration,
      stagger,
      ease: "expo.out",
      scrollTrigger: { trigger: container, start, once: true },
      clearProps: "transform",
    },
  );

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

/** Image reveal: the frame opens from a clip, the picture inside settles from a zoom. */
export function revealImage(frame: HTMLElement, direction: "up" | "left" | "right" = "up"): Disposer {
  if (typeof window === "undefined" || prefersReducedMotion()) return noop;
  ensureGsap();

  const inset =
    direction === "up"
      ? "inset(100% 0% 0% 0%)"
      : direction === "left"
        ? "inset(0% 100% 0% 0%)"
        : "inset(0% 0% 0% 100%)";

  const img = frame.querySelector<HTMLElement>("[data-reveal-media]") ?? frame;
  const tween = gsap.timeline({
    scrollTrigger: { trigger: frame, start: "top 85%", once: true },
  });
  tween
    .fromTo(frame, { clipPath: inset }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut" })
    .fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0);

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

export { ScrollTrigger };

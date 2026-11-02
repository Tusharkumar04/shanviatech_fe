/**
 * Layered parallax. Each layer moves at its own speed relative to its
 * containing section, scrubbed to scroll. Speed is clamped and disabled on
 * phones, where it costs frames and adds little.
 */
import { ensureGsap, gsap } from "./gsap";
import { noop, type Disposer } from "./cleanup";
import { getMotionTier, prefersReducedMotion } from "./reducedMotion";

export function attachParallax(el: HTMLElement, speed = 0.12, trigger?: HTMLElement | null): Disposer {
  if (typeof window === "undefined" || prefersReducedMotion() || getMotionTier() === "mobile") {
    return noop;
  }
  ensureGsap();

  const scope = trigger ?? el.parentElement ?? el;
  const amount = Math.max(-0.35, Math.min(0.35, speed)) * 100;

  const tween = gsap.fromTo(
    el,
    { yPercent: -amount },
    {
      yPercent: amount,
      ease: "none",
      scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: 0.6 },
    },
  );

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    gsap.set(el, { yPercent: 0 });
  };
}

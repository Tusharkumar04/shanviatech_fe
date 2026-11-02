/**
 * Smooth scrolling: Lenis driven by GSAP's ticker, so ScrollTrigger, pinning,
 * and scrubbed timelines all read the same scroll position. Reference-counted
 * so several consumers can share one instance and the last one out stops it.
 */
import Lenis from "lenis";
import { ensureGsap, gsap, ScrollTrigger } from "./gsap";
import { noop, type Disposer } from "./cleanup";
import { prefersReducedMotion } from "./reducedMotion";

let lenis: Lenis | null = null;
let users = 0;
let tick: ((time: number) => void) | null = null;

export function getLenis(): Lenis | null {
  return lenis;
}

export function startSmoothScroll(): Disposer {
  if (typeof window === "undefined" || prefersReducedMotion()) return noop;
  ensureGsap();

  users += 1;

  if (!lenis) {
    lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      // Touch keeps native momentum scrolling, which is smoother on phones.
    });
    lenis.on("scroll", ScrollTrigger.update);
    tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    users -= 1;
    if (users <= 0) destroySmoothScroll();
  };
}

function destroySmoothScroll() {
  if (tick) gsap.ticker.remove(tick);
  tick = null;
  lenis?.destroy();
  lenis = null;
  users = 0;
}

/** Jump to a position without easing, used on route changes. */
export function resetScroll(): void {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

/** Stop smooth scrolling while a modal surface (menu, OTP dialog) is open. */
export function lockScroll(): () => void {
  const html = document.documentElement;
  const previous = html.style.overflow;
  html.style.overflow = "hidden";
  lenis?.stop();
  return () => {
    html.style.overflow = previous;
    lenis?.start();
  };
}

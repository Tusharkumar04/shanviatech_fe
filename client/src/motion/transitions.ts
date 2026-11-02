/**
 * Route transition choreography. The veil covers the page (exit), the router
 * swaps content underneath, then the veil lifts (enter). Plain functions
 * returning promises, so the React layer stays declarative.
 */
import { ensureGsap, gsap } from "./gsap";

export function veilIn(veil: HTMLElement): Promise<void> {
  ensureGsap();
  return new Promise((resolve) => {
    gsap.timeline({ onComplete: resolve })
      .set(veil, { transformOrigin: "bottom center", display: "block" })
      .fromTo(veil, { scaleY: 0 }, { scaleY: 1, duration: 0.55, ease: "expo.inOut" })
      .fromTo(veil.querySelectorAll("[data-veil-label]"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, "-=0.2");
  });
}

export function veilOut(veil: HTMLElement): Promise<void> {
  ensureGsap();
  return new Promise((resolve) => {
    gsap.timeline({
      onComplete: () => {
        gsap.set(veil, { display: "none" });
        resolve();
      },
    })
      .set(veil, { transformOrigin: "top center" })
      .to(veil.querySelectorAll("[data-veil-label]"), { autoAlpha: 0, duration: 0.2 })
      .to(veil, { scaleY: 0, duration: 0.7, ease: "expo.inOut" }, 0.05);
  });
}

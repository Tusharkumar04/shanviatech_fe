/**
 * Environment capability detection. Motion decisions (what to animate, how
 * much, and whether to run WebGL/canvas at all) are made here, once, and read
 * by the rest of the motion layer.
 */

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

export type MotionTier = "desktop" | "tablet" | "mobile";

const canMatch = () => typeof window !== "undefined" && "matchMedia" in window;

export function prefersReducedMotion(): boolean {
  return canMatch() && window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function hasFinePointer(): boolean {
  return canMatch() && window.matchMedia(FINE_POINTER_QUERY).matches;
}

/** Desktop = fine pointer + wide viewport + non-constrained device. */
export function getMotionTier(): MotionTier {
  if (typeof window === "undefined") return "desktop";

  const width = window.innerWidth;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowEnd = (nav.deviceMemory ?? 8) <= 4 || (nav.hardwareConcurrency ?? 8) <= 4;

  if (width < 768) return "mobile";
  if (width < 1100 || !hasFinePointer() || lowEnd) return "tablet";
  return "desktop";
}

/** Subscribe to reduced-motion changes made at the OS level while the app runs. */
export function subscribeReducedMotion(callback: (reduced: boolean) => void): () => void {
  if (!canMatch()) return () => undefined;
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  const handler = (event: MediaQueryListEvent) => callback(event.matches);
  mql.addEventListener("change", handler);
  return () => mql.removeEventListener("change", handler);
}

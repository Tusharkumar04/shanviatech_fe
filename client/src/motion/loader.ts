/**
 * Intro state. The branded loader plays once per browser session. Other
 * components subscribe to "intro finished" so hero reveals wait for the curtain
 * instead of animating underneath it. Skipped entirely for reduced motion.
 */
import { prefersReducedMotion } from "./reducedMotion";

const INTRO_KEY = "shanvia:intro-seen";
const isBrowser = typeof window !== "undefined";

let introDone = !isBrowser || prefersReducedMotion() || hasSeenIntro();
const subscribers = new Set<() => void>();

function hasSeenIntro(): boolean {
  try {
    return sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return false;
  }
}

export function shouldPlayIntro(): boolean {
  return isBrowser && !introDone;
}

export function isIntroDone(): boolean {
  return introDone;
}

export function markIntroDone(): void {
  if (introDone) return;
  introDone = true;
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    // Storage can be blocked; the intro simply replays next time.
  }
  subscribers.forEach((fn) => fn());
}

export function subscribeIntro(fn: () => void): () => void {
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
}

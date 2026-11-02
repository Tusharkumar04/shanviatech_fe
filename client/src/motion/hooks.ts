"use client";

/**
 * React bindings for the motion primitives. Components call these hooks; the
 * hooks own setup and teardown, so no component touches GSAP directly.
 */
import { useEffect, useLayoutEffect, useSyncExternalStore, type RefObject } from "react";
import { ensureGsap, gsap } from "./gsap";
import { DisposerBag, type Disposer } from "./cleanup";
import { attachMagnetic } from "./magnetic";
import { attachTilt } from "./tilt";
import { attachParallax } from "./parallax";
import { drawPaths, type DrawOptions } from "./svg";
import { revealGroup, revealImage, type RevealOptions } from "./reveal";
import { splitReveal, type SplitRevealOptions } from "./splitText";
import { isIntroDone, subscribeIntro } from "./loader";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Runs `bind` against the element once it exists; disposes on unmount/deps change. */
function useBinding<T extends Element>(
  ref: RefObject<T | null>,
  bind: (el: T) => Disposer,
  deps: unknown[] = [],
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const bag = new DisposerBag();
    bag.add(bind(el));
    return () => bag.run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function useMagnetic<T extends HTMLElement>(ref: RefObject<T | null>, strength?: number) {
  useBinding(ref, (el) => attachMagnetic(el, strength), [strength]);
}

export function useTilt<T extends HTMLElement>(ref: RefObject<T | null>, maxDeg?: number) {
  useBinding(ref, (el) => attachTilt(el, maxDeg), [maxDeg]);
}

export function useParallax<T extends HTMLElement>(ref: RefObject<T | null>, speed?: number) {
  useBinding(ref, (el) => attachParallax(el, speed), [speed]);
}

export function useSplitText<T extends HTMLElement>(ref: RefObject<T | null>, opts?: SplitRevealOptions) {
  useBinding(ref, (el) => splitReveal(el, opts), [opts?.type, opts?.when, opts?.delay]);
}

export function useGroupReveal<T extends HTMLElement>(ref: RefObject<T | null>, opts?: RevealOptions) {
  useBinding(ref, (el) => revealGroup(el, opts), [opts?.selector, opts?.y]);
}

export function useImageReveal<T extends HTMLElement>(
  ref: RefObject<T | null>,
  direction: "up" | "left" | "right" = "up",
) {
  useBinding(ref, (el) => revealImage(el, direction), [direction]);
}

export function useDrawPaths<T extends Element>(ref: RefObject<T | null>, opts?: DrawOptions) {
  useBinding(
    ref,
    (el) => drawPaths(el.querySelectorAll<SVGGeometryElement>("[data-draw]"), { trigger: el, ...opts }),
    [opts?.start, opts?.end],
  );
}

/** Scoped GSAP context. Everything created inside `setup` is reverted on unmount. */
export function useGsapScope<T extends Element>(
  ref: RefObject<T | null>,
  setup: (scope: T) => void,
  deps: unknown[] = [],
) {
  useIsoLayoutEffect(() => {
    const scope = ref.current;
    if (!scope) return;
    ensureGsap();
    const ctx = gsap.context(() => setup(scope), scope);
    return () => ctx.revert();
  }, deps);
}

/** True once the branded intro has finished (or was skipped). */
export function useIntroDone(): boolean {
  return useSyncExternalStore(subscribeIntro, isIntroDone, () => false);
}

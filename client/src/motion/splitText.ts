/**
 * Split-text reveal: lines (masked) → words → characters. It re-splits and
 * re-plays when the container width changes, and reverts the DOM split on
 * teardown so the original text is restored.
 */
import { ensureGsap, gsap, SplitText } from "./gsap";
import { noop, type Disposer } from "./cleanup";
import { prefersReducedMotion } from "./reducedMotion";

export type SplitMode = "lines" | "words" | "chars";

export interface SplitRevealOptions {
  type?: SplitMode;
  /** Play immediately, or once the element scrolls into view. */
  when?: "now" | "scroll";
  delay?: number;
  stagger?: number;
  duration?: number;
  start?: string;
}

const DEFAULT_STAGGER: Record<SplitMode, number> = { lines: 0.12, words: 0.06, chars: 0.02 };

export function splitReveal(el: HTMLElement, opts: SplitRevealOptions = {}): Disposer {
  if (typeof window === "undefined") return noop;
  ensureGsap();

  const { type = "lines", when = "now", delay = 0, duration = 1.2, start = "top 88%" } = opts;
  const stagger = opts.stagger ?? DEFAULT_STAGGER[type];

  if (prefersReducedMotion()) return noop;

  let tween: gsap.core.Tween | null = null;

  const split = SplitText.create(el, {
    type: type === "lines" ? "lines,words" : type === "words" ? "words" : "chars,words",
    mask: type === "chars" ? undefined : type,
    linesClass: "split-line",
    wordsClass: "split-word",
    charsClass: "split-char",
    autoSplit: true,
    onSplit(self) {
      const targets = type === "lines" ? self.lines : type === "words" ? self.words : self.chars;
      tween?.kill();
      tween = gsap.fromTo(
        targets,
        type === "chars" ? { autoAlpha: 0, y: "0.6em" } : { yPercent: 110 },
        {
          ...(type === "chars" ? { autoAlpha: 1, y: "0em" } : { yPercent: 0 }),
          duration,
          delay,
          ease: "expo.out",
          stagger,
          ...(when === "scroll" ? { scrollTrigger: { trigger: el, start, once: true } } : {}),
        },
      );
      return tween;
    },
  });

  return () => {
    tween?.kill();
    split.revert();
  };
}

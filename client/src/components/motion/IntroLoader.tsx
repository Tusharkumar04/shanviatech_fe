"use client";

import { useEffect, useRef, useState } from "react";
import { ensureGsap, gsap } from "@/motion/gsap";
import { markIntroDone, shouldPlayIntro } from "@/motion/loader";

const MIN_MS = 1500;
const MAX_MS = 3200;

/**
 * Branded intro, once per session. Rendered in the SSR HTML so first paint is
 * already covered, then removed on the client if it has been seen or reduced
 * motion is requested. The exit waits for the page to load, capped so a slow
 * network never holds the visitor.
 */
export default function IntroLoader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const skipRef = useRef<(() => void) | null>(null);
  const [active, setActive] = useState(true);

  // Sync with sessionStorage after mount (avoids a hydration mismatch).
  useEffect(() => {
    if (!shouldPlayIntro()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- post-mount sessionStorage check
      setActive(false);
      return;
    }
    const root = rootRef.current;
    const counter = counterRef.current;
    const bar = barRef.current;
    if (!root || !counter || !bar) return;

    ensureGsap();
    const started = performance.now();
    let exiting = false;
    const cleanups: Array<() => void> = [];

    const pageReady = new Promise<void>((resolve) => {
      if (document.readyState === "complete") {
        resolve();
        return;
      }
      const done = () => resolve();
      window.addEventListener("load", done, { once: true });
      cleanups.push(() => window.removeEventListener("load", done));
    });

    const pause = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(resolve, ms);
        cleanups.push(() => window.clearTimeout(id));
      });

    const counterState = { value: 0 };
    const tl = gsap.timeline();
    let skipped = false;
    skipRef.current = () => {
      skipped = true;
      tl.progress(1);
    };
    tl.fromTo(root.querySelectorAll(".intro__word"), { y: "105%" }, { y: "0%", duration: 1.1, ease: "expo.out", stagger: 0.12 }, 0.1)
      .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0.1)
      .to(
        counterState,
        {
          value: 100,
          duration: 1.6,
          ease: "power2.inOut",
          onUpdate: () => {
            counter.textContent = String(Math.round(counterState.value)).padStart(3, "0");
          },
        },
        0.1,
      );

    const exit = async () => {
      if (exiting) return;
      exiting = true;
      if (!skipped) {
        const elapsed = performance.now() - started;
        await Promise.race([
          Promise.all([pageReady, pause(Math.max(0, MIN_MS - elapsed))]),
          pause(MAX_MS),
        ]);
      }
      gsap.to(root, {
        yPercent: -100,
        duration: 1,
        ease: "expo.inOut",
        onComplete: () => {
          markIntroDone();
          setActive(false);
        },
      });
    };

    tl.eventCallback("onComplete", () => void exit());

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") skipRef.current?.();
    };
    window.addEventListener("keydown", onKey);
    cleanups.push(() => window.removeEventListener("keydown", onKey));

    return () => {
      tl.kill();
      skipRef.current = null;
      cleanups.forEach((fn) => fn());
    };
  }, []);

  if (!active) return null;

  return (
    <div ref={rootRef} className="intro" role="status" aria-live="polite" aria-label="Loading Shanvia Tech Solutions">
      <div className="intro__top">
        <span>Shanvia Tech Solutions</span>
        <span>Kolkata, India</span>
      </div>
      <h1 className="intro__center" aria-hidden="true">
        <span className="intro__word">Shanvia</span>
        <span className="intro__word">
          Tech <em>Solutions</em>
        </span>
      </h1>
      <div className="intro__bottom">
        <span className="intro__count" ref={counterRef}>000</span>
        <button type="button" className="intro__skip" onClick={() => skipRef.current?.()}>
          Skip intro
        </button>
      </div>
      <span className="intro__bar" ref={barRef} />
    </div>
  );
}

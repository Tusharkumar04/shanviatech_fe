"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap, ScrollTrigger } from "@/motion/gsap";
import { prefersReducedMotion } from "@/motion/reducedMotion";

/** Thin page-progress bar, scrubbed to the document scroll. Removed on unmount. */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bar.current;
    if (!el || prefersReducedMotion()) return;
    ensureGsap();
    const tween = gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.3 },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return <div ref={bar} className="scroll-progress" aria-hidden="true" />;
}

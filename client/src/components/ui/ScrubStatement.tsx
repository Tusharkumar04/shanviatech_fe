"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap } from "@/motion/gsap";
import { prefersReducedMotion } from "@/motion/reducedMotion";

/**
 * Large statement that lights up word by word as you scroll past it. Words
 * start dimmed; scroll scrubs them to full opacity. Reduced motion shows the
 * full statement at once.
 */
export default function ScrubStatement({ text, className = "statement" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.trim().split(/\s+/).filter(Boolean);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.querySelectorAll(".w").forEach((w) => w.classList.add("is-on"));
      return;
    }
    ensureGsap();
    const ctx = gsap.context(() => {
      gsap.to(el.querySelectorAll(".w"), {
        opacity: 1,
        ease: "none",
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.4 },
      });
    }, el);
    return () => ctx.revert();
  }, [text]);

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="w" aria-hidden="true">
          {word}{" "}
        </span>
      ))}
    </p>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap } from "@/motion/gsap";
import { prefersReducedMotion } from "@/motion/reducedMotion";

/**
 * Continuous horizontal ticker. Items are duplicated so the loop is seamless.
 * A GSAP ticker drives the position so scroll velocity can speed it up; it
 * pauses on hover and falls back to a still row under reduced motion. The
 * ticker is removed on unmount.
 */
export default function Marquee({
  items,
  reverse = false,
  label,
}: {
  items: string[];
  reverse?: boolean;
  label?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const region = regionRef.current;
    if (!track || !region || prefersReducedMotion() || items.length === 0) return;
    ensureGsap();

    const base = 60; // px per second at rest
    const dir = reverse ? -1 : 1;
    let x = 0;
    let boost = 0;
    let paused = false;
    let lastY = window.scrollY;
    let scrollSpeed = 0; // px per frame, filled by the scroll listener
    track.classList.add("is-js");

    const onScroll = () => {
      scrollSpeed = window.scrollY - lastY;
      lastY = window.scrollY;
    };

    const tick = (_time: number, deltaMs: number) => {
      const dt = Math.min(deltaMs, 64) / 1000;
      const velocity = Math.abs(scrollSpeed) * 60;
      scrollSpeed = 0;
      boost += (Math.min(velocity / 40, 420) - boost) * 0.08;
      if (!paused) {
        const half = track.scrollWidth / 2;
        x -= dir * (base + boost) * dt;
        if (half > 0) {
          if (x <= -half) x += half;
          if (x > 0) x -= half;
        }
        gsap.set(track, { x });
      }
    };

    const onEnter = () => (paused = true);
    const onLeave = () => (paused = false);
    region.addEventListener("pointerenter", onEnter);
    region.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("scroll", onScroll);
      region.removeEventListener("pointerenter", onEnter);
      region.removeEventListener("pointerleave", onLeave);
      gsap.set(track, { clearProps: "transform" });
      track.classList.remove("is-js");
    };
  }, [items.length, reverse]);

  if (!items.length) return null;
  const row = items.map((item, i) => (
    <span className="marquee__item" key={`${item}-${i}`}>
      {item}
    </span>
  ));

  return (
    <div
      ref={regionRef}
      className={`marquee ${reverse ? "marquee--reverse" : ""}`.trim()}
      role="region"
      aria-label={label ?? "Highlights"}
    >
      <div ref={trackRef} className="marquee__track">
        <div style={{ display: "flex" }}>{row}</div>
        <div style={{ display: "flex" }} aria-hidden="true">
          {row}
        </div>
      </div>
    </div>
  );
}

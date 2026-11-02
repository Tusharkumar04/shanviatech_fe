"use client";

import { useEffect, useRef } from "react";
import { mountParticleField } from "@/motion/particles";
import { getMotionTier, prefersReducedMotion } from "@/motion/reducedMotion";

/**
 * Ambient particle field behind the hero. Density follows the device tier;
 * phones get no canvas (the CSS gradient carries the mood there).
 */
export default function ParticleCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const tier = getMotionTier();
    if (tier === "mobile") return;

    return mountParticleField(canvas, {
      count: tier === "desktop" ? 88 : 34,
      link: tier === "desktop" ? 150 : 120,
      color: "rgba(238, 234, 225, 0.75)",
      linkColor: "rgba(198, 255, 61, 1)",
      pointer: tier === "desktop",
      staticFrame: prefersReducedMotion(),
    });
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}

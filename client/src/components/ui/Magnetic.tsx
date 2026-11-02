"use client";

import { useRef, type ReactNode } from "react";
import { useMagnetic } from "@/motion/hooks";

/** Wraps a CTA so it drifts toward the pointer. Strength is kept low on purpose. */
export default function Magnetic({
  children,
  strength = 0.22,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useMagnetic(ref, strength);
  return (
    <span ref={ref} className={`magnetic ${className}`.trim()} style={{ display: "inline-block" }}>
      {children}
    </span>
  );
}

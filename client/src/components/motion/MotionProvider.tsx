"use client";

import { useEffect, type ReactNode } from "react";
import { startSmoothScroll } from "@/motion/scroll";

/** Mounts the app-wide smooth scroller (Lenis, synced to GSAP). */
export default function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => startSmoothScroll(), []);
  return <>{children}</>;
}

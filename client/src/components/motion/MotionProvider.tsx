"use client";

import { useEffect, type ReactNode } from "react";
import { startSmoothScroll } from "@/motion/scroll";
import PointerFx from "./PointerFx";
import ScrollProgress from "./ScrollProgress";

/** Mounts app-wide motion: smooth scroller, pointer spotlight, scroll progress. */
export default function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => startSmoothScroll(), []);
  return (
    <>
      <ScrollProgress />
      <PointerFx />
      {children}
    </>
  );
}

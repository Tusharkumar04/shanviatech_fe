"use client";

import { useEffect, useRef } from "react";
import { startCursor } from "@/motion/cursor";

/** Desktop-only cursor. Purely decorative, so it never intercepts clicks. */
export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return startCursor(ref.current);
  }, []);

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <div className="cursor__ring" data-cursor-ring />
      <div className="cursor__dot" data-cursor-dot />
      <span className="cursor__label" data-cursor-label />
    </div>
  );
}

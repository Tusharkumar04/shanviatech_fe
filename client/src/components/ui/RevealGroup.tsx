"use client";

import { useRef, type ReactNode } from "react";
import { useGroupReveal } from "@/motion/hooks";

/**
 * Container whose direct descendants marked with data-reveal-item arrive
 * together, staggered, when the group scrolls into view.
 */
export default function RevealGroup({
  children,
  className = "",
  as = "div",
  start,
  y,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol" | "section";
  start?: string;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGroupReveal(ref, { selector: "[data-reveal-item]", start, y });
  const Tag = as as "div";
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

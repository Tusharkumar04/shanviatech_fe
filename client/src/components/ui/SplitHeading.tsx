"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { splitReveal, type SplitRevealOptions } from "@/motion/splitText";
import { useIntroDone } from "@/motion/hooks";

type Tag = "h1" | "h2" | "h3" | "p" | "div";

interface SplitHeadingProps {
  as?: Tag;
  className?: string;
  children: ReactNode;
  /** Hold the reveal until the branded intro has finished. */
  waitForIntro?: boolean;
  options?: SplitRevealOptions;
  style?: CSSProperties;
}

/**
 * Headline that rises line by line. The text is visible until the split runs,
 * so content stays readable if scripts are slow.
 */
export default function SplitHeading({
  as: Tag = "h2",
  className,
  children,
  waitForIntro = false,
  options,
  style,
}: SplitHeadingProps) {
  const ref = useRef<HTMLElement>(null);
  const introDone = useIntroDone();
  const ready = !waitForIntro || introDone;

  useEffect(() => {
    const el = ref.current;
    if (!el || !ready) return;
    return splitReveal(el, options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, options?.type, options?.when]);

  const Element = Tag as "h2";
  return (
    <Element ref={ref as React.RefObject<HTMLHeadingElement>} className={className} style={style}>
      {children}
    </Element>
  );
}

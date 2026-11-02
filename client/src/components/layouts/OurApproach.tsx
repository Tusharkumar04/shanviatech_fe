"use client";

import Link from "next/link";
import { useRef } from "react";
import FrameImage from "@/components/ui/FrameImage";
import Icon from "@/components/ui/Icon";
import SplitHeading from "@/components/ui/SplitHeading";
import { useDrawPaths } from "@/motion/hooks";
import { hrefFor, externalProps } from "@/utils/href";

interface ApproachProps {
  approach?: {
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
    link?: string;
    button_title?: string;
  } | null;
}

/**
 * Scene 02: the approach. The picture stays pinned (CSS sticky) while the copy
 * scrolls past, and an SVG route draws itself through the section as you read.
 */
export default function OurApproach({ approach }: ApproachProps) {
  const section = useRef<HTMLElement>(null);
  useDrawPaths(section, { start: "top 70%", end: "bottom 60%" });

  if (!approach) return null;
  const href = hrefFor(approach.link);

  return (
    <section ref={section} className="section section--bone" aria-labelledby="approach-title">
      <svg className="approach-route" viewBox="0 0 1200 900" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path data-draw d="M-20 120 C 300 40, 420 320, 720 260 S 1100 520, 1240 420" pathLength={1} />
        <path data-draw d="M-20 640 C 240 760, 520 560, 760 700 S 1080 880, 1240 800" pathLength={1} />
      </svg>

      <div className="wrap split split--wide-left" style={{ position: "relative" }}>
        <div className="approach__sticky">
          <FrameImage src={approach.image} alt={approach.title || "Our approach"} aspect="tall" direction="left" parallax={0.08} />
        </div>

        <div>
          <p className="eyebrow">
            <span className="eyebrow__index">02</span>
            Approach
          </p>
          <SplitHeading as="h2" className="h2" options={{ type: "lines", when: "scroll" }}>
            <span id="approach-title">{approach.title || "Our approach"}</span>
          </SplitHeading>
          {approach.subtitle ? <p className="lede" style={{ marginTop: "2rem" }}>{approach.subtitle}</p> : null}
          {approach.description ? (
            <div className="body" style={{ marginTop: "2rem" }}>
              <p>{approach.description}</p>
            </div>
          ) : null}
          {approach.button_title ? (
            <div style={{ marginTop: "2.5rem" }}>
              <Link href={href} className="btn" {...externalProps(href)}>
                {approach.button_title} <Icon name="arrow" className="btn__arrow" />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

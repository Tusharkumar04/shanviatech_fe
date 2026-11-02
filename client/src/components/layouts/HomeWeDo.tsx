"use client";

import Link from "next/link";
import FrameImage from "@/components/ui/FrameImage";
import Icon from "@/components/ui/Icon";
import SplitHeading from "@/components/ui/SplitHeading";
import { hrefFor, externalProps } from "@/utils/href";

const SHOWREEL_URL = "https://www.youtube.com/watch?v=sU3FkzUKHXU";

interface HomeWeDoProps {
  weDo?: {
    image?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    link?: string;
    button_title?: string;
  } | null;
}

/**
 * Scene 04: the quiet-then-loud beat. A dark section where the showreel frame
 * drifts with parallax and the play control is a cursor-aware target.
 */
export default function HomeWeDo({ weDo }: HomeWeDoProps) {
  if (!weDo) return null;
  const href = hrefFor(weDo.link);

  return (
    <section className="section section--ink" aria-labelledby="wedo-title">
      <div className="wrap split split--wide-right">
        <div>
          <p className="eyebrow">
            <span className="eyebrow__index">04</span>
            What we do
          </p>
          <SplitHeading as="h2" className="h2" options={{ type: "lines", when: "scroll" }}>
            <span id="wedo-title">{weDo.title || "What we do"}</span>
          </SplitHeading>
          {weDo.subtitle ? <p className="lede" style={{ marginTop: "2rem" }}>{weDo.subtitle}</p> : null}
          {weDo.description ? (
            <div className="body" style={{ marginTop: "1.5rem" }}>
              <p>{weDo.description}</p>
            </div>
          ) : null}
          {weDo.button_title ? (
            <div style={{ marginTop: "2.5rem" }}>
              <Link href={href} className="btn" {...externalProps(href)}>
                {weDo.button_title} <Icon name="arrow" className="btn__arrow" />
              </Link>
            </div>
          ) : null}
        </div>

        <a
          href={SHOWREEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="reel"
          data-cursor="play"
          data-cursor-label="Watch"
          data-no-transition
          aria-label={`Watch the showreel: ${weDo.title || "What we do"} (opens in a new tab)`}
        >
          <FrameImage src={weDo.image} alt="" aspect="wide" parallax={0.1} />
          <span className="reel__play" aria-hidden="true">
            <Icon name="play" />
          </span>
        </a>
      </div>
    </section>
  );
}

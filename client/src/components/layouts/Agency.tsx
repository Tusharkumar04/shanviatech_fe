"use client";

import Link from "next/link";
import FrameImage from "@/components/ui/FrameImage";
import ScrubStatement from "@/components/ui/ScrubStatement";
import Icon from "@/components/ui/Icon";
import SplitHeading from "@/components/ui/SplitHeading";
import RevealGroup from "@/components/ui/RevealGroup";
import { hrefFor, externalProps } from "@/utils/href";

interface AgencyHighlight {
  _id?: string;
  image?: string;
  title?: string;
  description?: string;
  link?: string;
  button_title?: string;
}

interface AgencyProps {
  about?: {
    title?: string;
    description?: string;
    highlights?: AgencyHighlight[];
  } | null;
}

/** Scene 01: a single statement that the reader lights up as they scroll, then three proof cards. */
export default function Agency({ about }: AgencyProps) {
  if (!about) return null;
  const highlights = about.highlights ?? [];

  return (
    <section className="section section--ink" aria-labelledby="about-title">
      <div className="orbs" aria-hidden="true"><i /><i /><i /></div>
      <div className="wrap">
        <div className="intro-head intro-head--row">
          <div>
            <p className="eyebrow">
              <span className="eyebrow__index">01</span>
              {about.title || "About"}
            </p>
            <SplitHeading as="h2" className="h2" options={{ type: "lines", when: "scroll" }}>
              <span id="about-title" style={{ display: "inline" }}>
                Who we are
              </span>
            </SplitHeading>
          </div>
        </div>

        {about.description ? <ScrubStatement text={about.description} /> : null}

        {highlights.length ? (
          <RevealGroup className="grid grid--3 mt-m">
            {highlights.map((item, i) => {
              const href = hrefFor(item.link);
              return (
                <article key={item._id || i} className="card" data-reveal-item>
                  <Link href={href} tabIndex={-1} aria-hidden="true" {...externalProps(href)} style={{ display: "block" }}>
                    <FrameImage src={item.image} alt={item.title || ""} aspect="wide" tilt cursor="explore" />
                  </Link>
                  <div>
                    <h3 className="h3" style={{ fontSize: "clamp(1.4rem, 2vw, 1.9rem)" }}>
                      {item.title}
                    </h3>
                    <p className="muted" style={{ margin: "0.75rem 0 0" }}>
                      {item.description}
                    </p>
                  </div>
                  {item.button_title ? (
                    <Link href={href} className="text-link" style={{ marginTop: "auto" }} {...externalProps(href)}>
                      {item.button_title} <Icon name="arrow" />
                    </Link>
                  ) : null}
                </article>
              );
            })}
          </RevealGroup>
        ) : null}
      </div>
    </section>
  );
}

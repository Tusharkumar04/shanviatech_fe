"use client";

import { useMemo } from "react";
import Link from "next/link";
import { getWorkApiCall } from "@/services/api/workApi";
import { useApi } from "@/hooks/useApi";
import FrameImage from "@/components/ui/FrameImage";
import Icon from "@/components/ui/Icon";
import SplitHeading from "@/components/ui/SplitHeading";
import RevealGroup from "@/components/ui/RevealGroup";
import { LoadingState } from "@/components/ui/StatePanels";
import { hrefFor, externalProps } from "@/utils/href";

/**
 * Our process and methodology from the work endpoint. The steps draw a line
 * down the side as they reveal. If the CMS has no work content yet (the
 * endpoint returns 404) the section simply does not render.
 */
export default function WorkProcess() {
  const work = useApi(getWorkApiCall, [], "");
  const steps = useMemo(
    () => [...(work.data?.our_process ?? [])].filter(Boolean).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [work.data],
  );
  const methods = useMemo(
    () => [...(work.data?.our_methodology ?? [])].filter(Boolean).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [work.data],
  );

  if (work.loading) return <div className="wrap section"><LoadingState label="Loading process" /></div>;
  if (work.error || !work.data) return null;

  const href = hrefFor(work.data.link);
  const points = (work.data.points ?? []).filter(Boolean);

  return (
    <section className="section section--ink" aria-labelledby="process-title">
      <div className="orbs" aria-hidden="true"><i /><i /><i /></div>
      <div className="wrap split split--wide-right">
        <div>
          <p className="eyebrow">
            <span className="eyebrow__index">03</span>
            Our process
          </p>
          <SplitHeading as="h2" className="h2" options={{ type: "lines", when: "scroll" }}>
            <span id="process-title">{work.data.title || "How we work"}</span>
          </SplitHeading>
          {points.length ? (
            <ul className="ticks" style={{ marginTop: "2rem" }}>
              {points.map((point, i) => (
                <li key={`${point}-${i}`}>{point}</li>
              ))}
            </ul>
          ) : null}
          {work.data.button_title && work.data.link ? (
            <div style={{ marginTop: "2.5rem" }}>
              <Link href={href} className="btn" {...externalProps(href)}>
                {work.data.button_title} <Icon name="arrow" className="btn__arrow" />
              </Link>
            </div>
          ) : null}
        </div>
        <FrameImage src={work.data.image} alt={work.data.title || ""} aspect="tall" direction="right" parallax={0.06} tilt />
      </div>

      {steps.length ? (
        <div className="wrap" style={{ marginTop: "5rem" }}>
          <RevealGroup as="ol" className="steps">
            {steps.map((step, index) => (
              <li key={step._id || index} className="step card" data-reveal-item style={{ listStyle: "none" }}>
                <span className="step__num mono">{String(index + 1).padStart(2, "0")}</span>
                {step.icon ? <img className="step__icon" src={step.icon} alt="" width={40} height={40} loading="lazy" decoding="async" /> : null}
                <h3 className="h4" style={{ margin: 0 }}>{step.title}</h3>
                {step.description ? <p className="muted" style={{ margin: 0 }}>{step.description}</p> : null}
              </li>
            ))}
          </RevealGroup>
        </div>
      ) : null}

      {methods.length ? (
        <div className="wrap" style={{ marginTop: "5rem" }}>
          <p className="eyebrow">
            <span className="eyebrow__index">04</span>
            Methodology
          </p>
          <RevealGroup className="grid grid--2">
            {methods.map((method, index) => (
              <article key={method._id || index} className="card" data-reveal-item>
                <span className="mono muted">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="h4" style={{ margin: 0 }}>{method.title}</h3>
                {method.description ? <p className="muted" style={{ margin: 0 }}>{method.description}</p> : null}
              </article>
            ))}
          </RevealGroup>
        </div>
      ) : null}
    </section>
  );
}

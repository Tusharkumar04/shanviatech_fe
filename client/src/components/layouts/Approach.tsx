"use client";

import Link from "next/link";
import { getApproachApiCall } from "@/services/api/approachApi";
import { getJobApiCall } from "@/services/api/jobApi";
import { useApi } from "@/hooks/useApi";
import Opener from "@/components/ui/Opener";
import FrameImage from "@/components/ui/FrameImage";
import Icon from "@/components/ui/Icon";
import SplitHeading from "@/components/ui/SplitHeading";
import RevealGroup from "@/components/ui/RevealGroup";
import ScrubStatement from "@/components/ui/ScrubStatement";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/StatePanels";
import CareerAccordion, { type JobItem } from "./CareerAccordion";
import WorkProcess from "./WorkProcess";

interface WhyChooseUsHighlight {
  _id?: string;
  logo?: string;
  title?: string;
  description?: string;
}

interface TechnicalCraftHighlight {
  _id?: string;
  logo?: string;
  title?: string;
}

interface ApproachViewData {
  title?: string;
  subtitle?: string;
  images?: string[];
  description?: string;
  our_approach?: string;
  our_mission?: string;
  why_choose_us?: {
    title?: string;
    description?: string;
    highlights?: WhyChooseUsHighlight[];
  };
  technical_craft?: {
    title?: string;
    description?: string;
    highlights?: TechnicalCraftHighlight[];
  };
  hiring_impressive?: {
    title?: string;
    subtitle?: string;
    image?: string;
  };
}

/**
 * Approach: how we work, why we're different, technical craft, and hiring.
 * The approach and the jobs load independently, so one failing does not
 * blank the other.
 */
export default function Approach() {
  const approach = useApi<ApproachViewData>(() => getApproachApiCall() as Promise<ApproachViewData>, [], "Unable to load the approach.");
  const jobs = useApi<{ items?: JobItem[] }>(() => getJobApiCall() as Promise<{ items?: JobItem[] }>, [], "Unable to load open roles.");

  const data = approach.data;

  if (approach.loading) return <div className="wrap section"><LoadingState label="Loading approach" /></div>;
  if (approach.error) return <div className="wrap section"><ErrorState message={approach.error} onRetry={approach.reload} /></div>;
  if (!data) return <div className="wrap section"><EmptyState title="Nothing to show yet." /></div>;

  const whyHighlights = (data.why_choose_us?.highlights ?? []).filter(Boolean);
  const craftHighlights = (data.technical_craft?.highlights ?? []).filter(Boolean);

  return (
    <>
      <Opener crumbs={[{ label: "Approach" }]} title={data.title || "Our approach"} lede={data.subtitle} />

      <section className="section section--bone" aria-label="Approach">
        <div className="wrap split split--wide-left">
          <div className="approach__sticky">
            <FrameImage src={data.images?.[0]} alt="" aspect="tall" direction="left" parallax={0.06} />
          </div>
          <div>
            {data.our_approach ? (
              <>
                <p className="eyebrow"><span className="eyebrow__index">01</span>How we work</p>
                <ScrubStatement text={data.our_approach} />
              </>
            ) : null}
            {data.description ? <p className="body" style={{ marginTop: "2rem" }}>{data.description}</p> : null}
            {data.our_mission ? (
              <div className="card" style={{ marginTop: "3rem" }}>
                <span className="note">Our mission</span>
                <p className="lede" style={{ margin: 0 }}>{data.our_mission}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {data.why_choose_us ? (
        <section className="section section--ink" aria-labelledby="why-approach-title">
          <div className="wrap">
            <p className="eyebrow"><span className="eyebrow__index">02</span>{data.why_choose_us.title}</p>
            <SplitHeading as="h2" className="h2" options={{ type: "lines", when: "scroll" }}>
              <span id="why-approach-title">{data.why_choose_us.title}</span>
            </SplitHeading>
            {data.why_choose_us.description ? <p className="lede" style={{ marginTop: "2rem" }}>{data.why_choose_us.description}</p> : null}
            {whyHighlights.length ? (
              <RevealGroup className="grid grid--3" >
                {whyHighlights.map((item, i) => (
                  <article key={item._id || i} className="card" data-reveal-item>
                    {item.logo ? <img src={item.logo} alt="" width={48} height={48} loading="lazy" decoding="async" /> : null}
                    <h3 className="h4" style={{ margin: 0 }}>{item.title}</h3>
                    {item.description ? <p className="muted" style={{ margin: 0 }}>{item.description}</p> : null}
                  </article>
                ))}
              </RevealGroup>
            ) : null}
          </div>
        </section>
      ) : null}

      {data.technical_craft ? (
        <section className="section section--bone" aria-labelledby="craft-title">
          <div className="wrap split">
            <div>
              <p className="eyebrow"><span className="eyebrow__index">03</span>Craft</p>
              <SplitHeading as="h2" className="h2" options={{ type: "lines", when: "scroll" }}>
                <span id="craft-title">{data.technical_craft.title}</span>
              </SplitHeading>
              {data.technical_craft.description ? <p className="body" style={{ marginTop: "2rem" }}>{data.technical_craft.description}</p> : null}
            </div>
            {craftHighlights.length ? (
              <ul className="ticks">
                {craftHighlights.map((item, i) => (
                  <li key={item._id || i} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {item.logo ? <img src={item.logo} alt="" width={28} height={28} loading="lazy" decoding="async" /> : null}
                    {item.title}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ) : null}

      {data.hiring_impressive ? (
        <section className="section section--ink-2" aria-labelledby="hiring-title">
          <div className="wrap split split--wide-right">
            <div>
              <p className="eyebrow"><span className="eyebrow__index">04</span>Careers</p>
              <SplitHeading as="h2" className="h2" options={{ type: "lines", when: "scroll" }}>
                <span id="hiring-title">{data.hiring_impressive.title}</span>
              </SplitHeading>
              {data.hiring_impressive.subtitle ? <p className="lede" style={{ marginTop: "2rem" }}>{data.hiring_impressive.subtitle}</p> : null}
              <div style={{ marginTop: "2.5rem" }}>
                <Link href="/career" className="btn">
                  See open roles <Icon name="arrow" className="btn__arrow" />
                </Link>
              </div>
              {jobs.loading ? <LoadingState label="Loading open roles" /> : null}
              {!jobs.loading && jobs.error ? <ErrorState message={jobs.error} onRetry={jobs.reload} /> : null}
              {!jobs.loading && !jobs.error ? <div style={{ marginTop: "2.5rem" }}><CareerAccordion jobData={jobs.data} /></div> : null}
            </div>
            <FrameImage src={data.hiring_impressive.image} alt="" aspect="tall" direction="right" />
          </div>
        </section>
      ) : null}
      <WorkProcess />
    </>
  );
}

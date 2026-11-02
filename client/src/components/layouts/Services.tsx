"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useServicesData, type ServiceItem } from "@/context/ServiceContext";
import ServiceCard from "./ServiceCard";
import Blogs from "./Blogs";
import Opener from "@/components/ui/Opener";
import FrameImage from "@/components/ui/FrameImage";
import Icon from "@/components/ui/Icon";
import SplitHeading from "@/components/ui/SplitHeading";
import RevealGroup from "@/components/ui/RevealGroup";
import { EmptyState, ErrorState, LoadingState, SkeletonGrid } from "@/components/ui/StatePanels";
import { ensureGsap, gsap } from "@/motion/gsap";
import { prefersReducedMotion } from "@/motion/reducedMotion";
import { hrefFor, externalProps } from "@/utils/href";

/**
 * Services index: opener, the service grid, two feature panels, a tabbed
 * highlight explorer, and the quality-assurance spread. All copy and links
 * come from site data.
 */
export default function Services() {
  const { serviceData, loading, error } = useServicesData();
  const [activeTitle, setActiveTitle] = useState("");

  const primary = serviceData?.digital_solutions?.[0];
  const highlights = useMemo(() => primary?.highlights ?? [], [primary]);
  const current = highlights.find((h) => h?.title === activeTitle) ?? highlights[0];
  const currentIndex = Math.max(0, highlights.findIndex((h) => h === current));
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const panel = useRef<HTMLDivElement>(null);

  // Crossfade the panel when the active highlight changes.
  useEffect(() => {
    const el = panel.current;
    if (!el || prefersReducedMotion()) return;
    ensureGsap();
    const t = gsap.fromTo(el, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "expo.out" });
    return () => {
      t.kill();
    };
  }, [current]);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = -1;
    if (e.key === "ArrowRight") next = (index + 1) % highlights.length;
    if (e.key === "ArrowLeft") next = (index - 1 + highlights.length) % highlights.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = highlights.length - 1;
    if (next < 0) return;
    e.preventDefault();
    setActiveTitle(highlights[next]?.title || "");
    tabs.current[next]?.focus();
  };

  const visibleServices = (serviceData?.services ?? [])
    .filter((item: ServiceItem) => item?.show_in_page)
    .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));

  const experience = serviceData?.digital_experiences;
  const agile = serviceData?.agile_project;
  const qa = serviceData?.quality_assurance;

  return (
    <>
      <Opener crumbs={[{ label: "Services" }]} title="Our services" lede="As a leading provider of business and technology services." />

      <section className="section section--bone" aria-labelledby="service-grid-title">
        <div className="wrap">
          <div className="intro-head intro-head--row">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__index">01</span>
                Catalogue
              </p>
              <SplitHeading as="h2" className="h2" options={{ type: "lines", when: "scroll" }}>
                <span id="service-grid-title">Everything we build</span>
              </SplitHeading>
            </div>
          </div>

          {loading ? (
            <div aria-busy="true">
              <LoadingState label="Loading services" />
              <SkeletonGrid count={6} />
            </div>
          ) : null}
          {!loading && error ? <ErrorState message={error} /> : null}
          {!loading && !error && visibleServices.length === 0 ? (
            <EmptyState title="No services published yet." text="Please check back soon." />
          ) : null}
          {!loading && !error && visibleServices.length > 0 ? (
            <RevealGroup className="grid grid--3">
              {visibleServices.map((item, index) => (
                <ServiceCard key={item?._id || item?.slug || index} item={item} index={index} />
              ))}
            </RevealGroup>
          ) : null}
        </div>
      </section>

      {!loading && !error && (experience || agile) ? (
        <section className="section section--ink" aria-label="Featured services">
          <div className="wrap grid grid--2">
            {experience ? (
              <FeatureBox
                kicker={experience.title}
                title={experience.subtitle}
                body={experience.description}
                image={undefined}
                href="/domain-expertise"
                cta="Explore expertise"
              />
            ) : null}
            {agile ? (
              <FeatureBox
                kicker={agile.title}
                title={agile.subtitle}
                body={agile.description}
                image={agile.image}
                href="/case-studies"
                cta="See case studies"
              />
            ) : null}
          </div>
        </section>
      ) : null}

      {!loading && !error && highlights.length > 0 ? (
        <section className="section section--ink-2" aria-labelledby="explorer-title">
          <div className="wrap">
            <div className="intro-head">
              <p className="eyebrow">
                <span className="eyebrow__index">02</span>
                {primary?.title || "Explorer"}
              </p>
              <SplitHeading as="h2" className="h2" options={{ type: "lines", when: "scroll" }}>
                <span id="explorer-title">{primary?.subtitle || "Explore the solution"}</span>
              </SplitHeading>
            </div>

            <div role="tablist" aria-label="Service highlights" className="tabs" style={{ marginTop: "3rem" }}>
              {highlights.map((item, index) => {
                const selected = index === currentIndex;
                return (
                  <button
                    key={item?._id || `${item?.title}-${index}`}
                    ref={(el) => {
                      tabs.current[index] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`tab-${index}`}
                    aria-selected={selected}
                    aria-controls="tab-panel"
                    tabIndex={selected ? 0 : -1}
                    className="tabs__tab"
                    onClick={() => setActiveTitle(item?.title || "")}
                    onKeyDown={(e) => onTabKey(e, index)}
                  >
                    <span className="mono">{String(index + 1).padStart(2, "0")}</span> {item?.title}
                  </button>
                );
              })}
            </div>

            {current ? (
              <div ref={panel} id="tab-panel" role="tabpanel" aria-labelledby={`tab-${currentIndex}`} className="tabs__panel">
                <div className="tabs__media">
                  <FrameImage src={current.image} alt={current.title || ""} aspect="tall" />
                </div>
                <div className="tabs__copy">
                  <span className="mono muted">
                    {String(currentIndex + 1).padStart(2, "0")}. {current.title}
                  </span>
                  <h3 className="h3">{current.title}</h3>
                  <p className="lede">{current.description}</p>
                  {current.description2 ? <p className="muted">{current.description2}</p> : null}
                  {current.link ? (
                    <Link href={hrefFor(current.link)} className="text-link" {...externalProps(hrefFor(current.link))}>
                      Learn more <Icon name="arrow" />
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {!loading && !error && qa ? (
        <section className="section section--bone" aria-labelledby="qa-title">
          <div className="wrap split split--wide-left">
            <FrameImage src={qa.image} alt={qa.title || "Quality assurance"} aspect="tall" direction="left" />
            <div>
              <p className="eyebrow">
                <span className="eyebrow__index">03</span>
                {qa.title}
              </p>
              <SplitHeading as="h2" className="h2" options={{ type: "lines", when: "scroll" }}>
                <span id="qa-title">{qa.subtitle}</span>
              </SplitHeading>
              <p className="body" style={{ marginTop: "2rem" }}>{qa.description}</p>
            </div>
          </div>
        </section>
      ) : null}

      <Blogs limit={3} />
    </>
  );
}

function FeatureBox({
  kicker,
  title,
  body,
  image,
  href,
  cta,
}: {
  kicker?: string;
  title?: string;
  body?: string;
  image?: string;
  href: string;
  cta: string;
}) {
  return (
    <article className="feature" data-reveal-item>
      {image ? <FrameImage src={image} alt="" aspect="wide" /> : null}
      <span className="note">{kicker}</span>
      <h3 className="h3">{title}</h3>
      <p className="muted">{body}</p>
      <Link href={href} className="text-link">
        {cta} <Icon name="arrow" />
      </Link>
    </article>
  );
}

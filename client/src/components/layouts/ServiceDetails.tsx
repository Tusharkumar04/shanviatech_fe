"use client";

import { useMemo } from "react";
import { useServicesData } from "@/context/ServiceContext";
import Opener from "@/components/ui/Opener";
import FrameImage from "@/components/ui/FrameImage";
import SplitHeading from "@/components/ui/SplitHeading";
import RevealGroup from "@/components/ui/RevealGroup";
import Link from "next/link";
import { ErrorState, LoadingState, EmptyState } from "@/components/ui/StatePanels";
import Icon from "@/components/ui/Icon";

interface ServiceDetailsProps {
  slug: string;
}

/**
 * One service as a sequence of scenes. The CMS highlights are read by sorted
 * position: 0 = intro, 1 = full-bleed band, 2 = pull quote, 3+ = detail cards.
 */
export default function ServiceDetails({ slug }: ServiceDetailsProps) {
  const { serviceData, loading, error } = useServicesData();

  const selected = useMemo(
    () => serviceData?.services?.find((item) => item?.slug === slug),
    [serviceData, slug],
  );

  if (loading) return <div className="wrap section"><LoadingState label="Loading service" /></div>;
  if (error) return <div className="wrap section"><ErrorState message={error} /></div>;
  if (!selected) {
    return (
      <div className="wrap section">
        <EmptyState title="Service not found." action={{ href: "/services", label: "Back to all services" }} />
      </div>
    );
  }

  const name = selected.name || selected.title || "Service";
  const highlights = [...(selected.highlights ?? [])].sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));
  const [intro, band, quote, ...details] = highlights;
  const tech: string[] = Array.isArray(selected.tech) ? selected.tech : [];

  return (
    <>
      <Opener crumbs={[{ label: "Services", href: "/services" }, { label: name }]} title={name} />

      <section className="section section--bone" aria-label="Overview">
        <div className="wrap split">
          <div>
            <p className="eyebrow">
              <span className="eyebrow__index">01</span>
              {intro?.title || "Overview"}
            </p>
            <SplitHeading as="h2" className="h2" options={{ type: "lines", when: "scroll" }}>
              <span>{intro?.title}</span>
            </SplitHeading>
            {intro?.description ? (
              <div className="body rich" style={{ marginTop: "2rem" }} dangerouslySetInnerHTML={{ __html: intro.description }} />
            ) : null}
            {tech.length ? (
              <ul className="chips" aria-label="Technologies">
                {tech.map((item, index) => (
                  <li key={`${item}-${index}`} className="chip">{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="split" style={{ gridTemplateColumns: "1fr 1fr", gap: "var(--gutter)" }}>
            <FrameImage src={intro?.image?.[0] ?? selected.image} alt={intro?.title || name} aspect="tall" tilt parallax={0.06} />
            <FrameImage src={intro?.image?.[1] || intro?.image?.[0]} alt="" aspect="tall" direction="right" />
          </div>
        </div>
      </section>

      {band ? (
        <section className="band" aria-labelledby="band-title">
          <FrameImage
            src={band.image?.[0] || selected.image}
            alt=""
            aspect="cinema"
            parallax={0.18}
            className="band__media"
          />
          <div className="band__copy wrap">
            <SplitHeading as="h2" className="h2" options={{ type: "lines", when: "scroll" }}>
              <span id="band-title">{band.title}</span>
            </SplitHeading>
            <div className="body rich" dangerouslySetInnerHTML={{ __html: band.description || "" }} />
          </div>
        </section>
      ) : null}

      {quote ? (
        <section className="section section--ink" aria-label="Key point">
          <div className="wrap split split--wide-right">
            <FrameImage src={quote.image?.[0] || selected.image} alt={quote.title || name} aspect="tall" direction="left" />
            <blockquote style={{ margin: 0 }}>
              <Icon name="quote" className="quote__mark" />
              <p className="statement" style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)" }}>{quote.title}</p>
              <div className="body rich" style={{ marginTop: "1.5rem" }} dangerouslySetInnerHTML={{ __html: quote.description || "" }} />
            </blockquote>
          </div>
        </section>
      ) : null}

      {details.length ? (
        <section className="section section--bone" aria-label="Details">
          <div className="wrap">
            <RevealGroup className="grid grid--4">
              {details.map((item, i) => (
                <article key={item?._id || i} className="stat card" data-reveal-item>
                  <span className="mono muted">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="h4">{item?.title}</h3>
                  <div className="body rich" dangerouslySetInnerHTML={{ __html: item?.description || "" }} />
                </article>
              ))}
            </RevealGroup>
          </div>
        </section>
      ) : null}

      <section className="section section--ink-2" aria-label="Next steps">
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
          <p className="h3" style={{ margin: 0 }}>Ready to talk about {name}?</p>
          <Link href="/reach-us" className="btn btn--signal">
            Start a conversation <Icon name="arrow" className="btn__arrow" />
          </Link>
        </div>
      </section>
    </>
  );
}

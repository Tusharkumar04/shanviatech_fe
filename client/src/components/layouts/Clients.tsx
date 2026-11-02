"use client";

import Link from "next/link";
import { getCmsApiCall } from "@/services/api/cmsApi";
import { useApi } from "@/hooks/useApi";
import Opener from "@/components/ui/Opener";
import FrameImage from "@/components/ui/FrameImage";
import Icon from "@/components/ui/Icon";
import SplitHeading from "@/components/ui/SplitHeading";
import { ErrorState, LoadingState, EmptyState } from "@/components/ui/StatePanels";
import { hrefFor, externalProps } from "@/utils/href";

interface ClientSectionData {
  image?: string;
  title?: string;
  description?: string;
  key_points?: string[];
  link?: string;
  button_title?: string;
}

/** Client stories: a single feature with key points and a call to action. */
export default function Clients() {
  const { data, loading, error, reload } = useApi<{ client?: ClientSectionData }>(
    () => getCmsApiCall() as Promise<{ client?: ClientSectionData }>,
    [],
    "Unable to load client stories.",
  );
  const section = data?.client ?? null;

  if (loading) return <div className="wrap section"><LoadingState label="Loading" /></div>;
  if (error) return <div className="wrap section"><ErrorState message={error} onRetry={reload} /></div>;
  if (!section) return <div className="wrap section"><EmptyState title="No client stories published yet." /></div>;

  const href = hrefFor(section.link);

  return (
    <>
      <Opener crumbs={[{ label: "Client stories" }]} title={section.title || "Client stories"} lede={section.description} />

      <section className="section section--ink" aria-label="Highlights">
        <div className="wrap split">
          <FrameImage src={section.image} alt={section.title || ""} aspect="tall" direction="left" parallax={0.06} />
          <div>
            <p className="eyebrow">
              <span className="eyebrow__index">01</span>
              What we deliver
            </p>
            <SplitHeading as="h2" className="h2" options={{ type: "lines", when: "scroll" }}>
              <span>{section.title}</span>
            </SplitHeading>
            {section.key_points?.length ? (
              <ul className="ticks" style={{ marginTop: "2rem" }}>
                {section.key_points.map((point, i) => (
                  <li key={`${point}-${i}`}>{point}</li>
                ))}
              </ul>
            ) : null}
            {section.link && section.button_title ? (
              <div style={{ marginTop: "2.5rem" }}>
                <Link href={href} className="btn" {...externalProps(href)}>
                  {section.button_title} <Icon name="arrow" className="btn__arrow" />
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { getAboutApiCall } from "@/services/api/aboutApi";
import { useApi } from "@/hooks/useApi";
import Opener from "@/components/ui/Opener";
import ScrubStatement from "@/components/ui/ScrubStatement";
import SplitHeading from "@/components/ui/SplitHeading";
import RevealGroup from "@/components/ui/RevealGroup";
import { ErrorState, LoadingState, EmptyState } from "@/components/ui/StatePanels";

interface AboutJourneyItem {
  _id?: string;
  year?: string | number;
  subtitle?: string;
  title?: string;
  description?: string;
}

interface AboutViewData {
  title?: string;
  subtitle?: string;
  description?: string;
  our_journey?: AboutJourneyItem[];
}

/**
 * About: a single statement, then the company journey as a vertical timeline
 * that draws its spine as you scroll.
 */
export default function About() {
  const { data, loading, error, reload } = useApi<AboutViewData>(
    () => getAboutApiCall() as Promise<AboutViewData>,
    [],
    "Unable to load the about page.",
  );

  if (loading) return <div className="wrap section"><LoadingState label="Loading about" /></div>;
  if (error) return <div className="wrap section"><ErrorState message={error} onRetry={reload} /></div>;
  if (!data) return <div className="wrap section"><EmptyState title="Nothing to show yet." /></div>;

  const journey = (data.our_journey ?? []).filter(Boolean);

  return (
    <>
      <Opener crumbs={[{ label: "About" }]} title={data.title || "About us"} lede={data.subtitle} />

      {data.description ? (
        <section className="section section--bone" aria-label="Overview">
          <div className="wrap">
            <ScrubStatement text={data.description} />
          </div>
        </section>
      ) : null}

      {journey.length ? (
        <section className="section section--ink" aria-labelledby="journey-title">
          <div className="wrap">
            <p className="eyebrow">
              <span className="eyebrow__index">01</span>
              Our journey
            </p>
            <SplitHeading as="h2" className="h2" options={{ type: "lines", when: "scroll" }}>
              <span id="journey-title">How we got here</span>
            </SplitHeading>

            <RevealGroup as="ol" className="timeline">
              {journey.map((item, index) => (
                <li key={item._id || index} className="timeline__item" data-reveal-item style={{ listStyle: "none" }}>
                  <span className="timeline__year">{item.year}</span>
                  <div>
                    {item.subtitle ? <span className="note">{item.subtitle}</span> : null}
                    <h3 className="h3" style={{ margin: "0.5rem 0 0.75rem" }}>{item.title}</h3>
                    {item.description ? <p className="muted" style={{ margin: 0 }}>{item.description}</p> : null}
                  </div>
                </li>
              ))}
            </RevealGroup>
          </div>
        </section>
      ) : null}
    </>
  );
}

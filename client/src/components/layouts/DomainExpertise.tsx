"use client";

import { useMemo } from "react";
import { getIndustriesApiCall } from "@/services/api/industriesApi";
import { useApi } from "@/hooks/useApi";
import Opener from "@/components/ui/Opener";
import FrameImage from "@/components/ui/FrameImage";
import RevealGroup from "@/components/ui/RevealGroup";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/StatePanels";

interface IndustryItem {
  _id?: string;
  title?: string;
  description?: string;
  image?: string;
  order?: number;
}

interface IndustryData {
  items?: IndustryItem[];
}

/** Industries and domain expertise as a responsive card grid. */
export default function DomainExpertise() {
  const { data, loading, error, reload } = useApi<IndustryData>(
    () => getIndustriesApiCall() as Promise<IndustryData>,
    [],
    "Unable to load domain expertise.",
  );
  const items = useMemo(
    () => [...(data?.items ?? [])].filter(Boolean).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [data],
  );

  return (
    <>
      <Opener crumbs={[{ label: "Domain expertise" }]} title="Domain expertise" lede="Deep knowledge of the industries we build for." />

      <section className="section section--bone" aria-label="Industries">
        <div className="wrap">
          {loading ? <LoadingState label="Loading industries" /> : null}
          {!loading && error ? <ErrorState message={error} onRetry={reload} /> : null}
          {!loading && !error && items.length === 0 ? <EmptyState title="No industries published yet." /> : null}
          {!loading && !error && items.length > 0 ? (
            <RevealGroup as="ul" className="grid grid--3">
              {items.map((item, index) => (
                <li key={item._id || index} className="card" data-reveal-item style={{ listStyle: "none" }}>
                  <FrameImage src={item.image} alt={item.title || ""} aspect="wide" tilt />
                  <span className="mono muted">{String(index + 1).padStart(2, "0")}</span>
                  <h2 className="h3" style={{ fontSize: "clamp(1.4rem, 2vw, 1.8rem)", margin: 0 }}>{item.title}</h2>
                  {item.description ? <p className="muted" style={{ margin: 0 }}>{item.description}</p> : null}
                </li>
              ))}
            </RevealGroup>
          ) : null}
        </div>
      </section>
    </>
  );
}

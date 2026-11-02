"use client";

import { useMemo } from "react";
import { getProjectsApiCall } from "@/services/api/projectApi";
import { useApi } from "@/hooks/useApi";
import FrameImage from "@/components/ui/FrameImage";
import SplitHeading from "@/components/ui/SplitHeading";
import RevealGroup from "@/components/ui/RevealGroup";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/StatePanels";

/** Portfolio of projects, in CMS order. Tilt and reveal are shared with the case list. */
export default function Projects() {
  const { data, loading, error, reload } = useApi(getProjectsApiCall, [], "Unable to load projects.");
  const items = useMemo(
    () => [...(data?.items ?? [])].filter(Boolean).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [data],
  );

  return (
    <section className="section section--ink-2" aria-labelledby="projects-title">
      <div className="orbs" aria-hidden="true"><i /><i /><i /></div>
      <div className="wrap">
        <p className="eyebrow">
          <span className="eyebrow__index">02</span>
          Portfolio
        </p>
        <SplitHeading as="h2" className="h2" options={{ type: "lines", when: "scroll" }}>
          <span id="projects-title">Selected projects</span>
        </SplitHeading>

        {loading ? <LoadingState label="Loading projects" /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={reload} /> : null}
        {!loading && !error && items.length === 0 ? <EmptyState title="No projects published yet." /> : null}
        {!loading && !error && items.length > 0 ? (
          <RevealGroup as="ul" className="grid grid--3" >
            {items.map((item, index) => (
              <li key={item._id || index} className="card project" data-reveal-item style={{ listStyle: "none" }}>
                <FrameImage src={item.image} alt={item.title || ""} aspect="wide" tilt />
                <span className="mono muted">{String(index + 1).padStart(2, "0")}{item.subtitle ? ` · ${item.subtitle}` : ""}</span>
                <h3 className="h4" style={{ margin: 0 }}>{item.title}</h3>
                {item.description ? <p className="muted" style={{ margin: 0 }}>{item.description}</p> : null}
              </li>
            ))}
          </RevealGroup>
        ) : null}
      </div>
    </section>
  );
}

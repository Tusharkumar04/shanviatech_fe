"use client";

import { useMemo } from "react";
import { getCaseStudiesApiCall } from "@/services/api/caseStudiesApi";
import { useApi } from "@/hooks/useApi";
import Opener from "@/components/ui/Opener";
import FrameImage from "@/components/ui/FrameImage";
import SplitHeading from "@/components/ui/SplitHeading";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/StatePanels";
import Projects from "./Projects";

interface CaseStudyItem {
  _id?: string;
  title?: string;
  description?: string;
  image?: string;
  order?: number;
}

interface CaseStudiesPageData {
  items?: CaseStudyItem[];
}

/**
 * Case studies as alternating full-width scenes. Each row reveals its image
 * with a clip and sticks the copy beside it on wide screens.
 */
export default function CaseStudies() {
  const { data, loading, error, reload } = useApi<CaseStudiesPageData>(
    () => getCaseStudiesApiCall() as Promise<CaseStudiesPageData>,
    [],
    "Unable to load case studies.",
  );
  const items = useMemo(
    () => [...(data?.items ?? [])].filter(Boolean).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [data],
  );

  return (
    <>
      <Opener crumbs={[{ label: "Case studies" }]} title="Case studies" lede="Selected work, from first brief to production." />

      <section className="section section--bone" aria-label="Case studies">
        <div className="wrap">
          {loading ? <LoadingState label="Loading case studies" /> : null}
          {!loading && error ? <ErrorState message={error} onRetry={reload} /> : null}
          {!loading && !error && items.length === 0 ? <EmptyState title="No case studies published yet." /> : null}

          {!loading && !error
            ? items.map((item, index) => (
                <article
                  key={item._id || index}
                  className={`case ${index % 2 ? "case--flip" : ""}`}
                  aria-labelledby={`case-${index}`}
                >
                  <div>
                    <FrameImage src={item.image} alt="" aspect="wide" direction={index % 2 ? "right" : "left"} tilt />
                  </div>
                  <div>
                    <span className="mono muted">{String(index + 1).padStart(2, "0")}</span>
                    <SplitHeading as="h2" className="h2" options={{ type: "lines", when: "scroll" }}>
                      <span id={`case-${index}`}>{item.title}</span>
                    </SplitHeading>
                    {item.description ? <p className="lede">{item.description}</p> : null}
                  </div>
                </article>
              ))
            : null}
        </div>
      </section>
      <Projects />
    </>
  );
}

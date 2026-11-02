"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getExpertiseApiCall } from "@/services/api/expertiseApi";
import { useApi } from "@/hooks/useApi";
import Opener from "@/components/ui/Opener";
import FrameImage from "@/components/ui/FrameImage";
import Icon from "@/components/ui/Icon";
import SplitHeading from "@/components/ui/SplitHeading";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/StatePanels";
import { hrefFor, externalProps } from "@/utils/href";

interface ExpertiseItem {
  _id?: string;
  title?: string;
  link?: string;
  description?: string;
  image?: string;
  order?: number;
  tech?: string[] | unknown;
}

interface ExpertiseData {
  items?: ExpertiseItem[];
}

/** Technology expertise: each practice as an alternating scene with its stack as chips. */
export default function Technology() {
  const { data, loading, error, reload } = useApi<ExpertiseData>(
    () => getExpertiseApiCall() as Promise<ExpertiseData>,
    [],
    "Unable to load technology expertise.",
  );
  const items = useMemo(
    () => [...(data?.items ?? [])].filter(Boolean).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [data],
  );

  return (
    <>
      <Opener crumbs={[{ label: "Technology" }]} title="Technology expertise" lede="The stacks we use to ship reliable products." />

      <section className="section section--bone" aria-label="Technology">
        <div className="wrap">
          {loading ? <LoadingState label="Loading technology" /> : null}
          {!loading && error ? <ErrorState message={error} onRetry={reload} /> : null}
          {!loading && !error && items.length === 0 ? <EmptyState title="No technology expertise published yet." /> : null}

          {!loading && !error
            ? items.map((item, index) => {
                const href = hrefFor(item.link);
                const tech = Array.isArray(item.tech) ? (item.tech as string[]) : [];
                return (
                  <article key={item._id || index} className={`case ${index % 2 ? "case--flip" : ""}`} aria-labelledby={`tech-${index}`}>
                    <div>
                      <FrameImage src={item.image} alt="" aspect="wide" direction={index % 2 ? "right" : "left"} tilt />
                    </div>
                    <div>
                      <span className="mono muted">{String(index + 1).padStart(2, "0")}</span>
                      <SplitHeading as="h2" className="h2" options={{ type: "lines", when: "scroll" }}>
                        <span id={`tech-${index}`}>{item.title}</span>
                      </SplitHeading>
                      {item.description ? <p className="lede">{item.description}</p> : null}
                      {tech.length ? (
                        <ul className="chips" aria-label={`${item.title} technologies`}>
                          {tech.map((name, i) => (
                            <li key={`${name}-${i}`} className="chip">{name}</li>
                          ))}
                        </ul>
                      ) : null}
                      {item.link ? (
                        <Link href={href} className="text-link" style={{ marginTop: "2rem" }} {...externalProps(href)}>
                          Learn more <Icon name="arrow" />
                        </Link>
                      ) : null}
                    </div>
                  </article>
                );
              })
            : null}
        </div>
      </section>
    </>
  );
}

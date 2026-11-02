"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";

export interface JobItem {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  location?: string;
  experience?: string;
  salary?: string;
  priority?: string;
  skills?: string[];
  soft_skills?: string[];
  responsibilities?: string[];
  requirements?: string[];
  we_offer?: string[];
}

const SECTIONS: Array<{ key: keyof JobItem; label: string }> = [
  { key: "skills", label: "Skills" },
  { key: "soft_skills", label: "Soft skills" },
  { key: "responsibilities", label: "Responsibilities" },
  { key: "requirements", label: "Requirements" },
  { key: "we_offer", label: "We offer" },
];

/**
 * Open positions as an accordion. Only one job is open at a time. Panels
 * animate with the grid-rows trick (GPU-friendly, no height measuring).
 */
export default function CareerAccordion({ jobData }: { jobData: { items?: JobItem[] } | null }) {
  const jobs = useMemo(() => (jobData?.items ?? []).filter(Boolean), [jobData]);
  const [activeIndex, setActiveIndex] = useState(0);

  if (jobs.length === 0) return null;

  return (
    <ol className="jobs" style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {jobs.map((job, index) => {
        const rawId = String(job._id ?? job.id ?? `job-${index}`);
        const panelId = `job-panel-${rawId.replace(/[^a-zA-Z0-9\-_:.]/g, "") || index}`;
        const buttonId = `${panelId}-button`;
        const isOpen = activeIndex === index;

        return (
          <li key={rawId} className={`job ${isOpen ? "is-open" : ""}`} data-reveal-item>
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                id={buttonId}
                className="job__toggle"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setActiveIndex((prev) => (prev === index ? -1 : index))}
              >
                <span className="mono muted">{String(index + 1).padStart(2, "0")}</span>
                <span className="job__title">{job.title}</span>
                <Icon name={isOpen ? "minus" : "plus"} />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} className="job__panel" hidden={!isOpen}>
              <div className="job__inner">
                {job.description ? <p className="lede" style={{ fontSize: "1.05rem" }}>{job.description}</p> : null}
                <dl className="job__meta">
                  {job.location ? (<><dt>Location</dt><dd>{job.location}</dd></>) : null}
                  {job.experience ? (<><dt>Experience</dt><dd>{job.experience}</dd></>) : null}
                  {job.salary ? (<><dt>Salary</dt><dd>{job.salary}</dd></>) : null}
                  {job.priority ? (<><dt>Priority</dt><dd>{job.priority}</dd></>) : null}
                </dl>
                {SECTIONS.map(({ key, label }) => {
                  const list = job[key] as string[] | undefined;
                  if (!list?.length) return null;
                  return (
                    <div key={key} style={{ marginTop: "1.25rem" }}>
                      <h4 className="note" style={{ margin: "0 0 0.5rem" }}>{label}</h4>
                      <ul className="ticks">
                        {list.map((item, i) => (
                          <li key={`${String(key)}-${i}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

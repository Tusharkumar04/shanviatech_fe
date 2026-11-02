"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { getLeadershipApiCall } from "@/services/api/leadershipApi";
import { useApi } from "@/hooks/useApi";
import Opener from "@/components/ui/Opener";
import FrameImage from "@/components/ui/FrameImage";
import RevealGroup from "@/components/ui/RevealGroup";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/StatePanels";

interface LeaderMember {
  _id?: string;
  name?: string;
  designation?: string;
  image?: string;
  order?: number;
  qualification?: string;
}

interface LeaderSection {
  _id?: string;
  title?: string;
  subtitle?: string;
  members?: LeaderMember[];
}

interface LeadershipViewData {
  items?: LeaderSection[];
}

/**
 * Leadership: one section per tab (for example, board or management). Tabs
 * are real tabs with arrow-key navigation.
 */
export default function Leadership() {
  const { data, loading, error, reload } = useApi<LeadershipViewData>(
    () => getLeadershipApiCall() as Promise<LeadershipViewData>,
    [],
    "Unable to load leadership.",
  );
  const sections = useMemo(() => (data?.items ?? []).filter(Boolean), [data]);
  const [pickedTitle, setPickedTitle] = useState("");
  const active = sections.find((s) => s.title === pickedTitle) ?? sections[0];
  const setActiveTitle = setPickedTitle;
  const members = useMemo(
    () => [...(active?.members ?? [])].filter(Boolean).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [active],
  );

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = sections[(index + dir + sections.length) % sections.length];
    if (next?.title) {
      setActiveTitle(next.title);
      document.getElementById(`leader-tab-${(index + dir + sections.length) % sections.length}`)?.focus();
    }
  };

  return (
    <>
      <Opener crumbs={[{ label: "Leadership" }]} title="Our leadership" />

      <section className="section section--bone" aria-label="Leadership team">
        <div className="wrap">
          {loading ? <LoadingState label="Loading leadership" /> : null}
          {!loading && error ? <ErrorState message={error} onRetry={reload} /> : null}
          {!loading && !error && sections.length === 0 ? <EmptyState title="No leadership profiles published yet." /> : null}

          {!loading && !error && sections.length > 0 ? (
            <>
              <div role="tablist" aria-label="Leadership groups" className="tabs">
                {sections.map((section, index) => {
                  const selected = section.title === active?.title;
                  return (
                    <button
                      key={section._id || index}
                      id={`leader-tab-${index}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="leader-panel"
                      tabIndex={selected ? 0 : -1}
                      className="tabs__tab"
                      onClick={() => setActiveTitle(section.title || "")}
                      onKeyDown={(e) => onTabKey(e, index)}
                    >
                      {section.title}
                    </button>
                  );
                })}
              </div>

              <div id="leader-panel" role="tabpanel" aria-labelledby={`leader-tab-${sections.indexOf(active!)}`} style={{ marginTop: "3rem" }}>
                {active?.subtitle ? <p className="lede" style={{ marginBottom: "2.5rem" }}>{active.subtitle}</p> : null}
                <RevealGroup as="ul" className="team-grid">
                  {members.map((member, index) => (
                    <li key={member._id || index} className="team-card card" data-reveal-item style={{ listStyle: "none" }}>
                      <FrameImage src={member.image} alt={member.name || ""} aspect="tall" tilt />
                      <h3 className="h4" style={{ margin: 0 }}>{member.name}</h3>
                      {member.designation ? <p className="muted" style={{ margin: 0 }}>{member.designation}</p> : null}
                      {member.qualification ? <p className="note" style={{ margin: 0 }}>{member.qualification}</p> : null}
                    </li>
                  ))}
                </RevealGroup>
              </div>
            </>
          ) : null}
        </div>
      </section>
    </>
  );
}

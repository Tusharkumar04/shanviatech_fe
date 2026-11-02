"use client";

import { useEffect, useState } from "react";
import { getLegalByTypeApiCall, type LegalItem } from "@/services/api/LegalApi";
import Opener from "@/components/ui/Opener";
import { ErrorState, LoadingState, EmptyState } from "@/components/ui/StatePanels";

interface LegalDetailsProps {
  type: string;
}

/**
 * Legal document reader: a calm, single-column page with generous measure.
 * The document body is CMS HTML, as it was before.
 */
export default function LegalDetails({ type }: LegalDetailsProps) {
  const [legal, setLegal] = useState<LegalItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getLegalByTypeApiCall(type);
        if (!cancelled) setLegal(response);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unable to load this document.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [type, attempt]);

  if (loading) return <div className="wrap section"><LoadingState label="Loading document" /></div>;
  if (error) return <div className="wrap section"><ErrorState message={error} onRetry={() => setAttempt((n) => n + 1)} /></div>;
  if (!legal) {
    return (
      <div className="wrap section">
        <EmptyState title="Document not found." action={{ href: "/", label: "Back to home" }} />
      </div>
    );
  }

  return (
    <>
      <Opener crumbs={[{ label: legal.title || "Legal" }]} title={legal.title || "Legal"} />
      <section className="section section--bone" aria-label="Document">
        <article className="prose wrap">
          {legal.description ? <p className="lede">{legal.description}</p> : null}
          {legal.content ? <div dangerouslySetInnerHTML={{ __html: legal.content }} /> : null}
        </article>
      </section>
    </>
  );
}

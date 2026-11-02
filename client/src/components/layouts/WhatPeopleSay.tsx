"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { useApi } from "@/hooks/useApi";
import { getTestimonialsApiCall, type TestimonialItem, type TestimonialsData } from "@/services/api/testimonialsApi";
import SplitHeading from "@/components/ui/SplitHeading";
import Icon from "@/components/ui/Icon";
import { LoadingState, ErrorState } from "@/components/ui/StatePanels";

/**
 * Testimonials as a draggable rail. Mouse users drag (the cursor says so);
 * touch uses native scroll-snap; keyboard users get real buttons.
 */
export default function WhatPeopleSay() {
  const { data, loading, error, reload } = useApi<TestimonialsData>(getTestimonialsApiCall, [], "Unable to load testimonials.");
  const rail = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; id: number } | null>(null);

  const items = (data?.items ?? []).filter(Boolean);

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !rail.current) return;
    drag.current = { x: e.clientX, left: rail.current.scrollLeft, id: e.pointerId };
    rail.current.classList.add("is-dragging");
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current || !rail.current) return;
    rail.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const onUp = () => {
    drag.current = null;
    rail.current?.classList.remove("is-dragging");
  };

  const step = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 520), behavior: "smooth" });
  };

  return (
    <section className="section section--ink" aria-labelledby="testimonials-title">
      <div className="orbs" aria-hidden="true"><i /><i /><i /></div>
      <div className="wrap">
        <div className="intro-head intro-head--row" style={{ alignItems: "end" }}>
          <div>
            <p className="eyebrow">
              <span className="eyebrow__index">06</span>
              Testimonials
            </p>
            <SplitHeading as="h2" className="h2" options={{ type: "lines", when: "scroll" }}>
              <span id="testimonials-title">What people say</span>
            </SplitHeading>
          </div>
          {items.length > 1 ? (
            <div className="hero__controls" role="group" aria-label="Testimonial controls" style={{ justifySelf: "end" }}>
              <button type="button" className="hero__dot" aria-label="Previous testimonial" onClick={() => step(-1)}>
                <Icon name="prev" />
              </button>
              <button type="button" className="hero__dot hero__dot--next" aria-label="Next testimonial" onClick={() => step(1)}>
                <Icon name="prev" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {loading ? <LoadingState label="Loading testimonials" /> : null}
      {error ? (
        <div className="wrap">
          <ErrorState message={error} onRetry={reload} />
        </div>
      ) : null}

      {!loading && !error && items.length ? (
        <div
          ref={rail}
          className="quote-rail"
          data-cursor="drag"
          data-cursor-label="Drag"
          tabIndex={0}
          role="region"
          aria-label="Testimonials, scroll horizontally"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          onPointerCancel={onUp}
        >
          {items.map((item, i) => (
            <Quote key={item._id || `${item.author_name || "quote"}-${i}`} item={item} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function Quote({ item }: { item: TestimonialItem }) {
  return (
    <figure className="quote">
      <Icon name="quote" className="quote__mark" />
      <blockquote style={{ margin: 0 }}>
        <p className="quote__text">{item.description}</p>
      </blockquote>
      <figcaption className="quote__who">
        {item.author_image ? (
          <img className="quote__avatar" src={item.author_image} alt={item.author_name || ""} loading="lazy" decoding="async" />
        ) : (
          <span className="quote__avatar quote__avatar--empty" aria-hidden="true" />
        )}
        <span>
          <strong style={{ display: "block", fontWeight: 600 }}>{item.author_name}</strong>
          <span className="muted" style={{ fontSize: "0.92rem" }}>{item.author_location}</span>
        </span>
      </figcaption>
    </figure>
  );
}


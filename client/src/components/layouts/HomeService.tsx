"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useServicesData } from "@/context/ServiceContext";
import ServiceCard from "./ServiceCard";
import SplitHeading from "@/components/ui/SplitHeading";
import Icon from "@/components/ui/Icon";
import { ensureGsap, gsap } from "@/motion/gsap";
import { LoadingState, ErrorState } from "@/components/ui/StatePanels";

const RAIL_LIMIT = 6;

/**
 * Scene 03: services as a horizontal rail. On desktop, the section pins while
 * the rail travels sideways under the scroll. Everywhere else, the rail is a
 * plain stack so nothing depends on the pin.
 */
export default function HomeService() {
  const { serviceData, loading, error } = useServicesData();
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  const items = (serviceData?.services ?? [])
    .filter((item) => item?.show_in_page)
    .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
    .slice(0, RAIL_LIMIT);

  useEffect(() => {
    const pinEl = pin.current;
    const trackEl = track.current;
    if (!pinEl || !trackEl || !items.length) return;
    ensureGsap();

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1000px) and (prefers-reduced-motion: no-preference)", () => {
      pinEl.classList.add("is-pinned");
      const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);
      const tween = gsap.to(trackEl, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pinEl,
          start: "top top+=76",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        pinEl.classList.remove("is-pinned");
        gsap.set(trackEl, { clearProps: "transform" });
      };
    });
    return () => mm.revert();
  }, [items.length]);

  return (
    <section className="section section--ink-2" aria-labelledby="services-title">
      <div className="wrap">
        <div className="intro-head intro-head--row">
          <div>
            <p className="eyebrow">
              <span className="eyebrow__index">03</span>
              Our services
            </p>
            <SplitHeading as="h2" className="h2" options={{ type: "lines", when: "scroll" }}>
              <span id="services-title">Business &amp; technology, end to end</span>
            </SplitHeading>
          </div>
          <div style={{ display: "grid", gap: "1.25rem", justifyItems: "start" }}>
            <p className="lede" style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.35rem)" }}>
              As a leading provider of business and technology services.
            </p>
            <Link href="/services" className="text-link">
              All services <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </div>

      {loading ? <LoadingState label="Loading services" /> : null}
      {error ? <div className="wrap"><ErrorState message={error} /></div> : null}

      {!loading && !error ? (
        <div ref={pin} className="rail">
          <div ref={track} className="rail__track rail__track--cards" style={{ paddingInline: "var(--gutter)" }}>
            {items.map((item, index) => (
              <ServiceCard key={item._id || item.slug || index} item={item} index={index} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

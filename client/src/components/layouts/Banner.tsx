"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ParticleCanvas from "@/components/motion/ParticleCanvas";
import Icon from "@/components/ui/Icon";
import Magnetic from "@/components/ui/Magnetic";
import { LoadingState } from "@/components/ui/StatePanels";
import { ensureGsap, gsap } from "@/motion/gsap";
import { splitReveal } from "@/motion/splitText";
import { prefersReducedMotion } from "@/motion/reducedMotion";
import { useIntroDone } from "@/motion/hooks";
import { hrefFor, externalProps } from "@/utils/href";

export interface BannerItem {
  _id?: string;
  image?: string;
  subtitle?: string;
  title?: string;
  link?: string;
  button_title?: string;
}

const AUTOPLAY_SECONDS = 7;
const pad = (n: number) => String(n).padStart(2, "0");
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Hero carousel. Each slide's headline rises line by line, its picture opens
 * from a clip, and a hairline progress bar drives autoplay. Autoplay can be
 * paused, is off for reduced motion, and never starts before the intro ends.
 */
export default function Banner({
  banners,
  loading = false,
  error = "",
  onRetry,
}: {
  banners?: BannerItem[] | null;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}) {
  const slides = (banners ?? []).filter(Boolean);
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const introDone = useIntroDone();
  const reduced = typeof window !== "undefined" && prefersReducedMotion();

  const root = useRef<HTMLElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const titles = useRef<Array<HTMLElement | null>>([]);
  const frames = useRef<Array<HTMLDivElement | null>>([]);

  // Entrance: hide the hero's meta until the intro lifts, then fade it up.
  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    ensureGsap();
    const items = el.querySelectorAll("[data-hero-in]");
    if (!introDone) {
      gsap.set(items, { autoAlpha: 0, y: 24 });
      return;
    }
    if (reduced) {
      gsap.set(items, { autoAlpha: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(items, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: 0.12, delay: 0.1 });
    }, el);
    return () => ctx.revert();
  }, [introDone, reduced]);

  // Per-slide choreography: split headline + image clip reveal.
  useEffect(() => {
    if (!count || !introDone) return;
    const disposers: Array<() => void> = [];
    const title = titles.current[index];
    if (title) disposers.push(splitReveal(title, { type: "lines", duration: 1.2, stagger: 0.1 }));

    const frame = frames.current[index];
    if (frame && !reduced) {
      const img = frame.querySelector<HTMLElement>("img");
      const clip = gsap.fromTo(
        frame,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" },
      );
      const zoom = img ? gsap.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 2.4, ease: "expo.out" }) : null;
      disposers.push(() => {
        clip.kill();
        zoom?.kill();
      });
    }
    return () => disposers.forEach((d) => d());
  }, [index, count, introDone, reduced]);

  // Autoplay progress.
  useEffect(() => {
    const bar = progress.current;
    if (!bar || count < 2 || reduced || !introDone) return;
    ensureGsap();
    const t = gsap.fromTo(bar, { scaleX: 0 }, {
      scaleX: 1,
      duration: AUTOPLAY_SECONDS,
      ease: "none",
      onComplete: () => setIndex((i) => (i + 1) % count),
    });
    tween.current = t;
    if (!playing) t.pause();
    return () => {
      t.kill();
      tween.current = null;
    };
    // `playing` is applied in the effect below so toggling doesn't restart the timer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, count, introDone, reduced]);

  useEffect(() => {
    const t = tween.current;
    if (!t) return;
    if (playing) t.resume();
    else t.pause();
  }, [playing]);

  if (!count) {
    return (
      <section ref={root} className="hero section--ink" aria-label="Introduction">
        <ParticleCanvas className="hero__canvas" />
        <div className="hero__veil" aria-hidden="true" />
        <div className="wrap">
          <div className="hero__meta" data-hero-in>
            <span className="note">Digital engineering studio, Kolkata</span>
          </div>
          <h1 className="display" data-hero-in>
            Shanvia Tech <em>Solutions</em>
          </h1>
          <div className="hero__foot" data-hero-in>
            <Magnetic>
              <Link href="/services" className="btn btn--signal">
                Explore services <Icon name="arrow" className="btn__arrow" />
              </Link>
            </Magnetic>
            {loading ? <LoadingState label="Loading highlights" /> : null}
            {error && onRetry ? (
              <button type="button" className="text-link" onClick={onRetry}>
                Retry highlights <Icon name="arrow" />
              </button>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);

  return (
    <section ref={root} className="hero section--ink" aria-roledescription="carousel" aria-label="Featured highlights">
      <ParticleCanvas className="hero__canvas" />
      <div className="hero__veil" aria-hidden="true" />

      <div className="wrap">
        <div className="hero__meta" data-hero-in>
          <span className="note">Digital engineering studio, Kolkata</span>
          <span aria-live="off">
            {pad(index + 1)} / {pad(count)}
          </span>
        </div>

        <div className="split split--wide-left" style={{ alignItems: "end" }}>
          <div className="hero__slides">
            {slides.map((slide, i) => {
              const active = i === index;
              const href = hrefFor(slide.link);
              return (
                <div
                  key={slide._id || i}
                  className={`hero__slide ${active ? "is-active" : ""}`}
                  aria-hidden={!active}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}`}
                >
                  <p className="eyebrow" style={{ margin: 0 }}>
                    <span className="eyebrow__index">{pad(i + 1)}</span>
                    {slide.subtitle}
                  </p>
                  <h1
                    ref={(el) => {
                      titles.current[i] = el;
                    }}
                    className="display"
                    style={{ fontSize: "clamp(3rem, 8.4vw, 9.2rem)" }}
                  >
                    {slide.title}
                  </h1>
                  {slide.button_title && slide.link ? (
                    <div className="hero__sub" style={{ marginTop: "1rem" }}>
                      <Magnetic>
                        <Link
                          href={href}
                          tabIndex={active ? 0 : -1}
                          className="btn btn--signal"
                          {...externalProps(href)}
                        >
                          {slide.button_title} <Icon name="arrow" className="btn__arrow" />
                        </Link>
                      </Magnetic>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="hero__media" style={{ display: "grid" }}>
            {slides.map((slide, i) => (
              <div
                key={`${slide._id || i}-media`}
                ref={(el) => {
                  frames.current[i] = el;
                }}
                className={`frame frame--wide hero__image ${i === index ? "is-active" : ""}`}
                style={{ gridArea: "1 / 1", visibility: i === index ? "visible" : "hidden", opacity: i === index ? 1 : 0 }}
                data-cursor="view"
              >
                {slide.image ? (
                  <img
                    className="frame__media"
                    src={slide.image}
                    alt={slide.title || ""}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="hero__foot" data-hero-in>
          <div className="hero__controls" role="group" aria-label="Carousel controls">
            <button type="button" className="hero__dot" aria-label="Previous slide" onClick={() => go(-1)}>
              <Icon name="prev" />
            </button>
            <button type="button" className="hero__dot hero__dot--next" aria-label="Next slide" onClick={() => go(1)}>
              <Icon name="prev" />
            </button>
            <div className="hero__progress" aria-hidden="true">
              <span ref={progress} />
            </div>
            <button
              type="button"
              className="hero__dot"
              aria-label={playing ? "Pause autoplay" : "Play autoplay"}
              aria-pressed={!playing}
              onClick={() => setPlaying((p) => !p)}
            >
              {playing ? <span aria-hidden="true" style={{ fontSize: 11, letterSpacing: 2 }}>II</span> : <Icon name="play" />}
            </button>
          </div>
          <span className="mono muted hero__scroll">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}

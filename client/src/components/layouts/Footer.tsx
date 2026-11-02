"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useServicesData } from "@/context/ServiceContext";
import { getLegalApiCall, type LegalItem } from "@/services/api/LegalApi";
import { useMagnetic, useGroupReveal, useGsapScope } from "@/motion/hooks";
import { ensureGsap, gsap } from "@/motion/gsap";
import Icon from "@/components/ui/Icon";
import Magnetic from "@/components/ui/Magnetic";

export default function Footer() {
  const { siteData } = useSiteSettings();
  const { serviceData } = useServicesData();
  const [legal, setLegal] = useState<LegalItem[]>([]);

  const grid = useRef<HTMLDivElement>(null);
  const mega = useRef<HTMLParagraphElement>(null);
  const ctaBtn = useRef<HTMLAnchorElement>(null);

  useGroupReveal(grid, { selector: "[data-reveal-item]", y: 32, stagger: 0.07, start: "top 92%" });
  useGsapScope(
    mega,
    (el) => {
      ensureGsap();
      gsap.fromTo(el, { xPercent: 6 }, {
        xPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 },
      });
    },
    [],
  );
  useMagnetic(ctaBtn, 0.2);

  useEffect(() => {
    let alive = true;
    getLegalApiCall()
      .then((res) => {
        if (alive) setLegal(res?.items ?? []);
      })
      .catch((err) => console.error("Legal list error:", err));
    return () => {
      alive = false;
    };
  }, []);

  const services = (serviceData?.services ?? [])
    .filter((item) => item?.slug)
    .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0))
    .slice(0, 8);

  const primaryAddress = siteData?.addresses?.find((item) => item?.is_primary) ?? siteData?.addresses?.[0];
  const reading = (siteData?.intresting ?? []).filter(Boolean).slice(0, 5);
  const social = siteData?.social_links ?? {};
  const year = new Date().getFullYear();

  return (
    <footer className="footer" aria-labelledby="footer-cta-title">
      <div className="wrap footer__cta">
        <p className="eyebrow">
          <span className="eyebrow__index">→</span> Start a conversation
        </p>
        <h2 id="footer-cta-title" className="display footer__cta-title">
          Let&apos;s build what <em>comes next.</em>
        </h2>
        <div className="mt-m">
          <Magnetic>
            <Link ref={ctaBtn} href="/reach-us" className="btn btn--signal" style={{ minHeight: 64, padding: "1.2rem 2rem" }}>
              Reach us <Icon name="arrow" className="btn__arrow" />
            </Link>
          </Magnetic>
        </div>
      </div>

      <div className="wrap">
        <div ref={grid} className="footer__grid">
          <div data-reveal-item>
            <Link href="/" aria-label="Shanvia Tech Solutions home" style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
              {siteData?.logo ? (
                <img src={siteData.logo} alt="Shanvia Tech Solutions" style={{ height: 40, width: "auto", background: "var(--bone)", padding: "6px 10px", borderRadius: 2 }} />
              ) : (
                <span className="h4" style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 500 }}>
                  Shanvia<span style={{ color: "var(--signal)" }}>.</span>
                </span>
              )}
            </Link>
            {siteData?.description ? <p className="muted" style={{ marginTop: 20, maxWidth: "36ch" }}>{siteData.description}</p> : null}
            {siteData?.cin_no ? <p className="mono muted" style={{ marginTop: 20 }}>CIN {siteData.cin_no}</p> : null}
          </div>

          <div data-reveal-item>
            <p className="footer__title">Services</p>
            <ul className="footer__list">
              {services.map((service) => (
                <li key={service._id || service.slug}>
                  <Link href={`/service/${service.slug}`}>{service.name || service.title}</Link>
                </li>
              ))}
              {!services.length ? (
                <li>
                  <Link href="/services">All services</Link>
                </li>
              ) : null}
            </ul>
          </div>

          <div data-reveal-item>
            <p className="footer__title">Company</p>
            <ul className="footer__list">
              <li><Link href="/about">About us</Link></li>
              <li><Link href="/leadership">Leadership</Link></li>
              <li><Link href="/approach">Approach</Link></li>
              <li><Link href="/clients-stories">Clients &amp; stories</Link></li>
              <li><Link href="/career">Career</Link></li>
            </ul>
            <p className="footer__title" style={{ marginTop: 32 }}>Research</p>
            <ul className="footer__list">
              <li><Link href="/technology">Technologies</Link></li>
              <li><Link href="/enterprise-expertise">Enterprise expertise</Link></li>
              <li><Link href="/case-studies">Case studies</Link></li>
              <li><Link href="/products">Products</Link></li>
              <li><Link href="/blogs">Insight</Link></li>
            </ul>
          </div>

          <div data-reveal-item>
            <p className="footer__title">Contact</p>
            <ul className="footer__list">
              {siteData?.email ? (
                <li>
                  <a href={`mailto:${siteData.email}`}>{siteData.email}</a>
                </li>
              ) : null}
              {siteData?.mobile ? (
                <li>
                  <a href={`tel:+91${siteData.mobile}`}>+91 {siteData.mobile}</a>
                </li>
              ) : null}
            </ul>
            {(siteData?.peoples ?? []).length ? (
              <ul className="footer__list" style={{ marginTop: 24 }}>
                {(siteData?.peoples as Array<{ title?: string; email?: string; phone?: string }>).map((person, i) => (
                  <li key={`${person?.email ?? i}`}>
                    <span className="muted" style={{ display: "block", fontSize: "0.85rem" }}>{person?.title}</span>
                    {person?.email ? <a href={`mailto:${person.email}`}>{person.email}</a> : null}
                    {person?.phone ? <span style={{ display: "block" }}>{person.phone}</span> : null}
                  </li>
                ))}
              </ul>
            ) : null}
            {primaryAddress ? (
              <address className="muted" style={{ fontStyle: "normal", marginTop: 24, fontSize: "0.95rem" }}>
                <span className="mono" style={{ display: "block", marginBottom: 6 }}>
                  <Icon name="pin" /> {primaryAddress.city || "Head office"}
                </span>
                {[primaryAddress.locality, primaryAddress.city, primaryAddress.state, primaryAddress.country]
                  .filter(Boolean)
                  .join(", ")}
              </address>
            ) : null}
          </div>

          {reading.length ? (
            <div data-reveal-item>
              <p className="footer__title">Reading</p>
              <ul className="footer__list">
                {reading.map((read: { _id?: string; title?: string; url?: string }, i: number) => (
                  <li key={read._id || i}>
                    <a href={read.url || "#"}>{read.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <p ref={mega} className="footer__mega" aria-hidden="true">
          SHANVIA
        </p>
      </div>

      <div className="wrap footer__base">
        <span>© {year} Shanvia Tech Solutions Pvt. Ltd.</span>
        <nav aria-label="Legal" style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem 1.5rem" }}>
          {legal.map((item) => (
            <Link key={item._id || item.slug || item.type} href={item.type ? `/legal/${item.type}` : item.slug || "/"}>
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="footer__social">
          {social.linkedin ? (
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Icon name="linkedin" />
            </a>
          ) : null}
          {social.instagram ? (
            <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Icon name="instagram" />
            </a>
          ) : null}
          {social.facebook ? (
            <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Icon name="facebook" />
            </a>
          ) : null}
          {social.twitter ? (
            <a href={social.twitter} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
              <Icon name="twitter" />
            </a>
          ) : null}
          {social.youtube ? (
            <a href={social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <Icon name="youtube" />
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

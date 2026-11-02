"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useServicesData } from "@/context/ServiceContext";
import { ensureGsap, gsap, ScrollTrigger } from "@/motion/gsap";
import { lockScroll } from "@/motion/scroll";
import { prefersReducedMotion } from "@/motion/reducedMotion";
import { useMagnetic } from "@/motion/hooks";
import Icon from "@/components/ui/Icon";

interface NavGroup {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}

const STATIC_GROUPS: NavGroup[] = [
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Leadership", href: "/leadership" },
      { label: "Approach", href: "/approach" },
      { label: "Clients & stories", href: "/clients-stories" },
    ],
  },
  {
    title: "Research",
    links: [
      { label: "Technologies", href: "/technology" },
      { label: "Enterprise expertise", href: "/enterprise-expertise" },
      { label: "Case studies", href: "/case-studies" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Our products", href: "/products" },
      { label: "Career", href: "/career" },
      { label: "Insight", href: "/blogs" },
      { label: "Reach us", href: "/reach-us" },
    ],
  },
];

const PRIMARY = [
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Insight", href: "/blogs" },
  { label: "Career", href: "/career" },
];

export default function Header() {
  const { siteData } = useSiteSettings();
  const { serviceData } = useServicesData();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const unlock = useRef<(() => void) | null>(null);

  useMagnetic(ctaRef, 0.18);

  const services = (serviceData?.services ?? [])
    .filter((item) => item?.show_in_page && item?.slug)
    .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));

  const groups: NavGroup[] = [
    STATIC_GROUPS[0],
    {
      title: "Services",
      links: [
        { label: "All services", href: "/services" },
        ...services.map((service) => ({ label: service.name || service.title || service.slug || "", href: `/service/${service.slug}` })),
      ],
    },
    ...STATIC_GROUPS.slice(1),
  ];

  // Solid bar once the hero is left behind.
  useEffect(() => {
    if (!navRef.current) return;
    ensureGsap();
    const trigger = ScrollTrigger.create({
      start: "top -40",
      onToggle: (self) => navRef.current?.classList.toggle("is-solid", self.isActive),
    });
    return () => trigger.kill();
  }, []);

  // Full-screen index menu timeline (built once, played in both directions).
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    ensureGsap();
    const reduced = prefersReducedMotion();
    const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.inOut" } });
    tl.to(menu, { clipPath: "inset(0 0 0% 0)", duration: reduced ? 0.01 : 0.9, onStart: () => menu.classList.add("is-open") })
      .fromTo(
        menu.querySelectorAll("[data-menu-item]"),
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: reduced ? 0.01 : 0.9, stagger: 0.03, ease: "expo.out" },
        0.35,
      )
      .fromTo(menu.querySelectorAll("[data-menu-fade]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 0.6);
    menuTl.current = tl;
    return () => {
      tl.kill();
      menuTl.current = null;
    };
  }, []);

  useEffect(() => {
    const tl = menuTl.current;
    if (!tl) return;
    if (open) {
      unlock.current = lockScroll();
      tl.timeScale(1).play(0);
      const first = menuRef.current?.querySelector<HTMLElement>("a");
      window.setTimeout(() => first?.focus({ preventScroll: true }), 350);
    } else {
      tl.timeScale(1.6).reverse();
      const release = unlock.current;
      unlock.current = null;
      window.setTimeout(() => {
        release?.();
        menuRef.current?.classList.remove("is-open");
      }, 500);
    }
  }, [open]);

  // Close on route change and Escape.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header>
        <nav ref={navRef} className="nav" aria-label="Primary">
          <div className="nav__inner">
            <Link href="/" className="nav__brand" aria-label="Shanvia Tech Solutions, home" onClick={() => setOpen(false)}>
              <BrandMark />
              <span className="nav__wordmark">
                Shanvia<span style={{ color: "var(--signal)" }}>.</span>
              </span>
            </Link>

            <ul className="nav__links" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {PRIMARY.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="nav__actions">
              <Link ref={ctaRef} href="/reach-us" className="btn btn--signal nav__cta" style={{ minHeight: 44, padding: "0.7rem 1.1rem" }}>
                Start a project <Icon name="arrow" className="btn__arrow" />
              </Link>
              <button
                ref={toggleRef}
                type="button"
                className="nav__toggle"
                aria-expanded={open}
                aria-controls="site-menu"
                onClick={() => setOpen((v) => !v)}
              >
                <span className="nav__toggle-bars" aria-hidden="true" />
                <span>{open ? "Close" : "Menu"}</span>
              </button>
            </div>
          </div>
        </nav>

        <div
          ref={menuRef}
          id="site-menu"
          className="menu"
          role="dialog"
          aria-modal={open}
          aria-label="Site index"
          aria-hidden={!open}
        >
          <div className="menu__grid">
            {groups.map((group, gi) => (
              <nav key={group.title} aria-label={group.title} data-menu-fade>
                <p className="menu__group-title">{String(gi + 1).padStart(2, "0")} — {group.title}</p>
                <ul className={gi === 0 ? "menu__list" : "menu__sub"} style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {group.links.map((link) => (
                    <li key={`${group.title}-${link.href}`} className={gi === 0 ? undefined : undefined}>
                      {gi === 0 ? (
                        <Link href={link.href} className="menu__link" data-menu-item>
                          <span aria-hidden="true">{String(group.links.indexOf(link) + 1).padStart(2, "0")}</span>
                          {link.label}
                        </Link>
                      ) : (
                        <Link href={link.href} data-menu-item>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="menu__foot" data-menu-fade>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              {siteData?.email ? (
                <a href={`mailto:${siteData.email}`} className="muted">
                  {siteData.email}
                </a>
              ) : null}
              {siteData?.mobile ? (
                <a href={`tel:+91${siteData.mobile}`} className="muted">
                  +91 {siteData.mobile}
                </a>
              ) : null}
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              {siteData?.social_links?.linkedin ? (
                <a href={siteData.social_links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Icon name="linkedin" />
                </a>
              ) : null}
              {siteData?.social_links?.instagram ? (
                <a href={siteData.social_links.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Icon name="instagram" />
                </a>
              ) : null}
              {siteData?.social_links?.facebook ? (
                <a href={siteData.social_links.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Icon name="facebook" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

/** Mark: two offset signal squares. Carries the identity without a logo file. */
function BrandMark() {
  return (
    <svg className="nav__mark" viewBox="0 0 34 34" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="13" width="20" height="20" fill="var(--signal)" />
    </svg>
  );
}

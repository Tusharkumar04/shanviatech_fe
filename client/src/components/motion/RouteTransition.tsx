"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { resetScroll } from "@/motion/scroll";
import { veilIn, veilOut } from "@/motion/transitions";
import { prefersReducedMotion } from "@/motion/reducedMotion";

const labelFor = (href: string) => {
  const path = href.split(/[?#]/)[0].replace(/\/+$/, "");
  if (!path) return "Home";
  const last = path.split("/").filter(Boolean).pop() ?? "";
  return decodeURIComponent(last).replace(/[-_]+/g, " ") || "Home";
};

/**
 * Route transition: internal link click, then the veil covers the page, the
 * router swaps content underneath, and the veil lifts. Browser back/forward get
 * the same reveal. Modified clicks, new-tab links, and downloads keep native
 * behaviour.
 */
export default function RouteTransition() {
  const veilRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const routerRef = useRef(router);
  const busy = useRef(false);
  const firstRender = useRef(true);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  // Intercept internal navigation before the Next.js link handler runs.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.hasAttribute("download") || anchor.dataset.noTransition !== undefined) return;
      if (anchor.target && anchor.target !== "_self") return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      const veil = veilRef.current;
      event.preventDefault();
      event.stopPropagation();

      const href = `${url.pathname}${url.search}${url.hash}`;
      if (!veil || prefersReducedMotion()) {
        routerRef.current.push(href);
        return;
      }
      if (busy.current) return;
      busy.current = true;

      veil.querySelectorAll("[data-veil-label]").forEach((el) => {
        el.textContent = labelFor(href);
      });
      veil.classList.add("is-active");
      void veilIn(veil).then(() => routerRef.current.push(href));
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // Reveal after each route change.
  useEffect(() => {
    const veil = veilRef.current;
    if (!veil) return;
    busy.current = false;
    resetScroll();

    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (prefersReducedMotion()) return;

    // Forward navigation arrives with the veil already covering; back/forward
    // starts it covering here, so both lift the same way.
    veil.style.display = "block";
    veil.style.transform = "scaleY(1)";
    veil.classList.remove("is-active");
    void veilOut(veil);
  }, [pathname]);

  return (
    <div ref={veilRef} className="veil" aria-hidden="true">
      <span className="veil__label" data-veil-label />
    </div>
  );
}

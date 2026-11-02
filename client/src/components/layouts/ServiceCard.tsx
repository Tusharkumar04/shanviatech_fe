"use client";

import Link from "next/link";
import type { ServiceItem } from "@/context/ServiceContext";
import FrameImage from "@/components/ui/FrameImage";
import Icon from "@/components/ui/Icon";

interface ServiceCardProps {
  item: ServiceItem;
  index: number;
}

/**
 * A service as a single, fully clickable card. The picture reveals on scroll,
 * tilts on desktop, and the whole card is one link so keyboard and screen
 * reader users get one clear target.
 */
export default function ServiceCard({ item, index }: ServiceCardProps) {
  const href = item?.slug ? `/service/${item.slug}` : "/services";
  const name = item?.name || item?.title || "Service";

  return (
    <article className="rail__item card service-card" data-reveal-item>
      <Link href={href} className="service-card__link" data-cursor="view" data-cursor-label="Open">
        <span className="card__index">
          {String(index + 1).padStart(2, "0")} {item?.subtitle ? `— ${item.subtitle}` : ""}
        </span>
        <FrameImage src={item?.image} alt={name} aspect="wide" tilt />
        <span className="h3 service-card__title">{name}</span>
        <span className="service-card__more text-link" aria-hidden="true">
          Explore <Icon name="arrow" />
        </span>
      </Link>
    </article>
  );
}

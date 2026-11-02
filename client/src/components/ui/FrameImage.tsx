"use client";

import { useRef } from "react";
import { useImageReveal, useParallax, useTilt } from "@/motion/hooks";

type Aspect = "tall" | "wide" | "square" | "cinema" | "auto";

interface FrameImageProps {
  src?: string | null;
  alt: string;
  aspect?: Aspect;
  className?: string;
  /** Pointer-driven 3D tilt. Use sparingly, on cards that matter. */
  tilt?: boolean;
  /** Clip direction of the reveal. */
  direction?: "up" | "left" | "right";
  /** Vertical parallax of the picture inside its frame. */
  parallax?: number;
  priority?: boolean;
  /** Cursor label when hovered on desktop, e.g. "View". */
  cursor?: string;
}

/**
 * Cinematic image frame: clip reveal on scroll, optional tilt and internal
 * parallax. Falls back to a graphic placeholder when there is no picture.
 */
export default function FrameImage({
  src,
  alt,
  aspect = "wide",
  className = "",
  tilt = false,
  direction = "up",
  parallax,
  priority = false,
  cursor,
}: FrameImageProps) {
  const frame = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLImageElement>(null);

  useImageReveal(frame, direction);
  useTilt(frame, tilt ? 5 : undefined);
  useParallax(media, parallax);

  return (
    <div
      ref={frame}
      className={`frame frame--${aspect} ${className}`.trim()}
      data-tilt={tilt ? "" : undefined}
      data-cursor={cursor}
    >
      {src ? (
        <img
          ref={media}
          data-reveal-media
          className="frame__media"
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      ) : (
        <div className="frame__placeholder" role="img" aria-label={alt} style={placeholderStyle} />
      )}
    </div>
  );
}

const placeholderStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(circle at 30% 20%, rgba(198,255,61,0.18), transparent 45%), repeating-linear-gradient(135deg, rgba(238,234,225,0.05) 0 1px, transparent 1px 22px), #191c23",
};

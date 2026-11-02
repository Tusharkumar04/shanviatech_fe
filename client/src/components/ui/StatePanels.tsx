"use client";

import Link from "next/link";
import Icon from "./Icon";

/** Animated bars: the visual language of "data is arriving". */
export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="status status--center" role="status" aria-live="polite">
      <div className="status__bars" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <p className="mono muted" style={{ margin: 0 }}>
        {label}
      </p>
    </div>
  );
}

/** Skeleton blocks shaped like content, used where layout is known in advance. */
export function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid--3" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="card" style={{ minHeight: 320 }}>
          <div className="skeleton frame--wide frame" style={{ aspectRatio: "16 / 10" }} />
          <div className="skeleton" style={{ height: 22, width: "70%" }} />
          <div className="skeleton" style={{ height: 14, width: "90%" }} />
        </div>
      ))}
    </div>
  );
}

export function ErrorState({
  title = "Something didn't load",
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="status" role="alert">
      <span className="note" style={{ color: "var(--ember)" }}>
        Connection issue
      </span>
      <h3 className="status__title">{title}</h3>
      {message ? <p className="status__text">{message}</p> : null}
      {onRetry ? (
        <button type="button" className="btn" onClick={onRetry}>
          Try again <Icon name="arrow" className="btn__arrow" />
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="status">
      <span className="note">Nothing here yet</span>
      <h3 className="status__title">{title}</h3>
      {text ? <p className="status__text">{text}</p> : null}
      {action ? (
        <Link className="text-link" href={action.href}>
          {action.label} <Icon name="arrow" />
        </Link>
      ) : null}
    </div>
  );
}

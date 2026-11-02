import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes intelligently (conditional + conflict-resolving). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convert any string into a URL-safe slug (mirrors the backend slug logic). */
export function slugify(value = ''): string {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/** Human-friendly date, e.g. "27 May 2026". */
export function formatDate(value?: string | number | Date | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/** Date + time, e.g. "27 May 2026, 14:30". */
export function formatDateTime(value?: string | number | Date | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/** Relative time, e.g. "3 hours ago". */
export function timeAgo(value?: string | number | Date | null): string {
  if (!value) return '—';
  const date = new Date(value).getTime();
  if (Number.isNaN(date)) return '—';
  const diff = Date.now() - date;
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 1000 * 60 * 60 * 24 * 365],
    ['month', 1000 * 60 * 60 * 24 * 30],
    ['day', 1000 * 60 * 60 * 24],
    ['hour', 1000 * 60 * 60],
    ['minute', 1000 * 60],
    ['second', 1000],
  ];
  for (const [unit, ms] of units) {
    if (Math.abs(diff) >= ms || unit === 'second') {
      return rtf.format(-Math.round(diff / ms), unit);
    }
  }
  return 'just now';
}

/** Title-case a snake/kebab/camel string into "Nice Words". */
export function humanize(value = ''): string {
  return value
    .replace(/[_-]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Truncate text with an ellipsis. */
export function truncate(value = '', length = 80): string {
  return value.length > length ? `${value.slice(0, length).trimEnd()}…` : value;
}

/** Strip HTML tags for previews / plain-text excerpts. */
export function stripHtml(html = ''): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Read a File into a base64 data URL (used by the image uploader). */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Compact number formatting, e.g. 12.3k. */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en', { notation: 'compact' }).format(value);
}

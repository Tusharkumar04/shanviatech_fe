import type { ReactElement } from "react";
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { name: IconName };

export type IconName =
  | "arrow"
  | "arrow-up-right"
  | "play"
  | "close"
  | "prev"
  | "next"
  | "mail"
  | "phone"
  | "pin"
  | "facebook"
  | "instagram"
  | "linkedin"
  | "twitter"
  | "youtube"
  | "plus"
  | "minus"
  | "quote"
  | "external";

const paths: Record<IconName, ReactElement> = {
  arrow: <path d="M3 12h17M14 6l6 6-6 6" />,
  "arrow-up-right": <path d="M7 17 17 7M8 7h9v9" />,
  play: <path d="M8 5.5v13l10-6.5-10-6.5Z" fill="currentColor" stroke="none" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  prev: <path d="M15 5l-7 7 7 7" />,
  next: <path d="M9 5l7 7-7 7" />,
  mail: <path d="M3 6h18v12H3zM3 7l9 6 9-6" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  pin: <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />,
  facebook: <path d="M14 8h3V4h-3c-2.2 0-4 1.8-4 4v2H7v4h3v6h4v-6h3l1-4h-4V8Z" />,
  instagram: <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5-2.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />,
  linkedin: <path d="M5 9h3v10H5zM6.5 4a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2ZM10 9h3v1.4c.5-.9 1.6-1.7 3.2-1.7 3.2 0 3.8 2.1 3.8 4.8V19h-3v-4.8c0-1.2 0-2.7-1.6-2.7s-1.9 1.3-1.9 2.6V19h-3V9Z" />,
  twitter: <path d="M4 4h4.5l4 5.6L17.5 4H20l-6.2 7.2L20.5 20h-4.5l-4.3-6-5 6H4l6.5-7.5L4 4Z" />,
  youtube: <path d="M21 8.2a2.5 2.5 0 0 0-1.8-1.8C17.6 6 12 6 12 6s-5.6 0-7.2.4A2.5 2.5 0 0 0 3 8.2 26 26 0 0 0 2.6 12c0 1.3.1 2.6.4 3.8a2.5 2.5 0 0 0 1.8 1.8C7.4 18 12 18 12 18s5.6 0 7.2-.4a2.5 2.5 0 0 0 1.8-1.8c.3-1.2.4-2.5.4-3.8s-.1-2.6-.4-3.8ZM10 15V9l5 3-5 3Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  quote: <path d="M9 7H5v6h4v4H4v-4a4 4 0 0 1 4-4V7Zm10 0h-4v6h4v4h-5v-4a4 4 0 0 1 4-4V7Z" fill="currentColor" stroke="none" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />,
};

export default function Icon({ name, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}

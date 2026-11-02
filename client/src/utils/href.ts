/** Resolve CMS link values: absolute URLs stay as-is, bare paths become site paths. */
export const isExternalHref = (href?: string | null): boolean => !!href && /^https?:\/\//i.test(href);

export const hrefFor = (link?: string | null): string => {
  if (!link) return "#";
  if (isExternalHref(link) || link.startsWith("/") || link.startsWith("#") || link.startsWith("mailto:") || link.startsWith("tel:")) {
    return link;
  }
  return `/${link}`;
};

export const externalProps = (href: string) =>
  isExternalHref(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};

import Link from "next/link";
import SplitHeading from "./SplitHeading";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Opening block for inner pages: breadcrumb trail, an oversized split headline,
 * and an optional lede. Every inner page starts the same way, so the site
 * reads as one system.
 */
export default function Opener({
  crumbs,
  title,
  lede,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  lede?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="opener section--ink">
      <div className="opener__glow" aria-hidden="true" />
      <div className="wrap">
        <nav aria-label="Breadcrumb">
          <ol className="opener__crumbs">
            <li>
              <Link href="/">Home</Link>
            </li>
            {crumbs.map((crumb, i) => (
              <li key={`${crumb.label}-${i}`} aria-current={i === crumbs.length - 1 ? "page" : undefined}>
                {crumb.href && i < crumbs.length - 1 ? <Link href={crumb.href}>{crumb.label}</Link> : <span>{crumb.label}</span>}
              </li>
            ))}
          </ol>
        </nav>
        <SplitHeading as="h1" className="display opener__title">
          {title}
        </SplitHeading>
        {lede ? <p className="lede opener__lede">{lede}</p> : null}
        {children}
      </div>
    </header>
  );
}

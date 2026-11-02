import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import { humanize } from '@/lib/utils';
import { moduleMap } from '@/config/modules';

/** Derives a breadcrumb trail from the current path + module registry. */
export function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return <span className="text-sm font-semibold">Dashboard</span>;
  }

  const crumbs = segments.map((segment, index) => {
    const to = '/' + segments.slice(0, index + 1).join('/');
    const moduleByPath = Object.values(moduleMap).find(
      (m) => m.routePath === segment,
    );
    const label =
      moduleByPath?.title ??
      (segment === 'new' ? 'New' : segment === 'edit' ? 'Edit' : humanize(segment));
    return { to, label, isLast: index === segments.length - 1 };
  });

  return (
    <nav className="flex items-center gap-1.5 text-sm">
      <Link to="/" className="text-muted-foreground hover:text-foreground">
        Home
      </Link>
      {crumbs.map((crumb) => (
        <Fragment key={crumb.to}>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          {crumb.isLast ? (
            <span className="font-semibold text-foreground">{crumb.label}</span>
          ) : (
            <Link
              to={crumb.to}
              className="text-muted-foreground hover:text-foreground"
            >
              {crumb.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
